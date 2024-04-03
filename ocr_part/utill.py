import glob
import os
import cv2
import numpy as np

from google.cloud import vision
from pdf2image import convert_from_path

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
          Use google vision api to read text from given image

          :returns
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
        Red pdf images and extract their texts.

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
            text_of_pdf += text_of_image

        pdf = {"pdf_name": pdf_name, "pdf_text": text_of_pdf}

        pdf_list_with_text.append(pdf)


list_of_pdf = convert_pdf_to_images(pdf_folder_path)
get_text_from_pdf(list_of_pdf)
