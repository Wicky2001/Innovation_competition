import glob
import os
import cv2
import numpy as np
import re

from groq import Groq
from reportlab.lib.pagesizes import letter
from reportlab.platypus import HRFlowable
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, PageBreak


from google.cloud import vision
from pdf2image import convert_from_path




def convert_pdf_to_images(pdf_folder_path):
    """
    Converts PDF files in a folder to images.

    input type:
        pdf_folder_path: str
            Path to the folder that contains PDF files.

    return:
        pdf : a list containing pdf objects
            Keys:
                - "pdf_name": str
                    File name of the PDF without extension.
                - "pdf_images": list


    """

    # Set the path to the folder containing your PDF files

    pdf_file_paths = glob.glob(f'{pdf_folder_path}/*.pdf')
    # print(pdf_file_paths)
    # print(pdf_file_paths) #debug code
    pdf_list = []

    try:
        # clear array before inserting images
        pdf_list.clear()
        for file_path in pdf_file_paths:
            # convert pdf to images
            images = convert_from_path(file_path,poppler_path=r"C:\Users\Wicky\Documents\Innovation_competition-main\Model\poppler-24.07.0\Library\bin")
            converted_images = []
            for image in images:
                # Convert PIL image to a numpy array
                numpy_image = np.array(image)

                # Convert RGB to BGR (OpenCV format)
                opencv_image = cv2.cvtColor(numpy_image, cv2.COLOR_RGB2BGR)

                converted_images.append(opencv_image)

            # get the pdf name
            file_name_without_extension = os.path.splitext(os.path.basename(file_path))[0]
            # print(file_name_without_extension)

            # create a dictionary including filename and the images of that pdf
            pdf = {"pdf_name": file_name_without_extension, "pdf_images": converted_images}

            # add converted pdf to a list
            pdf_list.append(pdf)

        return pdf_list


    except Exception as e:
        print(f"An error occurred when converting pdf to images: {e}")


def extract_the_text_from_CV2image(cv2_image):
    """
          Use Google vision api to read text from given image

          returns
            text

           """

    # Use environment variable for credentials
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"C:\Users\Wicky\Documents\Innovation_competition-main\Model\credentials\avid-circle-432005-d6-500c180b6ddf.json"

    client = vision.ImageAnnotatorClient()

    # Here converting cv2 image in to jpg because cloud vision do not support cv2 format
    success, encoded_image = cv2.imencode('.jpg', cv2_image)
    content = encoded_image.tobytes()

    image = vision.Image(content=content)
    response = client.text_detection(image=image)
    texts = response.text_annotations

    text = ""

    for text in texts:
        description = text.description
        text = description
        break

    if response.error.message:
        raise Exception(
            "{}\nFor more info on error messages, check: "
            "https://cloud.google.com/apis/design/errors".format(response.error.message)
        )

    return text


def get_text_from_pdf(pdf_list):
    """
        Read pdf images and extract their texts.

        input type:
             A List containing below type of objects
                   pdf = {"pdf_name": file_name_without_extension, "pdf_images": converted_images}

                          pdf_name : string
                          pdf_images : list containing cv2 images
        return:
             A List containing below type of objects
                   pdf = {"pdf_name": file_name_without_extension, "pdf_text": text_of_pdf}

                   pdf_name : string
                   pdf_text : string



        """

    pdf_list_with_text = []

    for pdf in pdf_list:

        pdf_name = pdf['pdf_name']
        pdf_images = pdf['pdf_images']

        text_of_pdf = ""
        for image in pdf_images:
            text_of_image = extract_the_text_from_CV2image(image)  # This function is written using google vision api
            text_of_pdf += text_of_image.replace('\n', '')#remove \n from the text


        pdf = {"pdf_name": pdf_name, "pdf_text": text_of_pdf}

        pdf_list_with_text.append(pdf)

    return pdf_list_with_text


def extract_question_and_answers(pdf_list_with_pdf_name_and_pdf_text):
    """
            Extract questions and answers.

            input type:
                 A List containing below type of objects
                       pdf = {"pdf_name": file_name_without_extension, "pdf_text": all the text of pdf}

                              pdf_name : string
                              pdf_text : string
            return:
                 A List containing below type of objects
                       pdf = {"pdf_name": file_name_without_extension, "questions": questions,"answers":answers}

                       pdf_name : string
                       questions : A list containing all the questions
                       answers : A list containing all the answers



            """

    pdf_list_with_answers_questions = []
    for pdf in pdf_list_with_pdf_name_and_pdf_text:
        pdf_name = pdf['pdf_name']
        pdf_text = pdf['pdf_text']
        questions = re.findall(r'\[([^\]]+)\]', pdf_text)
        answers = re.findall(r'\{([^\}]+)\}', pdf_text)
        print("Found question = ",questions)
        print("Found answers = ", answers)


        pdf = {"pdf_name":pdf_name,"questions":questions,"answers":answers}
        pdf_list_with_answers_questions.append(pdf)

    return pdf_list_with_answers_questions


def create_pdf_report(data, base_dir):
    # Ensure the base directory exists
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)

    for student in data:
        # student_dir = os.path.join(base_dir, student['pdf_name'])
        # # Create directory for the student if it does not exist
        # if not os.path.exists(student_dir):
        #     os.makedirs(student_dir)

        # Create the PDF file path
        filename = os.path.join(base_dir, f"{student['pdf_name']}_report.pdf")

        # Create a PDF document with margins
        doc = SimpleDocTemplate(filename, pagesize=letter,
                                rightMargin=40, leftMargin=40,
                                topMargin=40, bottomMargin=40)
        elements = []

        # Get styles
        styles = getSampleStyleSheet()
        title_style = styles['Heading1']
        centered_title_style = ParagraphStyle(
            'CenteredTitle',
            parent=title_style,
            alignment=1,  # 1 for center alignment
        )


        normal_style = styles['Normal']

        # Modify normal_style to make "Question" bold
        bold_label_style = ParagraphStyle(
            'BoldQuestion',
            parent=normal_style,
            fontName='Helvetica-Bold'
        )
        feedback_label_style = ParagraphStyle(
            'BoldLabel',
            fontName='Helvetica-Bold',
            fontSize=11,
            textColor=colors.red,  # Set the text color to red

        )
        marks_label_style = ParagraphStyle(
            'BoldLabel',
            fontName='Helvetica-Bold',
            fontSize=11,
            textColor=colors.darkgreen,  # Set the text color to red

        )

        # Add student number as heading
        student_number = student['pdf_name']
        elements.append(Paragraph(f"STUDENT NUMBER: {student_number}", centered_title_style))
        elements.append(Spacer(1, 12))  # Add space after heading

        # Add questions, answers, marks, and feedback
        for i in range(len(student['questions'])):
            question = student['questions'][i]
            answer = student['answers'][i]
            mark = student['marks'][i]
            feedback = student['feedbacks'][i]
            elements.append(HRFlowable(width="100%", thickness=0.5, lineCap='butt', color=colors.black))
            elements.append(Spacer(1, 12))
            elements.append(Paragraph(f"<b>Question:</b> ", bold_label_style))
            elements.append(Paragraph(question, normal_style))
            elements.append(Spacer(1, 6))

            elements.append(Paragraph(f"<b>Your Answer:</b> ", bold_label_style))
            elements.append(Paragraph(answer, normal_style))
            elements.append(Spacer(1, 6))

            elements.append(Paragraph(f"<b>Your Marks:</b> ", marks_label_style))
            elements.append(Paragraph(str(mark), normal_style))
            elements.append(Spacer(1, 6))

            elements.append(Paragraph(f"<b>Feedback:</b> ", feedback_label_style))
            elements.append(Paragraph(feedback, normal_style))
            elements.append(Spacer(1, 12))



        elements.append(HRFlowable(width="100%", thickness=0.5, lineCap='butt', color=colors.black))
        elements.append(PageBreak())

        # Build the PDF
        doc.build(elements)

    return  base_dir



def get_feedback_for_text_prompt(text_array):
    """
                   input type:
                     [{"answers":[text_data["answerText"]],"markingText":[text_data["markingText"]]}]

                   return:
                    question_answer_array = [{"answers":[text_data["answerText"]],"markingText":[text_data["markingText"]]}]

                   """
    prompt_template = """Using the information contained in the context,
       give a comprehensive answer to the question.
       Respond only to the question asked, response should be concise and relevant to the question.
       Provide the number of the source document when relevant.
       If the answer cannot be deduced from the context, do not give an answer.

       Context:
       {context}

       Question: {question}"""


    teacher_answer = text_array[0]["answers"][0]
    student_answer = text_array[0]["markingText"][0]
    marks_givenByTeacher = text_array[0]["marks"][0]

    print("Marks given by teacher = ",marks_givenByTeacher)
    prompt = (
        f"Teacher Answer: {teacher_answer}\n\n"
        f"Student's Answer: {student_answer}\n\n"
        f"Marks Given by Teacher: {marks_givenByTeacher} out of 5\n\n"
        "Request: Explain why the student received this mark. Provide concise feedback on what was missed and suggest "
        "how the student could improve their answer to achieve a higher score. Additionally, provide an example of a "
        "well-written answer that would receive a higher mark.feedback shoulld not exceeds 100 words."
    )


    client = Groq(api_key="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")
    completion = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {
                "role": "user",
                "content": prompt
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




