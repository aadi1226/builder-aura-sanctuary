import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { notesService } from "@/services/notes";
import type { Note, NoteInput } from "@shared/api";

interface NotesState {
  notes: Note[];
  loading: boolean;
  refresh: () => Promise<void>;
  add: (input: NoteInput) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

const Ctx = createContext<NotesState | undefined>(undefined);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refresh() {
    setLoading(true);
    try {
      const data = await notesService.list();
      setNotes(data.notes);
    } finally {
      setLoading(false);
    }
  }

  async function add(input: NoteInput) {
    const note = await notesService.create(input);
    setNotes((prev) => [note, ...prev]);
  }

  async function remove(id: string) {
    await notesService.delete(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  const value = useMemo(() => ({ notes, loading, refresh, add, remove }), [notes, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNotes() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useNotes must be used within NotesProvider");
  return ctx;
}
