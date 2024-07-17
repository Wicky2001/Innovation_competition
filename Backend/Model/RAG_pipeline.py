from Model.models import *
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from huggingface_hub import InferenceClient
import requests
from groq import Groq


if __name__ == '__main__':
    # Create and split knowledge base
    knowledge_base = create_raw_knowledge_base(
        r"C:\Users\Wicky\Documents\Innovation_competition-main\Backend\PDF\chat_1721065237715\markingScheme")
    splited_knowledge_base = split_knowledge_base(512, knowledge_base)
    vector_db = create_vector_database(splited_knowledge_base)

    # Load tokenizer and model
    READER_MODEL_NAME = "HuggingFaceH4/zephyr-7b-beta"
    # tokenizer = AutoTokenizer.from_pretrained(READER_MODEL_NAME)

    user_query = "what is oop"

    # Perform similarity search
    retrieved_docs = vector_db.similarity_search(query=user_query, k=5)
    # print(retrieved_docs[0].page_content)

    # Prepare prompt in chat format
    prompt_template = """Using the information contained in the context,
    give a comprehensive answer to the question.
    Respond only to the question asked, response should be concise and relevant to the question.
    Provide the number of the source document when relevant.
    If the answer cannot be deduced from the context, do not give an answer.

    Context:
    {context}

    Question: {question}"""

    # Format the context
    retrieved_docs_text = [
        doc.page_content for doc in retrieved_docs
    ]
    context = "\nExtracted documents:\n"
    context += "".join(
        [f"Document {str(i)}:::\n" + doc for i, doc in enumerate(retrieved_docs_text)]
    )

    feedback_question = (
        "Question: What is OOP?\n\n"
        "Student's Answer: OOP is object-oriented programming.\n\n"
        "Marks Given by Teacher: 1 out of 5\n\n"
        "Request: Explain why the student received this mark. Provide brief feedback on what was missed and suggest how the student could improve their answer to achieve a higher score. Additionally, provide an example of a well-written answer that would receive a higher mark.your response shhould not be exceeds 300 words"
    )

    # Create the final prompt
    final_prompt = prompt_template.format(
        question=feedback_question, context=context
    )

    print(final_prompt)

    # # Initialize InferenceClient
    # client = InferenceClient(
    #     "HuggingFaceH4/zephyr-7b-beta",
    #     token="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",
    # )
    #
    # # Request completion from the model
    # for message in client.chat_completion(
    #     messages=[{"role": "user", "content": final_prompt}],
    #     max_tokens=500,
    #     stream=True,
    # ):
    #     print(message.choices[0].delta.content, end="")
    # API_URL = "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B"
    # headers = {"Authorization": "Bearer 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"}
    #
    #
    # def query(payload):
    #     response = requests.post(API_URL, headers=headers, json=payload)
    #     return response.json()
    #
    #
    # output = query({
    #   "inputs": final_prompt,
    # })

    # print(output)
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
        max_tokens=512,
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
            print(delta.content, end="")

    print("\nComplete Response:\n\n\n\n\n", response_text)
