"use client";

import { Lock, Settings as SettingsIcon, User } from "lucide-react";
import { Fragment, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { UserNotificationSettings, UserPasswordSettings, UserPrivacySettings } from "../components/settings";

export function UserSettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications");

  const tabs = [
    { id: "notifications", label: "Notifications", icon: SettingsIcon },
    { id: "privacy", label: "Privacy", icon: User },
    { id: "password", label: "Password", icon: Lock },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "notifications":
        return <UserNotificationSettings />;
      case "privacy":
        return <UserPrivacySettings />;
      case "password":
        return <UserPasswordSettings />;
      default:
        return <UserNotificationSettings />;
    }
  };

  return (
    <Fragment>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="lg:col-span-1 bg-white/90 backdrop-blur-xl border-0 shadow-xl h-fit">
          <CardContent className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
            <CardContent className="p-6">
              {renderTabContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </Fragment>
  );
}
