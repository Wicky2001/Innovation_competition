from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello, World!'
@app.route('/submit', methods=['POST'])
def submit_data():
    data = request.json  # Parse JSON data from the request body
    print("This is data received = ",data)
    # Process the data
    # For example, return the received data as a response
    return jsonify(data)
if __name__ == '__main__':
    app.run(port=5000)
