# __init__.py

from .model import get_marks_for_question, get_feedback_for_answer, give_marks_for_descriptive_questions, give_feed_back_for_answers
from .RAG import create_raw_knowledge_base,split_knowledge_base,create_vector_database
__all__ = [
    'get_marks_for_question',
    'get_feedback_for_answer',
    'give_marks_for_descriptive_questions',
    'give_feed_back_for_answers',
    'create_raw_knowledge_base',
    'split_knowledge_base',
    'create_vector_database'
]
