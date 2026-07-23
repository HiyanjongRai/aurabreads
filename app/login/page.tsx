import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const params = await searchParams;

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in with your email and password to continue."
      footerText="New to AuraBeads?"
      footerHref="/register"
      footerLabel="Create an account"
    >
      <LoginForm registered={params.registered === "1"} />
    </AuthLayout>
  );
}
