import { Suspense } from "react";
import { RecoveryAuthShell } from "@/components/auth/RecoveryAuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <RecoveryAuthShell>
      <Suspense fallback={<div className="p-8 text-sm text-slate-500 md:p-12">Carregando recuperação...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </RecoveryAuthShell>
  );
}
