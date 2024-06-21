
#dummies
def get_marks_for_answers(answer):
    """
               input type:
                    answer : String
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
    return "Great job! Your explanation of routing in networking is clear and concise. You've accurately described routing as the process of selecting the best path for data packets and compared it to a traffic controller, which is an effective analogy. This thorough and understandable response is why you received full marks. Keep up the excellent work!"

def give_marks_for_descriptive_answers(pdf_list_with_answers_questions):
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
        answers = pdf["answers"]
        marks = []
        for answer in answers:
            marks_for_answer = get_marks_for_answers(answer)
            marks.append(marks_for_answer)
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







