import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card/40 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex items-center justify-between py-3">
          <Link to="/" className="font-extrabold tracking-tight text-lg">
            NoteStack
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/" className={({ isActive }) => (isActive ? "text-primary" : "text-muted-foreground hover:text-foreground")}>Home</NavLink>
            {user ? (
              <>
                <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "text-primary" : "text-muted-foreground hover:text-foreground")}>Dashboard</NavLink>
                <button className="text-muted-foreground hover:text-destructive" onClick={() => logout()}>Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={({ isActive }) => (isActive ? "text-primary" : "text-muted-foreground hover:text-foreground")}>Login</NavLink>
                <NavLink to="/signup" className={({ isActive }) => (isActive ? "text-primary" : "text-muted-foreground hover:text-foreground")}>Signup</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
