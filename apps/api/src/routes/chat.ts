import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { LANDING_PROMPT } from "../prompts/landing.prompt";

const chatRoutes = new Hono();

// Validation schema
const chatMessageSchema = z.object({
  sessionId: z.string(),
  message: z.string(),
  conversationHistory: z.array(z.any()).optional(),
});

// General chat message schema (for landing page)
const generalChatMessageSchema = z.object({
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

// POST /chat/general - Process general chat message (for landing page)
chatRoutes.post(
  "/general",
  zValidator("json", generalChatMessageSchema),
  async (c) => {
    const { message, conversationHistory } = c.req.valid("json");

    try {
      const groqApiKey = process.env.GROQ_API_KEY;
      if (!groqApiKey) {
        throw new Error("GROQ_API_KEY not configured");
      }

      // Prepare conversation history for GROQ
      const messages = [
        {
          role: "system",
          content: LANDING_PROMPT,
        },
        ...(conversationHistory || []),
        {
          role: "user",
          content: message,
        },
      ];

      // Call GROQ API
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: messages,
            temperature: 0.7,
            max_tokens: 1000,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("GROQ API error details:", errorText);
        throw new Error(
          `GROQ API error: ${response.statusText} - ${errorText}`
        );
      }

      const data = (await response.json()) as {
        choices: Array<{
          message: {
            content: string;
          };
        }>;
      };
      const botResponse =
        data.choices[0]?.message?.content ||
        "Lo siento, no pude procesar tu mensaje.";

      return c.json({
        message: botResponse,
        detectedIntent: "general",
        entities: {},
      });
    } catch (error) {
      console.error("General chat error:", error);
      return c.json(
        {
          message:
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
