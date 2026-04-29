import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { STORAGE_KEYS } from "@/lib/constants";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

function seedUser(email: string, password: string) {
  const users = [
    {
      id: "user-1",
      email,
      password,
      createdAt: new Date().toISOString(),
    },
  ];

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

describe("auth flow", () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
  });

  it("submits the signup form and creates a session", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(
      screen.getByTestId("auth-signup-email"),
      "test@example.com",
    );
    await user.type(screen.getByTestId("auth-signup-password"), "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    await waitFor(() => {
      const session = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.SESSION) ?? "null",
      );
      expect(session).not.toBeNull();
      expect(session.email).toBe("test@example.com");
    });

    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("shows an error for duplicate signup email", async () => {
    seedUser("existing@example.com", "password123");
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(
      screen.getByTestId("auth-signup-email"),
      "existing@example.com",
    );
    await user.type(screen.getByTestId("auth-signup-password"), "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "User already exists",
      );
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("submits the login form and stores the active session", async () => {
    seedUser("test@example.com", "password123");
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByTestId("auth-login-email"), "test@example.com");
    await user.type(screen.getByTestId("auth-login-password"), "password123");
    await user.click(screen.getByTestId("auth-login-submit"));

    await waitFor(() => {
      const session = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.SESSION) ?? "null",
      );
      expect(session).not.toBeNull();
      expect(session.email).toBe("test@example.com");
    });

    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("shows an error for invalid login credentials", async () => {
    seedUser("test@example.com", "correctpassword");
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByTestId("auth-login-email"), "test@example.com");
    await user.type(screen.getByTestId("auth-login-password"), "wrongpassword");
    await user.click(screen.getByTestId("auth-login-submit"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Invalid email or password",
      );
    });

    expect(mockPush).not.toHaveBeenCalled();
  });
});
