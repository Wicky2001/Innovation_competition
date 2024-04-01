import glob
import os
import  cv2
import numpy as np
import easyocr
from pdf2image import convert_from_path, convert_from_bytes

pdf_folder_path = '../pdf_files'

def convert_pdf_to_images(pdf_folder_path):
    """
      :return type:

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

        return   pdf_list


    except Exception as e:
        print(f"An error occurred when converting pdf to images: {e}")




def get_text_from_images(pdf_list):
    """
        Extract text from images in PDF objects.

        :param pdf_objects: A list of PDF objects.
                            Each PDF object contains the name of the PDF file and a list of converted images.
                            Example PDF object: {"pdf_name": file_name_without_extension, "pdf_images": converted_images_list}
        :type pdf_objects: list

        :return: A list of PDF objects.
                 Each PDF object contains the name of the PDF file and the extracted text.
                 Example PDF object: {"pdf_name": file_name_without_extension, "pdf_text": String}
        :rtype: list




    """
    reader = easyocr.Reader(['en'], gpu=False)
    alpha = 1.5
    beta = 5

    for pdf in pdf_list:
        pdf_name = pdf['pdf_name']
        pdf_images = pdf['pdf_images']

        text_of_pdf = ""
        for image in pdf_images:
            adjusted_image = cv2.convertScaleAbs(image, alpha=alpha, beta=beta)
            adjusted_image_gray = cv2.cvtColor(adjusted_image, cv2.COLOR_BGR2GRAY)
            adjusted_image_gray_thres = cv2.adaptiveThreshold(adjusted_image_gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,cv2.THRESH_BINARY, 21,30)
            result = reader.readtext(image,paragraph = True)
            print(result)





list_of_pdf = convert_pdf_to_images(pdf_folder_path)
get_text_from_images(list_of_pdf)