import { login, signUp } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useForm(type: "login" | "signup") {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);

    let result;
    if (type === "login") {
      result = login(email, password);
    }
    if (type === "signup") {
      result = signUp(email, password);
    }

    if (result?.error) {
      setError(result.error);
      return;
    }

    router.push("/dashboard");
  }

  return { handleSubmit, email, password, setEmail, setPassword, error };
}
