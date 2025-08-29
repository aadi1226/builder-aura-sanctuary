import type { Note, User } from "@shared/api";

export const store = {
  users: new Map<string, User>(), // key: email
  otps: new Map<string, { code: string; expiresAt: number }>(),
  notes: new Map<string, Note[]>(), // key: userId
};
