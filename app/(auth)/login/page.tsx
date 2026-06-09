import { AuthForm } from "@/components/auth/AuthForm";
import { signIn } from "@/app/(auth)/actions";

export default function LoginPage() {
  return <AuthForm mode="signIn" action={signIn} />;
}
