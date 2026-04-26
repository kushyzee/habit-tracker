import AuthPageWrapper from "@/components/auth/AuthPageWrapper";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthPageWrapper title="Start tracking">
      <SignupForm />
    </AuthPageWrapper>
  );
}
