import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const { loginWithGoogle } = useAuth();
  const nav = useNavigate();
  const [error, setError] = useState<string | null>(null);

  async function onGoogle(credential?: string) {
    if (!credential) return;
    try {
      await loginWithGoogle(credential);
      nav("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Log in</h1>
      {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GoogleLogin onSuccess={(r) => onGoogle(r.credential)} onError={() => setError("Google login failed")} />
        </GoogleOAuthProvider>
      ) : (
        <p className="text-sm text-muted-foreground">Google login is unavailable until a client ID is configured.</p>
      )}
      {error && <p className="text-destructive text-sm mt-3">{error}</p>}
      <p className="text-sm text-muted-foreground mt-6">Use signup with email + OTP if you didn't use Google previously.</p>
    </div>
  );
}
