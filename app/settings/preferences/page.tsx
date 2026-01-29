"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DASHBOARD_TAB_KEY = "dashboard_default_tab";

export default function PreferencesSettingsPage() {
  const [defaultTab, setDefaultTab] = useState("clients");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(DASHBOARD_TAB_KEY) : null;
    if (stored) setDefaultTab(stored);
  }, []);

  const handleSave = () => {
    localStorage.setItem(DASHBOARD_TAB_KEY, defaultTab);
    setMessage("Preferences saved.");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
      <p className="text-sm text-gray-600 mt-1">
        Customize how your dashboard behaves.
      </p>

      <div className="mt-4 space-y-2">
        <label className="text-sm font-medium text-gray-700">Default Dashboard Tab</label>
        <Select value={defaultTab} onValueChange={setDefaultTab}>
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Select default tab" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clients">Clients</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="insights">Insights</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {message && <p className="text-sm text-green-600 mt-3">{message}</p>}

      <div className="mt-4">
        <Button onClick={handleSave}>Save Preferences</Button>
      </div>
    </div>
  );
}

