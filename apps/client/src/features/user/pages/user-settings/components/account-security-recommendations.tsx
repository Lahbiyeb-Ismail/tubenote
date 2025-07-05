import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AccountSecurityRecommendations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Recommendations</CardTitle>
        <CardDescription>
          Tips to keep your account secure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-blue-900">Use a strong password</p>
              <p className="text-sm text-blue-700">Include uppercase, lowercase, numbers, and symbols</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-blue-900">Enable two-factor authentication</p>
              <p className="text-sm text-blue-700">Add an extra layer of security to your account</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-blue-900">Keep your email secure</p>
              <p className="text-sm text-blue-700">Make sure your email account is also protected</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
