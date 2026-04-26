"use client";

import FormField from "../shared/FormField";
import { useForm } from "@/hooks/useForm";
import AuthForm from "./AuthForm";

export default function LoginForm() {
  const { handleSubmit, email, password, setEmail, setPassword, error } =
    useForm("login");

  return (
    <AuthForm error={error} type="Log in" handleSubmit={handleSubmit}>
      <FormField
        id="login-email"
        testId="auth-login-email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <FormField
        id="login-password"
        testId="auth-login-password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />
    </AuthForm>
  );
}
