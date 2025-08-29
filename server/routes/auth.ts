import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { store } from "../store";
import type {
  RequestOtpRequest,
  RequestOtpResponse,
  VerifyOtpRequest,
  AuthResponse,
  GoogleAuthRequest,
  User,
} from "@shared/api";

export const cookieMiddleware = cookieParser();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const TOKEN_TTL_SEC = 60 * 60 * 24 * 7; // 7 days

function signToken(user: User) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: TOKEN_TTL_SEC,
  });
}

function setAuthCookie(res: any, token: string) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    maxAge: TOKEN_TTL_SEC * 1000,
    path: "/",
  });
}

export const requestOtp: RequestHandler = (req, res) => {
  const { email } = req.body as RequestOtpRequest;
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }
  const code = Math.floor(1000 + Math.random() * 900000)
    .toString()
    .slice(0, 6);
  store.otps.set(email.toLowerCase(), {
    code,
    expiresAt: Date.now() + 5 * 60_000,
  });
  const payload: RequestOtpResponse = { message: "OTP sent" };
  if (process.env.NODE_ENV !== "production") payload.devOtp = code;
  res.json(payload);
};

export const verifyOtp: RequestHandler = (req, res) => {
  const { email, otp, name } = req.body as VerifyOtpRequest;
  const record = store.otps.get(email?.toLowerCase() || "");
  if (!email || !otp || !record)
    return res.status(400).json({ error: "Invalid or expired OTP" });
  if (record.expiresAt < Date.now() || record.code !== otp)
    return res.status(401).json({ error: "Incorrect OTP" });

  store.otps.delete(email.toLowerCase());
  let user = store.users.get(email.toLowerCase());
  if (!user) {
    user = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      name: name || email.split("@")[0],
      provider: "email",
    };
    store.users.set(email.toLowerCase(), user);
  }
  const token = signToken(user);
  setAuthCookie(res, token);
  const resp: AuthResponse = { user };
  res.json(resp);
};

export const googleAuth: RequestHandler = async (req, res) => {
  const { credential } = req.body as GoogleAuthRequest;
  if (!credential) return res.status(400).json({ error: "Missing credential" });
  try {
    const r = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`,
    );
    if (!r.ok) return res.status(401).json({ error: "Invalid Google token" });
    const data = (await r.json()) as any;
    const email = (data.email as string)?.toLowerCase();
    let user = store.users.get(email);
    if (!user) {
      user = {
        id: crypto.randomUUID(),
        email,
        name: data.name,
        avatarUrl: data.picture,
        provider: "google",
      };
      store.users.set(email, user);
    }
    const token = signToken(user);
    setAuthCookie(res, token);
    const resp: AuthResponse = { user };
    res.json(resp);
  } catch (e) {
    res.status(500).json({ error: "Google auth failed" });
  }
};

export const me: RequestHandler = (req, res) => {
  const token =
    req.cookies?.token || (req.headers.authorization?.split(" ")[1] ?? null);
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = Array.from(store.users.values()).find(
      (u) => u.id === payload.sub,
    );
    if (!user) return res.status(401).json({ error: "Invalid session" });
    const resp: AuthResponse = { user };
    res.json(resp);
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const logout: RequestHandler = (_req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json({ message: "Logged out" });
};
