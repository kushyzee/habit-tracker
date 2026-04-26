import AuthPageWrapper from "@/components/auth/AuthPageWrapper";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthPageWrapper title="Welcome back">
      <LoginForm />
    </AuthPageWrapper>
  );
}
