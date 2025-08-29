import { api } from "./api";
import type { Note, NoteInput, NotesListResponse } from "@shared/api";

export const notesService = {
  list: () => api.get<NotesListResponse>("/api/notes"),
  create: (payload: NoteInput) => api.post<Note>("/api/notes", payload),
  delete: (id: string) => api.del<{ success: true }>(`/api/notes/${id}`),
};
