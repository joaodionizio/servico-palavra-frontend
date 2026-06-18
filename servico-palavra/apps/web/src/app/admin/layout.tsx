import { AuthGate } from "@/components/auth/AuthGate";
import { AppShell } from "@/components/layout/AppShell";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthGate requiredRole="Admin">
      <AppShell admin>{children}</AppShell>
    </AuthGate>
  );
}
