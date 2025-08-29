import { api } from "./api";
import type {
  RequestOtpRequest,
  RequestOtpResponse,
  VerifyOtpRequest,
  AuthResponse,
  GoogleAuthRequest,
} from "@shared/api";

export const authService = {
  requestOtp: (payload: RequestOtpRequest) =>
    api.post<RequestOtpResponse>("/api/auth/request-otp", payload),
  verifyOtp: (payload: VerifyOtpRequest) =>
    api.post<AuthResponse>("/api/auth/verify-otp", payload),
  google: (credential: string) =>
    api.post<AuthResponse>("/api/auth/google", { credential } as GoogleAuthRequest),
  me: () => api.get<AuthResponse>("/api/auth/me"),
  logout: () => api.post<{ message: string }>("/api/auth/logout"),
};
