"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sliders, CheckCircle, Monitor, Sidebar } from "@phosphor-icons/react";

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
    setMessage("Preferences saved successfully!");
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Display Preferences */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Monitor className="h-4 w-4 text-blue-600" weight="fill" />
            Display Preferences
          </h3>
          <p className="text-sm text-gray-500 mt-1">Customize how the app looks and behaves.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Sidebar className="h-4 w-4 text-gray-400" weight="regular" />
              Sidebar Default State
            </label>
            <Select 
              value={sidebarCollapsed ? "collapsed" : "expanded"} 
              onValueChange={(v) => setSidebarCollapsed(v === "collapsed")}
            >
              <SelectTrigger className="h-11 max-w-sm">
                <SelectValue placeholder="Select default state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expanded">
                  <div className="flex items-center gap-2">
                    <span>Expanded</span>
                    <span className="text-xs text-gray-400">- Show sidebar with labels</span>
                  </div>
                </SelectItem>
                <SelectItem value="collapsed">
                  <div className="flex items-center gap-2">
                    <span>Collapsed</span>
                    <span className="text-xs text-gray-400">- Icons only</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Choose whether the navigation sidebar should be expanded or collapsed by default when you open the app.
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
          <Sliders className="h-4 w-4" weight="fill" />
          More Preferences Coming Soon
        </h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>- Theme customization (light/dark mode)</li>
          <li>- Email notification settings</li>
          <li>- Date and time format preferences</li>
          <li>- Default currency for deal values</li>
        </ul>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4">
        {message && (
          <span className="text-sm text-emerald-600 flex items-center gap-1">
            <CheckCircle className="h-4 w-4" weight="fill" />
            {message}
          </span>
        )}
        <Button onClick={handleSave} className="px-6">
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
