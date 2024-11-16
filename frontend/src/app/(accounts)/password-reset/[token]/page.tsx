function ResetPasswordPage({ params }: { params: { token: string } }) {
	return <h1>{params.token}</h1>;
}

export default ResetPasswordPage;
