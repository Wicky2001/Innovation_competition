import cv2
# alpha = 1.5 # Contrast control
# beta = 10 # Brightness control

import  easyocr

reader = easyocr.Reader(['en'], gpu=False)
img = cv2.imread(r"C:\Users\Wicky\Documents\GitHub\Innovation_competition\ocr_part\test_image_high_brightness.jpeg")


# call convertScaleAbs function


#It is mandatory to convert image to gray scale before apply threshold
img_gray_1 = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)



adaptive_thresh_1 = cv2.adaptiveThreshold(img_gray_1, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 21, 30)

# ret, simple_thresh = cv2.threshold(img_gray, 80, 255, cv2.THRESH_BINARY)





cv2.imshow('image_1_low_brightness', adaptive_thresh_1)


# cv2.imshow('image2_high_brightness', adaptive_thresh_2)
cv2.waitKey(0)
result = reader.readtext(adaptive_thresh_1)
all_text = ' '.join([text for _, text, _ in result])
print(all_text)


alpha = 1.5
beta = 10
img = cv2.imread(r"C:\Users\Wicky\Documents\GitHub\Innovation_competition\ocr_part\low_bright_ness.jpeg")
adjusted = cv2.convertScaleAbs(img, alpha=alpha, beta=beta)
ajusted_img_gray_1 = cv2.cvtColor(adjusted, cv2.COLOR_BGR2GRAY)
