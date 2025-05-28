# Automatic Paper Marking Tool

This is the official repository for **Grading.AI** – a smart, AI-powered exam paper marking tool built for the **Innovation Competition** by **FutureGen**.

## 🚀 Why Grading.AI?

Lecturers around the world face increasing burdens due to the rising student-to-teacher ratio, often exceeding global standards (e.g., 38:1 at SLIIT, 67:1 in the Philippines). Manual grading is time-consuming, inconsistent, and lacks actionable feedback.

Grading.AI addresses this by providing:

- 📄 Automated PDF-based exam grading
- 🤖 Feedback aligned with marking schemes
- 📊 Comprehensive student performance summaries
- 🔁 Batch grading capabilities
- 📈 AI-enhanced, personalized feedback

---

## 🧠 Tech Stack & Architecture

- **Backend**: Node.js – Manages API requests and system logic
- **Frontend**: React – Responsive UI for teachers and students
- **Model**: Python – RAG (Retrieval-Augmented Generation) + Classification powered by Groq API
- **OCR**: Google Vision API
- **Storage**: Structured PDF file handling

### Repository Structure

```
Innovation_Competition/
├── Backend/       # Node.js backend
├── frontend/      # React frontend
├── Model/         # Python model (RAG + classifier)
├── Storage/PDF/   # PDF exam file storage
├── Images/        # Assets and visual documentation
```

---

## 🌟 Features

| Feature                           | Description                                          |
| --------------------------------- | ---------------------------------------------------- |
| 📥 PDF Upload                     | Upload handwritten or typed student exam PDFs        |
| 🧮 Auto Grading                   | Automatically evaluate papers with the trained model |
| 🗃️ Batch Support                  | Grade all student submissions at once                |
| 📝 Feedback Reports               | Personalized feedback per paper                      |
| 📋 Summary Reports                | Aggregated performance reports                       |
| 🔐 Groq & Google Vision APIs      | Cutting-edge AI integrations                         |
| 🌐 Multilingual Support (Planned) | Extendable to local language papers                  |

---

## 📦 Setup Instructions

### Prerequisites

- Node.js & npm
- Python 3.x
- Groq API Key
- Google Vision API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/Innovation_Competition.git
cd Innovation_Competition

# Backend setup
cd Backend
npm install

# Frontend setup
cd ../frontend
npm install

# Model setup
cd ../Model
pip install -r requirements.txt
```

### Running the Project

```bash
# Start Backend
cd Backend
node app.js

# Start Frontend
cd ../frontend
npm start

# Run Model
cd ../Model
python model.py
```

---

## 🧪 Usage Instructions

1. Upload student exam PDFs in the specified format.
2. Let the model evaluate answers and assign scores.
3. Receive:

   - Feedback reports per student
   - A summary report for the full batch

**\[Screenshots Coming Soon]**

---

## 🥇 Competitive Advantage

Compared to GradingAI, Synaptic, ZipGrade, and Geniebook:

| Feature                 | Grading.AI | Others |
| ----------------------- | ---------- | ------ |
| PDF Paper Evaluation    | ✅         | ❌     |
| Marking Scheme Feedback | ✅         | ❌     |
| Batch Grading Support   | ✅         | ❌     |
| Summary Report          | ✅         | ❌     |
| Personalized Feedback   | ✅         | ✅     |

---

## 🛣 Roadmap

- ✅ MVP with frontend/backend/model integration
- 🔄 Feedback loop from 5+ lecturers
- 🔜 Local language support
- 🔜 Complete examination platform with paper generation

---

## 💡 Subscription Plans

| Plan        | Target            | Features                         |
| ----------- | ----------------- | -------------------------------- |
| Free Plan   | Students/Teachers | Basic grading + limited feedback |
| API Plan    | Developers        | Model API access                 |
| Pro Plan    | Power Users       | Full feedback + summary reports  |
| Custom Plan | Institutions      | Custom workflows and integration |

---

## 📢 Go-to-Market Strategy

- **Students/Teachers**: Freemium model, referrals, social media
- **Institutions**: Pilot programs, workshops, partnerships
- **Developers**: Hackathons, tutorials, open APIs

---

## 👨‍💻 Meet the Team – _FutureGen_

Innovative minds from Sri Lanka, finalists of:

- TECHX 2023 (IEEE)
- Intellihack 3.0 (UCSC)
- GENESIZ '24 (KDU)
- Hackventure 1.0

---

## 📜 License

This project is licensed under the **MIT License**. Contributions are welcome!
