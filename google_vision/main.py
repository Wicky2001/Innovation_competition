import os
import cv2
from google.cloud import vision
# from google.cloud.vision import types
def extract_the_text_from_CV2image(cv2_image):




        # Use environment variable for credentials
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "../credentials/innovation-competition-a66b761b487c.json"

        client = vision.ImageAnnotatorClient()



        #Here converting cv2 image in to jpg because cloud vision do not support cv2 format
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


        return  text



# print(extract_the_text_from_image("test1.png"))