/**
 * Shared code between client and server
 */

// Generic API response wrappers
export interface ApiError {
  error: string;
  code?: string;
}

export interface ApiSuccess<T> {
  data: T;
}

// Auth
export interface User {
  id: string;
  name?: string;
  email: string;
  avatarUrl?: string;
  provider: "email" | "google";
}

export interface RequestOtpRequest {
  email: string;
}
export interface RequestOtpResponse {
  message: string;
  // For development only: echo OTP when NODE_ENV!=='production'
  devOtp?: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  name?: string;
}
export interface AuthResponse {
  user: User;
  token?: string; // Only when using authorization header storage; cookie otherwise
}

export interface GoogleAuthRequest {
  credential: string; // Google ID token from @react-oauth/google
}

// Notes
export interface NoteInput {
  title: string;
  content: string;
}
export interface Note extends NoteInput {
  id: string;
  createdAt: string;
}
export interface NotesListResponse {
  notes: Note[];
}
