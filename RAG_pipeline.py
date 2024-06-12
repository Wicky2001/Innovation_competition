from models import *
from utils import *

if __name__ == '__main__':
    knowledege_base = create_raw_knowledge_base(r"C:\Users\Wicky\Documents\GitHub\Innovation_competition\pdf_files")
    print("knowledge base = ", knowledege_base)
    splited_knowledege_base = split_knowledge_base(512, knowledege_base)
    print("spitted = ", splited_knowledege_base)

    create_vector_database(splited_knowledege_base)

