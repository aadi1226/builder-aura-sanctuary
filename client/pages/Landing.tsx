import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="grid md:grid-cols-2 gap-10 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Capture ideas. Anywhere.</h1>
        <p className="text-muted-foreground mb-6 max-w-prose">
          A minimal, secure notes app. Sign up with email + OTP or Google. Create, view, and manage your notes with a clean, mobile‑first UI.
        </p>
        <div className="flex gap-3">
          <Link to="/signup" className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-5 py-2.5 font-medium hover:opacity-90">Get started</Link>
          <Link to="/login" className="inline-flex items-center justify-center rounded-md border px-5 py-2.5 font-medium hover:bg-accent">I have an account</Link>
        </div>
      </div>
      <div className="relative">
        <div className="aspect-[4/3] rounded-xl border bg-gradient-to-br from-primary/10 to-accent flex items-center justify-center">
          <span className="text-7xl">🗒️</span>
        </div>
      </div>
    </div>
  );
}
