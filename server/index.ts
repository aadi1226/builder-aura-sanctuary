import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import cookieParser from "cookie-parser";
import { cookieMiddleware, googleAuth, logout, me, requestOtp, verifyOtp } from "./routes/auth";
import { createNote, deleteNote, listNotes } from "./routes/notes";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cookieMiddleware);

  // Health/demo
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app.get("/api/demo", handleDemo);

  // Auth
  app.post("/api/auth/request-otp", requestOtp);
  app.post("/api/auth/verify-otp", verifyOtp);
  app.post("/api/auth/google", googleAuth);
  app.get("/api/auth/me", me);
  app.post("/api/auth/logout", logout);

  // Notes
  app.get("/api/notes", listNotes);
  app.post("/api/notes", createNote);
  app.delete("/api/notes/:id", deleteNote);

  return app;
}
