import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import * as dotenv from "dotenv";
import { authRoutes } from "./routes/auth";
import { businessRoutes } from "./routes/business";
import { appointmentRoutes } from "./routes/appointments";
import { chatRoutes } from "./routes/chat";

// Load environment variables
dotenv.config({ path: "../../.env" });

const app = new Hono();

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.route("/auth", authRoutes);
app.route("/businesses", businessRoutes);
app.route("/appointments", appointmentRoutes);
app.route("/chat", chatRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error("Error:", err);
  return c.json(
    {
      error: err.message || "Internal Server Error",
    },
    500
  );
});

const port = Number(process.env.API_PORT) || 3001;

console.log(`API Server started on port ${port} 🚀`);

export default {
  port,
  fetch: app.fetch,
};
