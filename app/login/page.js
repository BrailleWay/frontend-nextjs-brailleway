// File: app/login/page.js

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/forms/LoginForm";
import { revalidatePath } from "next/cache";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    revalidatePath("/homepage"); 
    redirect("/homepage");
  }
  if (session?.error) {
    revalidatePath("/");
    redirect("/");
  }
  return (
    <LoginForm session={session} />
  );
}