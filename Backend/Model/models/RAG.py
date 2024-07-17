from langchain_community.document_loaders import PyPDFLoader
from langchain.docstore.document import Document as LangchainDocument
from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import List
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores.utils import DistanceStrategy
import os, shutil
from transformers import pipeline
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig

EMBEDDING_MODEL_NAME = "thenlper/gte-small"

def create_raw_knowledge_base(marking_scheme_folder_path):
    """
    This function takes a folder path which contains marking scheme PDFs, reads all the PDFs
    inside it, creates a LangChain document object using each PDF file, and returns a list
    containing those document objects.

    :input: folder path which contains marking schemes

    :param marking_scheme_folder_path: str
    :return: RAW_KNOWLEDGE_BASE: List
    """
    pdf_files = [f for f in os.listdir(marking_scheme_folder_path) if f.endswith('.pdf')]
    print("Marking scheme path = ", marking_scheme_folder_path)
    print(pdf_files)

    loaders = []
    for pdf_file in pdf_files:
        try:
            loader = PyPDFLoader(os.path.join(marking_scheme_folder_path, pdf_file))
            document = loader.load()
            if not document:
                print(f"Warning: Empty file encountered: {pdf_file}")
            else:
                loaders.append(loader)
        except Exception as e:
            print(f"Error loading file {pdf_file}: {e}")

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
    DB_PATH = "./VECTOR_DATABASE"
    for filename in os.listdir(DB_PATH):
        file_path = os.path.join(DB_PATH, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))

    KNOWLEDGE_VECTOR_DATABASE.save_local(DB_PATH)

    return  KNOWLEDGE_VECTOR_DATABASE
    # NEW_KNOWLEDGE_VECTOR_DATABASE = FAISS.load_local("/content/db", embedding_model, allow_dangerous_deserialization=True)
    #
    # return NEW_KNOWLEDGE_VECTOR_DATABASE
    # user_query = "what is kernal?"
    #
    # docs = NEW_KNOWLEDGE_VECTOR_DATABASE.similarity_search(user_query)
    #
    # docs[0]


def create_reader_llm():
    READER_MODEL_NAME = "HuggingFaceH4/zephyr-7b-beta"

    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_use_double_quant=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.bfloat16,
    )
    model = AutoModelForCausalLM.from_pretrained(
        READER_MODEL_NAME, quantization_config=bnb_config
    )
    tokenizer = AutoTokenizer.from_pretrained(READER_MODEL_NAME)

    READER_LLM = pipeline(
        model=model,
        tokenizer=tokenizer,
        task="text-generation",
        do_sample=True,
        temperature=0.2,
        repetition_penalty=1.1,
        return_full_text=False,
        max_new_tokens=500,
    )

