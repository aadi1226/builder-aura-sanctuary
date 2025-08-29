import { useAuth } from "@/context/AuthContext";
import { useNotes } from "@/context/NotesContext";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const { notes, loading, add, remove, refresh } = useNotes();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !content.trim())
      return setError("Title and content are required");
    await add({ title: title.trim(), content: content.trim() });
    setTitle("");
    setContent("");
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Welcome{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="text-muted-foreground text-sm">{user?.email}</p>
      </div>

      <form onSubmit={onAdd} className="grid gap-3 md:grid-cols-[1fr,2fr,auto]">
        <input
          className="border rounded-md px-3 py-2"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border rounded-md px-3 py-2"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="rounded-md bg-primary text-primary-foreground px-4 py-2 font-medium">
          Add
        </button>
      </form>
      {error && <p className="text-destructive text-sm mt-2">{error}</p>}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <p className="text-muted-foreground">Loading notes…</p>}
        {!loading && notes.length === 0 && (
          <p className="text-muted-foreground">
            No notes yet. Create your first note above.
          </p>
        )}
        {notes.map((n) => (
          <article key={n.id} className="border rounded-lg p-4 bg-card">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg">{n.title}</h3>
              <button
                className="text-destructive hover:underline"
                onClick={() => remove(n.id)}
              >
                Delete
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
              {n.content}
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
