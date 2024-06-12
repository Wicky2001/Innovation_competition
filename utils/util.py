import glob
import os
import cv2
import numpy as np
import re
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.platypus import HRFlowable
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, PageBreak


from google.cloud import vision
from pdf2image import convert_from_path
from models import model

pdf_folder_path = '../pdf_files'


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

    pdf_list = []

    try:
        # clear array before inserting images
        pdf_list.clear()
        for file_path in pdf_file_paths:
            # convert pdf to images
            images = convert_from_path(file_path)
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
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "../credentials/innovation-competition-a66b761b487c.json"

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

        pdf = {"pdf_name":pdf_name,"questions":questions,"answers":answers}
        pdf_list_with_answers_questions.append(pdf)

    return pdf_list_with_answers_questions


def create_pdf_report(data, base_dir):
    # Ensure the base directory exists
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)

    for student in data:
        student_dir = os.path.join(base_dir, student['pdf_name'])
        # Create directory for the student if it does not exist
        if not os.path.exists(student_dir):
            os.makedirs(student_dir)

        # Create the PDF file path
        filename = os.path.join(student_dir, f"{student['pdf_name']}_report.pdf")

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

            elements.append(Paragraph(f"<b>Your Marks:</b> ", bold_label_style))
            elements.append(Paragraph(str(mark), normal_style))
            elements.append(Spacer(1, 6))

            elements.append(Paragraph(f"<b>Feedback:</b> ", bold_label_style))
            elements.append(Paragraph(feedback, normal_style))
            elements.append(Spacer(1, 12))


        # Add a page break between students (if there are multiple students)
        elements.append(HRFlowable(width="100%", thickness=0.5, lineCap='butt', color=colors.black))
        elements.append(PageBreak())

        # Build the PDF
        doc.build(elements)



