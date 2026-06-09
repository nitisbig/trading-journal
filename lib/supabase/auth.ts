import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Returns the authenticated user, redirecting to /login when there is no session. */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
