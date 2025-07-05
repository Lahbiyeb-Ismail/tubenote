"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { UserSettingsPanel } from "./user-settings-panel";
// import { useToast } from "@/hooks/use-toast";

export function UserNotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    noteReminders: true,
    weeklyDigest: true,
    securityAlerts: true,
    marketingEmails: false,
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
      //   title: "Settings Saved",
      //   description: "Your notification preferences have been updated.",
      // });
    }, 1000);
  };

  return (
    <UserSettingsPanel title="Notification Preferences" description="Manage your notification preferences for updates and activities.">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Email Notifications</h3>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="email-notifications" className="text-sm font-medium">Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={() => handleToggle("emailNotifications")}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="note-reminders" className="text-sm font-medium">Note Reminders</Label>
              <p className="text-sm text-gray-500">Get reminded about important notes</p>
            </div>
            <Switch
              id="note-reminders"
              checked={settings.noteReminders}
              onCheckedChange={() => handleToggle("noteReminders")}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="weekly-digest" className="text-sm font-medium">Weekly Digest</Label>
              <p className="text-sm text-gray-500">Receive a weekly summary of your notes</p>
            </div>
            <Switch
              id="weekly-digest"
              checked={settings.weeklyDigest}
              onCheckedChange={() => handleToggle("weeklyDigest")}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Push Notifications</h3>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="push-notifications" className="text-sm font-medium">Push Notifications</Label>
              <p className="text-sm text-gray-500">Receive push notifications on your device</p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.pushNotifications}
              onCheckedChange={() => handleToggle("pushNotifications")}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Security & Marketing</h3>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="security-alerts" className="text-sm font-medium">Security Alerts</Label>
              <p className="text-sm text-gray-500">Important security notifications</p>
            </div>
            <Switch
              id="security-alerts"
              checked={settings.securityAlerts}
              onCheckedChange={() => handleToggle("securityAlerts")}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="marketing-emails" className="text-sm font-medium">Marketing Emails</Label>
              <p className="text-sm text-gray-500">Receive updates about new features and tips</p>
            </div>
            <Switch
              id="marketing-emails"
              checked={settings.marketingEmails}
              onCheckedChange={() => handleToggle("marketingEmails")}
            />
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
