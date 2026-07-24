import { requireUser } from "@/lib/auth";
import { SellerShell } from "@/components/seller/SellerShell";
import { redirect } from "next/navigation";

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  // Only SELLER and ADMIN can access the seller portal
  if (user.role !== "SELLER" && user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <SellerShell
      user={{
        name: user.name,
        email: user.email,
        role: user.role,
      }}
    >
      {children}
    </SellerShell>
  );
}
