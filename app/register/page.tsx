import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { getCurrentUser } from "@/lib/auth";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Use a strong password and a real address for your account profile."
      footerText="Already have an account?"
      footerHref="/login"
      footerLabel="Sign in"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
