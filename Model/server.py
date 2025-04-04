from flask import Flask, request, jsonify
# from tempData import pdf_list_with_pdf_name_and_pdf_text
from models import load_model, give_marks_for_descriptive_answers, give_feed_back_for_answers, \
    create_raw_knowledge_base, \
    split_knowledge_base, create_vector_database
from utils import convert_pdf_to_images, get_text_from_pdf, extract_question_and_answers, create_pdf_report,get_feedback_for_text_prompt

import os
import json

app = Flask(__name__)

# Step 1: Define a global variable for the model
marks_model = None


# Step 2: Create a function to load the model
def initialize_model():
    global marks_model
    marks_model = load_model()


@app.route('/markTexts', methods=['POST'])
def mark_texts():
    try:
        text_data = request.json.get('textData')
        if not text_data:
            return jsonify({"error": "No text data provided"}), 400

        # Process the text_data as needed
        # print("Received text data:", text_data)
        question_answer_array = [{"answers":[text_data["answerText"]],"markingText":[text_data["markingText"]]}]
        question_answer_list_with_marks = give_marks_for_descriptive_answers(question_answer_array, marks_model)
        feedback = get_feedback_for_text_prompt(question_answer_array)
        marks_givenByTeacher = question_answer_list_with_marks[0]["marks"][0]
        # print("This is feedback = ",feedback)


        # Mock processing result
        result = {"status": "success", "message": "Text processed successfully", "studentAnswer": text_data["answerText"],"marks":marks_givenByTeacher,"feedback":feedback}
        print(result)
        return jsonify(result), 200
    except Exception as e:
        print("Error processing request:", str(e))
        return jsonify({"error": "Internal server error"}), 500



@app.route('/createReports', methods=['POST'])
def create_reports():
    data = request.json  # Parse JSON data from the request body

    chatDirectoryName = data.get('chatDirectoryName')
    chatDirectoryPath = data.get('chatDirectoryPath')
    print(chatDirectoryName, chatDirectoryPath)

    baseDirectoryForReports = r'C:\Users\Wicky\Documents\Innovation_competition-main\Storage\REPORTS'
    reportDirectoryPathForEachChat = os.path.join(baseDirectoryForReports, chatDirectoryName)

    markingSchemeContainerName = 'markingScheme'
    studentAnswersContainerName = 'studentAnswers'

    markingSchemeContainerPath = os.path.join(chatDirectoryPath, markingSchemeContainerName)
    studentAnswersContainerPath = os.path.join(chatDirectoryPath, studentAnswersContainerName)
    print("student Answer Path =", studentAnswersContainerPath)

    knowledege_base = create_raw_knowledge_base(markingSchemeContainerPath)
    splited_knowledege_base = split_knowledge_base(512, knowledege_base)
    vector_db = create_vector_database(splited_knowledege_base)

    list_of_pdf = convert_pdf_to_images(studentAnswersContainerPath)
    pdf_list_with_pdf_name_and_pdf_text = get_text_from_pdf(list_of_pdf)
    print(pdf_list_with_pdf_name_and_pdf_text)
    question_answer_list = _answers(pdf_list_with_pdf_name_and_pdf_text)
    question_answer_list_with_marks = give_marks_for_descriptive_answers(question_answer_list, marks_model)
    question_answer_list_with_marks_feedbacks = give_feed_back_for_answers(question_answer_list_with_marks, vector_db)
    reports_location = create_pdf_report(question_answer_list_with_marks_feedbacks, reportDirectoryPathForEachChat)

    response_data = {
        'status': 'success',
        'reports_location': reports_location
    }

    # Print JSON response to standard output
    print(json.dumps(response_data))

    return jsonify(response_data)


# Step 3: Load the model when the server starts
if __name__ == '__main__':
    print("Loading model and starting Flask server... please wait until the server has fully started")
    initialize_model()
    app.run(port=5000)
