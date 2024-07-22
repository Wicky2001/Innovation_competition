import pandas as pd
import spacy
from tqdm import tqdm
import string
from transformers import BertTokenizer, BertModel

import torch
from torch import cuda
import torch.nn as nn
import torch.nn.functional as F
from sklearn.metrics import recall_score, f1_score, precision_score, cohen_kappa_score
import numpy as np




def accuracy(outputs, labels):
    _, preds = torch.max(outputs, dim=1)
    correct = torch.sum(preds == labels).item()
    total = len(labels)
    accuracy = correct / total
    return torch.tensor(accuracy)


class Model(nn.Module):
    def __init__(self, feature_size, num_layers, target_size, model_name, bidirectional, keep_prob):
        super(Model, self).__init__()
        self.keep_prob = keep_prob
        self.dropout = nn.Dropout(1 - self.keep_prob)
        self.feature_size = feature_size
        self.embeding_layer = BertModel.from_pretrained(model_name)

        # Linear transformations for Q, K, V from the same source
        self.key = nn.Linear(feature_size, feature_size)
        self.query = nn.Linear(feature_size, feature_size)
        self.value = nn.Linear(feature_size, feature_size)

        # LSTM layer
        self.lstm = nn.LSTM(feature_size, 256, num_layers, bidirectional=bidirectional, batch_first=True)

        # Linear and BatchNorm layers
        self.linear = nn.Linear(256 * 2 if bidirectional else 256, 256)
        self.bn1 = nn.BatchNorm1d(256)

        self.linear_1 = nn.Linear(256, 128)
        self.bn2 = nn.BatchNorm1d(128)

        self.linear_2 = nn.Linear(128, 6)
        # self.bn3 = nn.BatchNorm1d(64)

    def forward(self, x, attention_mask, mask=None):
        with torch.no_grad():
            outputs = self.embeding_layer(x, attention_mask=attention_mask)
            embedings = outputs.last_hidden_state

        # Apply linear transformations
        keys = self.key(embedings)
        queries = self.query(embedings)
        values = self.value(embedings)

        # Scaled dot-product attention
        scores = torch.matmul(queries, keys.transpose(-2, -1)) / torch.sqrt(
            torch.tensor(self.feature_size, dtype=torch.float32))

        # Apply mask (if provided)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)

        # Apply softmax
        attention_weights = F.softmax(scores, dim=-1)

        # Multiply weights with values
        output_of_attention = torch.matmul(attention_weights, values)

        lstm_out, (hidden, cell) = self.lstm(output_of_attention)

        if self.lstm.bidirectional:
            hidden = torch.cat([hidden[-2], hidden[-1]], dim=-1)
        else:
            hidden = hidden[-1]

        linear_out = self.bn1(self.linear(hidden))
        linear_out = F.relu(linear_out)
        linear_out = self.dropout(linear_out)

        linear_out_1 = self.bn2(self.linear_1(linear_out))
        linear_out_1 = F.relu(linear_out_1)

        linear_out_2 = self.linear_2(linear_out_1)
        linear_out_2 = F.relu(linear_out_2)

        out = F.softmax(linear_out_2, dim=1)

        return out, attention_mask

    def training_step(self, batch):

        inputs, targets, attention_mask = batch
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        inputs = inputs.to(device)
        attention_mask = attention_mask.to(device)
        targets = targets.to(device)

        outputs, attntion_weights = self(inputs, attention_mask)  # changed
        targets = targets.flatten()

        loss = F.cross_entropy(outputs, targets)
        probs = F.softmax(outputs, dim=1)

        acc = accuracy(probs, targets)
        return loss, acc

    def validation_step(self, batch):
        inputs, targets, attention_mask = batch
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        inputs = inputs.to(device)
        attention_mask = attention_mask.to(device)
        targets = targets.to(device)

        outputs, attntion_weights = self(inputs, attention_mask)
        targets = targets.flatten()  # changed
        # test code

        loss = F.cross_entropy(outputs, targets)
        # Convert outputs to probabilities

        probs = F.softmax(outputs, dim=1)
        acc = accuracy(probs, targets)

        # Convert probabilities to predicted classes
        _, preds = torch.max(probs, 1)



        return {
            'val_loss': loss.item(),
            'val_preds': preds.cpu(),
            'val_targets': targets.cpu(),
            'val_acc': acc
        }

    def validation_epoch_end(self, outputs):
        batch_losses = [torch.tensor(x['val_loss']) for x in outputs]
        val_loss = torch.stack(batch_losses).mean()  # Combine losses

        batch_accs = [torch.tensor(x['val_acc']) for x in outputs]
        val_acc = torch.stack(batch_accs).mean()  # Combine accuracies


        # return {'val_loss': epoch_loss.item(), 'val_acc': epoch_acc.item(),'val_precision': epoch_precision.item(),'val_recall': epoch_recall.item()}
        all_preds = torch.cat([x['val_preds'] for x in outputs])
        all_targets = torch.cat([x['val_targets'] for x in outputs])

        # Calculate precision and recall for the entire validation set
        precision = precision_score(all_targets, all_preds, average='weighted', zero_division=0)
        recall = recall_score(all_targets, all_preds, average='weighted', zero_division=0)
        weighted_kappa = cohen_kappa_score(all_targets, all_preds, weights='linear')

        return {
            'val_loss': val_loss,
            'val_acc': val_acc,
            'val_precision': precision,
            'val_recall': recall,
            'weighted_kappa': weighted_kappa

        }

    def predict_step(self, batch, batch_idx):
        inputs, targets = batch
        outputs = self(inputs)
        probs = torch.sigmoid(outputs)
        return probs

    def configure_optimizers(self):
        return torch.optim.Adam(self.parameters(), lr=self.learning_rate)

    def epoch_end(self, epoch, result):
        print(
            "Epoch [{}], train_accuracy:{:.4f}|train_loss: {:.4f}|val_loss: {:.4f}|val_acc: {:.4f}|val_precesion: {:.4f}|val_recall: {:.4f}|weighted_kappa_score: {:.4f}".format(
                epoch, result['train_accuracy'], result['train_loss'], result['val_loss'], result['val_acc'],
                result['val_precision'], result['val_recall'], result['weighted_kappa']))


def load_model():
    print("model loading started")
    feature_size = 1024
    num_layers = 2
    target_size = 6
    model_name = 'bert-large-uncased'
    bidirectional = True

    model = Model(feature_size=feature_size, num_layers=num_layers, target_size=target_size, model_name=model_name,
                  bidirectional=bidirectional, keep_prob=0.85)
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    # device = 'cpu'
    # Move the model to the GPU if available
    model = model.to(device)
    check_point_path = r"C:\Users\Wicky\Documents\Innovation_competition-main\Model\models\marks_giving_model_weights.pt"
    checkpoint = torch.load(check_point_path, map_location=torch.device(device))
    model.load_state_dict(checkpoint['model_state_dict'])
    print("Loading marks model is complete");
    return model


# Load the spaCy model
nlp = spacy.load('en_core_web_sm')

# Load the tokenizer
model_name = 'bert-large-uncased'
tokenizer = BertTokenizer.from_pretrained(model_name)


# Define the function to preprocess the input sentence
def preprocess_sentence(sentence):
    # Remove punctuation
    translator = str.maketrans('', '', string.punctuation)
    sentence = sentence.translate(translator)

    # Lemmatize the sentence
    doc = nlp(sentence)
    sentence = ' '.join([token.lemma_ for token in doc])

    # Convert to lowercase
    sentence = sentence.lower()

    return sentence


# Define the function to get the prediction
def get_marks(sentence,marks_model):
    # Preprocess the sentence
    model = marks_model
    sentence = preprocess_sentence(sentence)

    # Tokenize the sentence
    encoding = tokenizer.encode_plus(sentence, max_length=500, padding='max_length', truncation=True,
                                     return_tensors='pt')
    input_ids = encoding['input_ids'].flatten().unsqueeze(0)  # Flatten and add batch dimension
    attention_mask = encoding['attention_mask'].flatten().unsqueeze(0)  # Flatten and add batch dimension

    # Move tensors to the appropriate device
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    input_ids = input_ids.to(device)
    attention_mask = attention_mask.to(device)

    # Set the model to evaluation mode and make predictions
    model.eval()
    with torch.no_grad():
        outputs, _ = model(input_ids, attention_mask)

    # Get the predicted class
    _, preds = torch.max(outputs, dim=1)
    print("marks for answers = ",preds.item())

    return preds.item()
