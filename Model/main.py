import os
import sys
import json
from tempData import pdf_list_with_pdf_name_and_pdf_text
# main.py

from models import give_marks_for_descriptive_answers, give_feed_back_for_answers, create_raw_knowledge_base, \
    split_knowledge_base, create_vector_database
from utils import convert_pdf_to_images, get_text_from_pdf, extract_question_and_answers, create_pdf_report

# dummy function to create marking scheme
# def process_directory(dir_path):
#     print(dir_path)
#     files = os.listdir(dir_path)
#     num_files = len(files)
#     result = {
#     'from':'python',
#     'status': 'success',
#     'length': num_files,
#     'message': 'Processed input successfully'
#     }
#     return result


if __name__ == "__main__":
    # if len(sys.argv) < 2:
    #     print("Error: Directory path not provided.", file=sys.stderr)
    #     sys.exit(1)
    # else:
    # these two file paths are temporary placeholders
    chatDirectoryName = 'chat_1718948513306'
    chatDirectoryPath = r'C:\Users\Wicky\Documents\Innovation_competition-main\Storage\PDF\chat_1721065237715'
    # print("shape of sys.argv = ",sys.argv)
    # chatDirectoryPath = sys.argv[1]
    # chatDirectoryName = sys.argv[2]
    baseDirectoryForReports = r'C:\Users\Wicky\Documents\Innovation_competition-main\Storage\REPORTS'

    markingSchemeContainerName = 'markingScheme'
    studentAnswersContainerName = 'studentAnswers'

    markingSchemeContainerPath = os.path.join(chatDirectoryPath, markingSchemeContainerName)

    studentAnswersContainerPath = os.path.join(chatDirectoryPath, studentAnswersContainerName)
    reportDirectoryPathForEachChat = os.path.join(baseDirectoryForReports, chatDirectoryName)
    # print(studentAnswersContainerPath)
    # print(reportDirectoryPathForEachChat)

    # These two lines temporary hidden to save google Vision API credits
    # list_of_pdf = convert_pdf_to_images(studentAnswersContainerPath)
    # pdf_list_with_pdf_name_and_pdf_text = get_text_from_pdf(list_of_pdf)



    knowledege_base = create_raw_knowledge_base(
        markingSchemeContainerPath)
    # print("knowledge base = ", knowledege_base)
    splited_knowledege_base = split_knowledge_base(512, knowledege_base)
    # print("spitted = ", splited_knowledege_base)

    vector_db = create_vector_database(splited_knowledege_base)

    question_answer_list = extract_question_and_answers(pdf_list_with_pdf_name_and_pdf_text)
    question_answer_list_with_marks = give_marks_for_descriptive_answers(question_answer_list)
    question_answer_list_with_marks_feedbacks = give_feed_back_for_answers(question_answer_list_with_marks, vector_db)
    reports_location = create_pdf_report(question_answer_list_with_marks_feedbacks, reportDirectoryPathForEachChat)
    # print(question_answer_list_with_marks_feedbacks)

    response_data = {
        'status': 'success',
        'reports_location': reports_location
    }

    # Print JSON response to standard output
    (json.dumps(response_data))

    # print(json.dumps(result))  # convert to json
    # sys.stdout.flush()
