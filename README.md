# AI-Powered Resume Scanner

An AI-powered resume screening application that helps recruiters and hiring managers efficiently match candidates with job descriptions.

## Features

- **Multi-File Resume Upload**: Upload multiple resumes in PDF and DOCX formats.
- **Job Description Input**: Enter or paste job descriptions directly into the application.
- **NLP-Powered Skill Extraction**: Automatically extract relevant skills and competencies from resumes using OpenAI's API.
- **Candidate Scoring and Ranking**: Score and rank candidates based on job description requirements.
- **AI-Powered Feedback**: Generate actionable feedback for each candidate.

## Technology Stack

- **Frontend**: React with TypeScript, Material-UI
- **Backend**: FastAPI (Python)
- **NLP Engine**: OpenAI API
- **Storage (Optional)**: MongoDB

## Setup and Installation

### Prerequisites

- Node.js and npm
- Python 3.8 or newer
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Activate the virtual environment:
   ```
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Create a `.env` file in the backend directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Start the backend server:
   ```
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Upload one or more resumes (PDF or DOCX format)
2. Enter a job description
3. Click "Analyze Resumes" to process and score the candidates
4. View the ranked list of candidates and detailed feedback

## Future Enhancements

- User authentication and saved job descriptions
- Enhanced resume parsing for education, experience, and other factors
- Customizable scoring algorithms
- Integration with ATS systems 