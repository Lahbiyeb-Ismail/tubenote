"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { UserSettingsPanel } from "./user-settings-panel";
// import { useToast } from "@/hooks/use-toast";

export function UserPrivacySettings() {
  const [settings, setSettings] = useState({
    profileVisibility: true,
    shareNotes: false,
    allowAnalytics: true,
    dataCollection: false,
    thirdPartySharing: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  // const { toast } = useToast();

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // toast({
      //   title: "Privacy Settings Updated",
      //   description: "Your privacy preferences have been saved.",
      // });
    }, 1000);
  };

  return (
    <UserSettingsPanel title="Privacy Settings" description="Manage your privacy preferences and data sharing.">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Profile & Sharing</h3>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="profile-visibility" className="text-sm font-medium">Public Profile</Label>
              <p className="text-sm text-gray-500">Make your profile visible to other users</p>
            </div>
            <Switch
              id="profile-visibility"
              checked={settings.profileVisibility}
              onCheckedChange={() => handleToggle("profileVisibility")}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="share-notes" className="text-sm font-medium">Share Notes</Label>
              <p className="text-sm text-gray-500">Allow others to see your shared notes</p>
            </div>
            <Switch
              id="share-notes"
              checked={settings.shareNotes}
              onCheckedChange={() => handleToggle("shareNotes")}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Data & Analytics</h3>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="analytics" className="text-sm font-medium">Usage Analytics</Label>
              <p className="text-sm text-gray-500">Help improve the app by sharing usage data</p>
            </div>
            <Switch
              id="analytics"
              checked={settings.allowAnalytics}
              onCheckedChange={() => handleToggle("allowAnalytics")}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="data-collection" className="text-sm font-medium">Data Collection</Label>
              <p className="text-sm text-gray-500">Allow collection of additional usage data</p>
            </div>
            <Switch
              id="data-collection"
              checked={settings.dataCollection}
              onCheckedChange={() => handleToggle("dataCollection")}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="third-party" className="text-sm font-medium">Third-party Sharing</Label>
              <p className="text-sm text-gray-500">Share data with trusted partners</p>
            </div>
            <Switch
              id="third-party"
              checked={settings.thirdPartySharing}
              onCheckedChange={() => handleToggle("thirdPartySharing")}
            />
          </div>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-semibold text-yellow-800 mb-2">Data Export & Deletion</h4>
          <p className="text-sm text-yellow-700 mb-3">
            You have the right to export or delete your personal data at any time.
          </p>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              Export Data
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </UserSettingsPanel>
  );
}
