import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authService } from "@/services/auth";
import type { User } from "@shared/api";

interface AuthState {
  user: User | null;
  loading: boolean;
  loginWithGoogle: (credential: string) => Promise<void>;
  verifyOtp: (email: string, otp: string, name?: string) => Promise<void>;
  requestOtp: (email: string) => Promise<string | undefined>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await authService.me();
        setUser(me.user);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const requestOtp = useCallback(async (email: string) => {
    const res = await authService.requestOtp({ email });
    return res.devOtp;
  }, []);

  const verifyOtp = useCallback(
    async (email: string, otp: string, name?: string) => {
      const { user } = await authService.verifyOtp({ email, otp, name });
      setUser(user);
    },
    [],
  );

  const loginWithGoogle = useCallback(async (credential: string) => {
    const { user } = await authService.google(credential);
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, requestOtp, verifyOtp, loginWithGoogle, logout }),
    [user, loading, requestOtp, verifyOtp, loginWithGoogle, logout],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
