# Clonchat Chatbot Service

FastAPI-based chatbot service for processing natural language and managing appointment scheduling conversations.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Development

Run the development server:
```bash
npm run dev
# or directly with uvicorn
uvicorn src.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

## API Endpoints

- `GET /health` - Health check
- `POST /process-message` - Process chatbot messages

## Future Enhancements

- Integration with LangChain/LangGraph
- RAG (Retrieval-Augmented Generation) for business-specific data
- Conversation history management
- Integration with external LLM APIs (Groq, OpenAI, etc.)

