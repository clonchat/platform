import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const chatRoutes = new Hono();

// Validation schema
const chatMessageSchema = z.object({
  sessionId: z.string(),
  message: z.string(),
  conversationHistory: z.array(z.any()).optional(),
});

// POST /chat/:businessId/message - Process chat message
chatRoutes.post(
  "/:businessId/message",
  zValidator("json", chatMessageSchema),
  async (c) => {
    const businessId = parseInt(c.req.param("businessId"));
    const { sessionId, message, conversationHistory } = c.req.valid("json");

    try {
      const chatbotUrl = process.env.CHATBOT_URL || "http://localhost:8000";

      // Forward request to chatbot service
      const response = await fetch(`${chatbotUrl}/process-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business_id: businessId,
          session_id: sessionId,
          user_message: message,
          conversation_history: conversationHistory || [],
        }),
      });

      if (!response.ok) {
        throw new Error(`Chatbot service error: ${response.statusText}`);
      }

      const data = (await response.json()) as {
        bot_response: string;
        detected_intent: string;
        entities: any;
      };

      return c.json({
        botResponse: data.bot_response,
        detectedIntent: data.detected_intent,
        entities: data.entities,
      });
    } catch (error) {
      console.error("Chat error:", error);
      return c.json(
        {
          botResponse:
            "Lo siento, estoy experimentando problemas técnicos. Por favor, intenta de nuevo.",
          detectedIntent: "error",
          entities: {},
        },
        500
      );
    }
  }
);

export { chatRoutes };
