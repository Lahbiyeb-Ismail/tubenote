import ResetPasswordForm from "@/components/forms/ResetPasswordForm";

function ResetPasswordPage({ params }: { params: { token: string } }) {
  return <ResetPasswordForm token={params.token} />;
}

export default ResetPasswordPage;
