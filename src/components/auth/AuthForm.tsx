import Link from "next/link";

interface AuthFormProps {
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  error: string | null;
  type: "Log in" | "Create account";
}

export default function AuthForm({
  handleSubmit,
  children,
  error,
  type,
}: AuthFormProps) {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      {children}
      {error && (
        <p role="alert" className="font-body text-sm text-error">
          {error}
        </p>
      )}

      <button
        type="submit"
        data-testid={
          type === "Log in" ? "auth-login-submit" : "auth-signup-submit"
        }
        className="
          w-full bg-accent text-white rounded-md
          py-3 px-6 font-body text-sm font-medium
          hover:bg-accent-hover active:translate-y-px
          transition-colors duration-150 cursor-pointer
        "
      >
        {type}
      </button>

      <p className="font-body text-sm text-center text-muted">
        {type === "Log in" ? "No account?" : "Already have an account?"}
        <Link
          href={type === "Log in" ? "/signup" : "/login"}
          className="font-body text-sm ml-1 text-accent hover:underline"
        >
          {type === "Log in" ? "Sign up" : "Log in"}
        </Link>
      </p>
    </form>
  );
}
