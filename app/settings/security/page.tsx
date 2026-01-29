"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SecuritySettingsPage() {
  const supabase = createSupabaseBrowserClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChangePassword = async () => {
    setMessage(null);
    if (!password || password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setPassword("");
    setConfirmPassword("");
    setMessage("Password updated successfully.");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900">Security</h2>
      <p className="text-sm text-gray-600 mt-1">
        Update your password and security settings.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">New Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Confirm Password</label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      {message && (
        <p className={`text-sm mt-3 ${message.includes("success") ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}

      <div className="mt-4">
        <Button onClick={handleChangePassword} disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </div>
  );
}

