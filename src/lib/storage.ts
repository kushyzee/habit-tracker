import { Session, User } from "@/types/auth";
import { STORAGE_KEYS } from "./constants";
import { Habit } from "@/types/habit";

export function getUsers() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

export function setUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getSession() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(session: Session | null) {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

export function getHabits() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
    return raw ? (JSON.parse(raw) as Habit[]) : [];
  } catch {
    return [];
  }
}

export function setHabits(habits: Habit[]) {
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
}
