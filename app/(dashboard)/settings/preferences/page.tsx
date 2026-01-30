"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sliders, CheckCircle2 } from "lucide-react";

const SIDEBAR_COLLAPSED_KEY = "sidebar_collapsed";

export default function PreferencesSettingsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(SIDEBAR_COLLAPSED_KEY) : null;
    if (stored) setSidebarCollapsed(stored === "true");
  }, []);

  const handleSave = () => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(sidebarCollapsed));
    setMessage("Preferences saved.");
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Sliders className="h-5 w-5 text-blue-600" />
        Preferences
      </h2>
      <p className="text-sm text-gray-600 mt-1">
        Customize how your dashboard behaves.
      </p>

      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Sidebar Default State</label>
          <Select value={sidebarCollapsed ? "collapsed" : "expanded"} onValueChange={(v) => setSidebarCollapsed(v === "collapsed")}>
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Select default state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expanded">Expanded</SelectItem>
              <SelectItem value="collapsed">Collapsed</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">Choose whether the sidebar should be expanded or collapsed by default.</p>
        </div>
      </div>

      {message && (
        <p className="text-sm text-green-600 mt-4 flex items-center gap-1">
          <CheckCircle2 className="h-4 w-4" /> {message}
        </p>
      )}

      <div className="mt-6">
        <Button onClick={handleSave}>Save Preferences</Button>
      </div>
    </div>
  );
}

