import { ResetPasswordForm } from "@/features/auth/components";

function ResetPasswordPage({ params }: { params: { token: string } }) {
  return <ResetPasswordForm token={params.token} />;
}

export default ResetPasswordPage;
