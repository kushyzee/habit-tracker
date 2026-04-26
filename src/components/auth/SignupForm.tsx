"use client";

import { useForm } from "@/hooks/useForm";
import AuthForm from "./AuthForm";
import FormField from "../shared/FormField";

export default function SignupForm() {
  const { handleSubmit, email, password, setEmail, setPassword, error } =
    useForm("signup");

  return (
    <AuthForm error={error} type="Create account" handleSubmit={handleSubmit}>
      <FormField
        id="signup-email"
        testId="auth-signup-email"
        label="Email"
        value={email}
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <FormField
        id="signup-password"
        testId="auth-signup-password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="new-password"
      />
    </AuthForm>
  );
}
