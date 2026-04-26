import { User } from "@/types/auth";
import { getSession, getUsers, setSession, setUsers } from "./storage";

export function signUp(email: string, password: string) {
  const users = getUsers();
  const exists = users.some((u) => u.email === email);

  if (exists) {
    return {
      error: "User already exists",
    };
  }

  const newUser: User = {
    id: crypto.randomUUID(),
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
