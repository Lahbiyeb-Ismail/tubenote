import { AccountSecurityRecommendations } from "./account-security-recommendations";
import { UpdatePasswordCard } from "./update-password-card";
import { UserSettingsPanel } from "./user-settings-panel";

export function UserPasswordSettings() {
  return (
    <UserSettingsPanel title="Password & Security" description="Manage your password and security settings.">
      {/* Update Password */}
      <UpdatePasswordCard />

      {/* Two-Factor Authentication */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Two-Factor Authentication</span>
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="two-factor" className="text-sm font-medium">Enable 2FA</Label>
              <p className="text-sm text-gray-500">
                Use an authenticator app to generate verification codes
              </p>
            </div>
            <Switch
              id="two-factor"
              checked={twoFactorEnabled}
              onCheckedChange={handleTwoFactorToggle}
            />
          </div>

          {twoFactorEnabled && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium mb-2">
                Two-factor authentication is enabled
              </p>
              <p className="text-sm text-green-700">
                Your account is protected with 2FA. You'll need to enter a code from your authenticator app when signing in.
              </p>
            </div>
          )}
        </CardContent>
      </Card> */}

      {/* Security Recommendations */}
      <AccountSecurityRecommendations />
    </UserSettingsPanel>
  );
}
