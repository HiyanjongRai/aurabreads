import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  // Only ADMIN can access the admin portal
  if (user.role !== "ADMIN") {
    if (user.role === "SELLER") redirect("/seller");
    else redirect("/dashboard");
  }

  return (
    <AdminShell
      user={{
        name: user.name,
        email: user.email,
        role: user.role,
      }}
    >
      {children}
    </AdminShell>
  );
}
