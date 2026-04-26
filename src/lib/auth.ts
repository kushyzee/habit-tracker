import { User } from "@/types/auth";
import { getSession, getUsers, setSession, setUsers } from "./storage";

function generateId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r =
      typeof crypto !== "undefined" && crypto.getRandomValues
        ? (crypto.getRandomValues(new Uint8Array(1))[0] & 15) >>
          (c === "x" ? 0 : 1)
        : (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function signUp(email: string, password: string) {
  const users = getUsers();
  const exists = users.some((u) => u.email === email);

  if (exists) {
    return {
      error: "User already exists",
    };
  }

  const newUser: User = {
    id: generateId(),
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  setUsers([...users, newUser]);
  setSession({ userId: newUser.id, email: newUser.email });

  return { error: null };
}

export function login(email: string, password: string) {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return {
      error: "Invalid credentials",
    };
  }

  setSession({ userId: user.id, email: user.email });
  return { error: null };
}

export function logout() {
  setSession(null);
}

export function getCurrentSession() {
  return getSession();
}
