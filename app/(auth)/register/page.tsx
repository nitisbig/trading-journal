import { AuthForm } from "@/components/auth/AuthForm";
import { signUp } from "@/app/(auth)/actions";

export default function RegisterPage() {
  return <AuthForm mode="signUp" action={signUp} />;
}
