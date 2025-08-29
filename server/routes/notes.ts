import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { store } from "../store";
import type { Note, NoteInput, NotesListResponse } from "@shared/api";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

function requireUser(req: any) {
  const token = req.cookies?.token || (req.headers.authorization?.split(" ")[1] ?? null);
  if (!token) throw new Error("Missing token");
  const payload = jwt.verify(token, JWT_SECRET) as any;
  return payload.sub as string;
}

export const listNotes: RequestHandler = (req, res) => {
  try {
    const userId = requireUser(req);
    const notes = store.notes.get(userId) || [];
    const resp: NotesListResponse = { notes };
    res.json(resp);
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};

export const createNote: RequestHandler = (req, res) => {
  try {
    const userId = requireUser(req);
    const { title, content } = req.body as NoteInput;
    if (!title?.trim() || !content?.trim()) return res.status(400).json({ error: "Title and content required" });
    const note: Note = { id: crypto.randomUUID(), title: title.trim(), content: content.trim(), createdAt: new Date().toISOString() };
    const arr = store.notes.get(userId) || [];
    arr.unshift(note);
    store.notes.set(userId, arr);
    res.status(201).json(note);
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};

export const deleteNote: RequestHandler = (req, res) => {
  try {
    const userId = requireUser(req);
    const id = req.params.id;
    const arr = store.notes.get(userId) || [];
    const next = arr.filter((n) => n.id !== id);
    store.notes.set(userId, next);
    res.json({ success: true });
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};
