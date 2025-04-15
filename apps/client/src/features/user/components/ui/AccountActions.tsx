import { Button } from "@/components/ui/button";

export function AccountActions() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Account Actions</h2>
      <div className="space-x-4">
        <Button variant="outline">Change Password</Button>
        <Button variant="destructive">Delete Account</Button>
      </div>
    </div>
  );
}
