from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv("../../.env")

app = FastAPI(
    title="Clonchat Chatbot Service",
    description="AI-powered chatbot service for appointment scheduling",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ConversationMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class ProcessMessageRequest(BaseModel):
    business_id: int
    session_id: str
    user_message: str
    conversation_history: Optional[List[Dict[str, Any]]] = []

class ProcessMessageResponse(BaseModel):
    bot_response: str
    detected_intent: str
    entities: Dict[str, Any]

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "chatbot",
        "version": "1.0.0"
    }

# Main endpoint for processing messages
@app.post("/process-message", response_model=ProcessMessageResponse)
async def process_message(request: ProcessMessageRequest):
    """
    Process a user message and return a bot response.
    
    MVP Implementation: Returns hardcoded responses.
    Future: Will integrate with LangChain/LangGraph and external LLM APIs.
    """
    try:
        user_message = request.user_message.lower()
        
        # Simple intent detection based on keywords (MVP placeholder logic)
        detected_intent = "general"
        entities = {}
        
        if any(word in user_message for word in ["hola", "buenos días", "buenas tardes", "hey", "hello"]):
            detected_intent = "greeting"
            bot_response = "¡Hola! Bienvenido a nuestro servicio de agendamiento de citas. ¿En qué puedo ayudarte hoy?"
        
        elif any(word in user_message for word in ["agendar", "cita", "reservar", "appointment", "book"]):
            detected_intent = "schedule_appointment"
            bot_response = "¡Perfecto! Me encantaría ayudarte a agendar una cita. ¿Qué día y hora te vendría bien?"
        
        elif any(word in user_message for word in ["horario", "disponibilidad", "available", "hours"]):
            detected_intent = "check_availability"
            bot_response = "Nuestro horario de atención es de lunes a viernes de 9:00 AM a 6:00 PM. ¿Qué día prefieres?"
        
        elif any(word in user_message for word in ["precio", "costo", "cuánto", "price", "cost"]):
            detected_intent = "pricing_inquiry"
            bot_response = "Con gusto te proporciono información sobre nuestros precios. ¿Qué servicio te interesa?"
        
        elif any(word in user_message for word in ["cancelar", "modificar", "cambiar", "cancel", "reschedule"]):
            detected_intent = "modify_appointment"
            bot_response = "Entiendo que necesitas modificar o cancelar una cita. Por favor proporcióname tu nombre o número de confirmación."
        
        elif any(word in user_message for word in ["gracias", "thank", "excelente", "perfecto"]):
            detected_intent = "gratitude"
            bot_response = "¡De nada! ¿Hay algo más en lo que pueda ayudarte?"
        
        elif any(word in user_message for word in ["adiós", "chao", "bye", "hasta luego"]):
            detected_intent = "farewell"
            bot_response = "¡Hasta luego! Que tengas un excelente día. No dudes en contactarnos si necesitas algo más."
        
        else:
            detected_intent = "general"
            bot_response = (
                "Entiendo. Estoy aquí para ayudarte con el agendamiento de citas. "
                "Puedo ayudarte a reservar una cita, consultar horarios disponibles o modificar citas existentes. "
                "¿Qué te gustaría hacer?"
            )
        
        return ProcessMessageResponse(
            bot_response=bot_response,
            detected_intent=detected_intent,
            entities=entities
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing message: {str(e)}"
        )

# Additional endpoint for future RAG integration
@app.post("/analyze-intent")
async def analyze_intent(message: str):
    """
    Future endpoint for more sophisticated intent analysis.
    Will use LangChain for complex NLP tasks.
    """
    return {
        "message": "Intent analysis endpoint - to be implemented",
        "input": message
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("CHATBOT_PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)

