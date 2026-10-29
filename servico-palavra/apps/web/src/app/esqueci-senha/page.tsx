import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { RecoveryAuthShell } from "@/components/auth/RecoveryAuthShell";

export default function ForgotPasswordPage() {
  return (
    <RecoveryAuthShell>
      <ForgotPasswordForm />
    </RecoveryAuthShell>
  );
}
