import { Header } from "@/components/dashboards";
import { UpdatePasswordForm, UpdateUserForm } from "@/features/user/components";

function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <Header title="Settings" />

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <UpdateUserForm />
        <UpdatePasswordForm />
      </div>
    </div>
  );
}

export default SettingsPage;
