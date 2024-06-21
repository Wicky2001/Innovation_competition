from langchain_community.document_loaders import PyPDFLoader
import os
from langchain.docstore.document import Document as LangchainDocument
from langchain.text_splitter import RecursiveCharacterTextSplitter
from transformers import AutoTokenizer
from typing import List
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores.utils import DistanceStrategy
import torch


EMBEDDING_MODEL_NAME = "thenlper/gte-small"

def create_raw_knowledge_base(marking_scheme_folder_path):
    """

    This function take folder path wich contain marking scheme pdf and read all the pdf
    inside it and create a lanchain document object using each pdf file and return a list
    which contain that document objects

    :input:
    folder path which contain marking scheme

    :param marking_scheme_folder_path:
    :return:
    RAW_KNOWLEDGE_BASE : List

    """
    pdf_files = [f for f in os.listdir(marking_scheme_folder_path) if f.endswith('.pdf')]
    print(pdf_files)

    # Create instances of PyPDFLoader for each PDF file
    loaders = []
    for pdf_file in pdf_files:
        try:
            loader = PyPDFLoader(os.path.join(marking_scheme_folder_path, pdf_file))
            loaders.append(loader)
        except Exception:
            print(f"Warning: Empty file encountered: {pdf_file}")
    RAW_KNOWLEDGE_BASE = []
    for loader in loaders:
        RAW_KNOWLEDGE_BASE.extend(loader.load())

    return RAW_KNOWLEDGE_BASE


def split_knowledge_base(
    chunk_size: int,
    knowledge_base: List[LangchainDocument]) -> List[LangchainDocument]:
    """

      this function will take list contain langchain Document objects.

      :param chunk_size: maximum token size one sentece can have
      :param knowledge_base: list contain laghain document objects
      :return:list that contain split content
    """



    MARKDOWN_SEPARATORS = [
        "\n#{1,6} ",
        "```\n",
        "\n\\*\\*\\*+\n",
        "\n---+\n",
        "\n___+\n",
        "\n\n",
        "\n",
        " ",
        "",
    ]
    tokenizer_name = "thenlper/gte-small"

    text_splitter = RecursiveCharacterTextSplitter.from_huggingface_tokenizer(
        AutoTokenizer.from_pretrained(tokenizer_name),
        chunk_size=chunk_size,
        chunk_overlap=int(chunk_size / 10),
        add_start_index=True,
        strip_whitespace=True,
        separators=MARKDOWN_SEPARATORS,
    )

    docs_processed = []
    for doc in knowledge_base:
        # print(type(doc))
        docs_processed += text_splitter.split_documents([doc])

    # Remove duplicates
    unique_texts = {}
    docs_processed_unique = []
    for doc in docs_processed:
        if doc.page_content not in unique_texts:
            unique_texts[doc.page_content] = True
            docs_processed_unique.append(doc)

    return docs_processed_unique



def create_vector_database(splitted_knowledege_base):
    """
    This function take split version of knowledege base and
    create vector database using Fasis

    :param splitted_knowledege_base:
    :return: none
    """
    if torch.cuda.is_available():
        # If CUDA is available, set the device to cuda
        device = torch.device("cuda")
        print("CUDA available. Using GPU.")
    else:
        # If CUDA is not available, set the device to cpu
        device = torch.device("cpu")
        print("CUDA not available. Using CPU.")

    EMBEDDING_MODEL_NAME = "thenlper/gte-small"
    embedding_model = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL_NAME,
        multi_process=True,
        model_kwargs={"device": device},  # you can specify cuda
        encode_kwargs={"normalize_embeddings": True},  # Set `True` for cosine similarity
    )

    KNOWLEDGE_VECTOR_DATABASE = FAISS.from_documents(
        splitted_knowledege_base, embedding_model, distance_strategy=DistanceStrategy.COSINE
    )

    """You can also save and load a FAISS index. This is useful so you don't have to recreate it everytime you use it.

    """

    KNOWLEDGE_VECTOR_DATABASE.save_local("./vector_database")

    # NEW_KNOWLEDGE_VECTOR_DATABASE = FAISS.load_local("/content/db", embedding_model,
    #                                                  allow_dangerous_deserialization=True)

    # user_query = "what is kernal?"
    #
    # docs = NEW_KNOWLEDGE_VECTOR_DATABASE.similarity_search(user_query)
    #
    # docs[0]




