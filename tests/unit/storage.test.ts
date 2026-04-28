import { describe, it, expect, beforeEach } from "vitest";
import {
  getUsers,
  setUsers,
  getSession,
  setSession,
  getHabits,
  setHabits,
} from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants";
import type { User, Session } from "@/types/auth";
import type { Habit } from "@/types/habit";

const mockUser: User = {
  id: "user-1",
  email: "test@example.com",
  password: "password123",
  createdAt: "2026-01-01T00:00:00.000Z",
};

const mockSession: Session = {
  userId: "user-1",
  email: "test@example.com",
};

const mockHabit: Habit = {
  id: "habit-1",
  userId: "user-1",
  name: "Drink Water",
  description: "",
  frequency: "daily",
  createdAt: "2026-01-01T00:00:00.000Z",
  completions: [],
};

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("getUsers", () => {
    it("returns empty array when no users are stored", () => {
      expect(getUsers()).toEqual([]);
    });

    it("returns parsed users from localStorage", () => {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([mockUser]));
      expect(getUsers()).toEqual([mockUser]);
    });

    it("returns empty array when localStorage contains invalid JSON", () => {
      localStorage.setItem(STORAGE_KEYS.USERS, "not-valid-json{{{");
      expect(getUsers()).toEqual([]);
    });
  });

  describe("setUsers", () => {
    it("writes users to localStorage", () => {
      setUsers([mockUser]);
      const raw = localStorage.getItem(STORAGE_KEYS.USERS);
      expect(JSON.parse(raw!)).toEqual([mockUser]);
    });
  });

  describe("getSession", () => {
    it("returns null when no session is stored", () => {
      expect(getSession()).toBeNull();
    });

    it("returns parsed session from localStorage", () => {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(mockSession));
      expect(getSession()).toEqual(mockSession);
    });

    it("returns null when localStorage contains invalid JSON", () => {
      localStorage.setItem(STORAGE_KEYS.SESSION, "not-valid-json{{{");
      expect(getSession()).toBeNull();
    });
  });

  describe("setSession", () => {
    it("writes session to localStorage", () => {
      setSession(mockSession);
      const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
      expect(JSON.parse(raw!)).toEqual(mockSession);
    });

    it("writes null to localStorage when session is null", () => {
      setSession(null);
      const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
      expect(JSON.parse(raw!)).toBeNull();
    });
  });

  describe("getHabits", () => {
    it("returns empty array when no habits are stored", () => {
      expect(getHabits()).toEqual([]);
    });

    it("returns parsed habits from localStorage", () => {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify([mockHabit]));
      expect(getHabits()).toEqual([mockHabit]);
    });

    it("returns empty array when localStorage contains invalid JSON", () => {
      localStorage.setItem(STORAGE_KEYS.HABITS, "not-valid-json{{{");
      expect(getHabits()).toEqual([]);
    });
  });

  describe("setHabits", () => {
    it("writes habits to localStorage", () => {
      setHabits([mockHabit]);
      const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
      expect(JSON.parse(raw!)).toEqual([mockHabit]);
    });
  });
});
