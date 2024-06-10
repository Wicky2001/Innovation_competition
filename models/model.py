
#dummies
def get_marks_for_question(question):
    """
               input type:
                    question : String
               return:
                    marks: int
               """
    return 3
def get_feedback_for_answer(question,answer,marks):
    """
                   input type:
                        question : String
                        answer :String
                        marks:int
                   return:
                        feedback: String
                   """
    return "looks good"


def give_marks_for_descriptive_questions(pdf_list_with_answers_questions):
    """
           input type:
                A List containing below type of objects
                      pdf = {"pdf_name": file_name_without_extension, "questions": questions,"answers":answers}

                             pdf_name : string
                             questions: list contain all questions
                             answers: list contain all answers
           return:
                A List containing below type of objects
                     pdf = {"pdf_name": file_name_without_extension, "questions": questions,"answers":answers,marks:marks}

                             pdf_name : string
                             questions: list contain all questions
                             answers: list contain all answers
                             marks: List contain marks for answers



           """

    for pdf in pdf_list_with_answers_questions:
        questions = pdf["questions"]
        marks = []
        feedbacks = []
        for question in questions:
            marks_for_question = get_marks_for_question(question)
            marks.append(marks_for_question)
        pdf["marks"] = marks
    return pdf_list_with_answers_questions

def give_feed_back_for_answers(pdf_list_with_answers_questions_marks):
    """


           input type:
                A List containing below type of objects
                      pdf = {"pdf_name": file_name_without_extension, "questions": questions,"answers":answers,marks:marks}

                             pdf_name : string
                             questions: list contain all questions
                             answers: list contain all answers
                             marks: List contain marks for answers
           return:
                A List containing below type of objects
                     pdf = {"pdf_name": file_name_without_extension, "questions": questions,"answers":answers,marks:marks,"feedbacks":feedback}

                             pdf_name : string
                             questions: list contain all questions
                             answers: list contain all answers
                             marks: List contain marks for answers
                             feedbacks: List contain feedback for each answer



           """

    for pdf in pdf_list_with_answers_questions_marks:
        questions = pdf["questions"]
        answers = pdf["answers"]
        marks = pdf["marks"]
        feedbacks = []
        for question,answer,mark in zip(questions,answers,marks):
            feedback_for_answer = get_feedback_for_answer(question,answer,mark)
            feedbacks.append(feedback_for_answer)
        pdf["feedbacks"] = feedbacks
    return pdf_list_with_answers_questions_marks







