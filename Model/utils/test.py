from huggingface_hub import InferenceClient

client = InferenceClient(
    "HuggingFaceH4/zephyr-7b-beta",
    token="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",
)

for message in client.chat_completion(
	messages=[{"role": "user", "content": "What is the capital of France?"}],
	max_tokens=500,
	stream=True,
):
    print(message.choices[0].delta.content, end="")
