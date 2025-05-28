from Backend.Model.utils import *
from Backend.Model.models import *



# list_of_pdf = convert_pdf_to_images(pdf_folder_path)
# print(get_text_from_pdf(list_of_pdf))

pdf_list_with_pdf_name_and_pdf_text = [{'pdf_name': 'CS_2020_035',
        'pdf_text': "University Of KelaniyeMid-term test[1.What are the "
                    "four pillars of Java?]{Encapsulation: Bundling data "
                    "and methods together to control access.Inheritance: "
                    "Creating new classes (subclasses) based on existing ones "
                    "(superclasses) to reusecode.Polymorphism: Allowing objects "
                    "of different classes to respond to the same method call"
                    " indifferent ways.Abstraction: Focusing on essential "
                    "details and hiding implementation specifics.}[2. "
                    "Shortly describe routing in networking.]{routing is the process of selecting the best path for data packets "
                    "to travel from their sourceto their destination across interconnected net"
                    "works. It's like a traffic controller for data,directing packets e"
                    "fficiently to their final point.}"},{'pdf_name': 'paper_sample_2',
        'pdf_text': "University Of KelaniyeMid-term test[1.What are the "
                    "four pillars of Java?]{Encapsulation: Bundling data "
                    "and methods together to control access.Inheritance: "
                    "Creating new classes (subclasses) based on existing ones "
                    "(superclasses) to reusecode.Polymorphism: Allowing objects "
                    "of different classes to respond to the same method call"
                    " indifferent ways.Abstraction: Focusing on essential "
                    "details and hiding implementation specifics.}[2. "
                    "Shortly describe routing in networking.]{routing is the process of selecting the best path for data packets "
                    "to travel from their sourceto their destination across interconnected net"
                    "works. It's like a traffic controller for data,directing packets e"
                    "fficiently to their final point.}"}]

report_directory = r"C:\Users\Wicky\Documents\GitHub\Innovation_competition\reports"
question_answer_list = extract_question_and_answers(pdf_list_with_pdf_name_and_pdf_text)
question_answer_list_with_marks = give_marks_for_descriptive_answers(question_answer_list)
question_answer_list_with_marks_feedbacks = give_feed_back_for_answers(question_answer_list_with_marks)
create_pdf_report(question_answer_list_with_marks_feedbacks,report_directory)
print(question_answer_list_with_marks_feedbacks)





