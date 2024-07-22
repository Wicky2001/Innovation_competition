from groq import Groq


# dummies
def get_marks_for_answers(answer):
    """
               input type:
                    answer : String
               return:
                    marks: int
               """
    return 3


def get_feedback_for_answer(question, answer, marks, vector_db):
    """
                   input type:
                        question : String
                        answer :String
                        marks:int
                   return:
                        feedback: String
                   """
    prompt_template = """Using the information contained in the context,
       give a comprehensive answer to the question.
       Respond only to the question asked, response should be concise and relevant to the question.
       Provide the number of the source document when relevant.
       If the answer cannot be deduced from the context, do not give an answer.

       Context:
       {context}

       Question: {question}"""

    user_query = question
    retrieved_docs = vector_db.similarity_search(query=user_query, k=5)
    retrieved_docs_text = [
        doc.page_content for doc in retrieved_docs
    ]
    context = "\nExtracted documents:\n"
    context += "".join(
        [f"Document {str(i)}:::\n" + doc for i, doc in enumerate(retrieved_docs_text)]
    )

    feedback_question = (
        f"Question: {question}\n\n"
        f"Student's Answer: {answer}\n\n"
        f"Marks Given by Teacher: {marks} out of 5\n\n"
        "Request: Explain why the student received this mark. Provide concise feedback on what was missed and suggest "
        "how the student could improve their answer to achieve a higher score. Additionally, provide an example of a "
        "well-written answer that would receive a higher mark.Be short and sweet"
    )
    final_prompt = prompt_template.format(
        question=feedback_question, context=context
    )
    # print("\n\nfinal_prompt = \n\n",final_prompt)

    client = Groq(api_key="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")
    completion = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {
                "role": "user",
                "content": final_prompt
            }
        ],
        temperature=1,
        max_tokens=1024,
        top_p=1,
        stream=True,
        stop=None,
    )

    response_text = ""
    for message in completion:
        # Each message contains chunks of the response
        delta = message.choices[0].delta
        if delta.content:
            response_text += delta.content
            # print(delta.content, end="")

    # print("\nComplete Response:\n\n\n\n\n", response_text)

    return response_text


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


def give_feed_back_for_answers(pdf_list_with_answers_questions_marks, vector_db):
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
        for question, answer, mark in zip(questions, answers, marks):
            feedback_for_answer = get_feedback_for_answer(question, answer, mark, vector_db)
            feedbacks.append(feedback_for_answer)
        pdf["feedbacks"] = feedbacks
    return pdf_list_with_answers_questions_marks
