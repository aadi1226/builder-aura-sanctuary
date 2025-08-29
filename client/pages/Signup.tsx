import { useState } from "react";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const emailSchema = z.string().email("Enter a valid email");
const otpSchema = z
  .string()
  .min(4, "OTP must be 4-6 digits")
  .max(6, "OTP must be 4-6 digits");

export default function Signup() {
  const { requestOtp, verifyOtp, loginWithGoogle } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | undefined>(undefined);

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    setLoading(true);
    try {
      const d = await requestOtp(email);
      setDevOtp(d);
      setStep("otp");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const eok = emailSchema.safeParse(email).success;
    const ook = otpSchema.safeParse(otp).success;
    if (!eok || !ook) return setError("Check your inputs");
    setLoading(true);
    try {
      await verifyOtp(email, otp, name || undefined);
      nav("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle(credential?: string) {
    if (!credential) return;
    try {
      setLoading(true);
      await loginWithGoogle(credential);
      nav("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create your account</h1>
      {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <div className="mb-6">
            <GoogleLogin
              onSuccess={(r) => onGoogle(r.credential)}
              onError={() => setError("Google login failed")}
            />
          </div>
        </GoogleOAuthProvider>
      ) : (
        <p className="text-sm text-muted-foreground mb-6">
          Google sign-up is unavailable until a client ID is configured.
        </p>
      )}
      <div className="border-t pt-6 mt-6">
        {step === "email" ? (
          <form onSubmit={handleRequestOtp} className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                className="w-full border rounded-md px-3 py-2"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                className="w-full border rounded-md px-3 py-2"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <button
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 font-medium disabled:opacity-60"
            >
              {loading ? <LoadingSpinner /> : "Send OTP"}
            </button>
            {devOtp && (
              <p className="text-xs text-muted-foreground">Dev OTP: {devOtp}</p>
            )}
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                className="w-full border rounded-md px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">OTP</label>
              <input
                className="w-full border rounded-md px-3 py-2"
                placeholder="Enter 4-6 digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <button
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 font-medium disabled:opacity-60"
            >
              {loading ? <LoadingSpinner /> : "Verify & Continue"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
