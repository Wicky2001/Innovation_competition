# Innovation Competition

This is a public repository for the **Innovation Competition** project. It consists of multiple components, including backend, frontend, model, and storage for PDF files.

## Repository Structure


- **Backend/** - Built using Node.js, handles all the requests.
- **Images/** - Includes assets related to the project, such as Google Vision API updates.
- **Model/** - Implemented using Python, includes a RAG + classification model.
- **Storage/PDF/** - Manages storage for PDF files.
- **frontend/** - Developed using React.


## Features

- **Backend**: Implements API requests and handles logic using Node.js.
- **Frontend**: React-based user interface.
- **Model**: Python-based RAG (Retrieval-Augmented Generation) + classification model.
- **Storage**: PDF storage and handling mechanisms.
- **Google Vision API**: Integrated for image recognition and processing.
- **Groq API**: Used to implement the RAG model (you must have a Groq API key to run this application).

## Setup Instructions

### Prerequisites
- Node.js & npm installed
- Python (for model-related work)
- Groq API key (mandatory for running the model)
- Google Vision API key(mandatory for ocr part)
- Database setup if required

### Installation
```bash
# Clone the repository
git clone https://github.com/your-repo/Innovation_Competition.git

# Navigate into the project directory
cd Innovation_Competition

# Install dependencies for backend
cd Backend
npm install

# Install dependencies for frontend
cd ../frontend
npm install

# Install dependencies for model
cd ../Model
pip install -r requirements.txt
```

### Running the Project
```bash
# Start backend server
cd Backend
node app.js  # Modify according to backend structure

# Start frontend
cd ../frontend
npm start

# Start model
cd ../Model
python model.py  # Modify if needed
```

## Usage Instructions

1. Upload student papers structured according to a specific format. [Include link to screenshots]
2. The system will process the documents using the RAG model and classification.
3. Once processed, a sample report will be generated. [Include link to screenshots]

## Screenshots of the Application
[Include relevant links/screenshots here]



## License
This project is licensed under the MIT License. Feel free to contribute and improve upon it!

---
Feel free to update this README with additional details specific to your project.

