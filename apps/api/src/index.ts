import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { authRoutes } from "./routes/auth";
import { businessRoutes } from "./routes/business";
import { appointmentRoutes } from "./routes/appointments";
import { chatRoutes } from "./routes/chat";
import { userRoutes } from "./routes/user";
import * as dotenv from "dotenv";

dotenv.config();

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

// Rutas
app.route("/auth", authRoutes);
app.route("/businesses", businessRoutes);
app.route("/appointments", appointmentRoutes);
app.route("/chat", chatRoutes);
app.route("/user", userRoutes);

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

serve(
  {
    fetch: app.fetch,
    port: port,
  },
  (info) => {
    console.log(`API Server started on http://localhost:${info.port} 🚀`);
  }
);
