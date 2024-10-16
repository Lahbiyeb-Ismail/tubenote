import Header from "@/components/dashboards/Header";
import UpdatePasswordForm from "@/components/settings/UpdatePasswordForm";
import UpdateProfileForm from "@/components/settings/UpdateProfileForm";

function SettingsPage() {
	return (
		<div className="min-h-screen bg-gray-100 p-4 md:p-8">
			<Header title="Settings" />

			<div className="grid md:grid-cols-2 gap-8 mt-8">
				<UpdateProfileForm />
				<UpdatePasswordForm />
			</div>
		</div>
	);
}

export default SettingsPage;
