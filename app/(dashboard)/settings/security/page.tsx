"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Eye, EyeSlash, CheckCircle, Lock, Warning } from "@phosphor-icons/react";

export default function SecuritySettingsPage() {
  const supabase = createSupabaseBrowserClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangePassword = async () => {
    setMessage(null);
    if (!password || password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setMessage({ type: 'error', text: error.message });
      return;
    }
    setPassword("");
    setConfirmPassword("");
    setMessage({ type: 'success', text: 'Password updated successfully.' });
    setTimeout(() => setMessage(null), 5000);
  };

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordValid = password.length >= 6;

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Lock className="h-4 w-4 text-blue-600" weight="fill" />
            Change Password
          </h3>
          <p className="text-sm text-gray-500 mt-1">Update your password to keep your account secure.</p>
        </div>
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeSlash className="h-4 w-4" weight="regular" /> : <Eye className="h-4 w-4" weight="regular" />}
              </button>
            </div>
            {password && !passwordValid && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <Warning className="h-3 w-3" weight="fill" />
                Password must be at least 6 characters
              </p>
            )}
            {password && passwordValid && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" weight="fill" />
                Password strength: Good
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeSlash className="h-4 w-4" weight="regular" /> : <Eye className="h-4 w-4" weight="regular" />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <Warning className="h-3 w-3" weight="fill" />
                Passwords do not match
              </p>
            )}
            {passwordsMatch && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" weight="fill" />
                Passwords match
              </p>
            )}
          </div>

          {message && (
            <div className={`p-4 rounded-lg flex items-center gap-2 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4" weight="fill" />
              ) : (
                <Warning className="h-4 w-4" weight="fill" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          <Button 
            onClick={handleChangePassword} 
            disabled={loading || !password || !passwordsMatch}
            className="w-full sm:w-auto"
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 flex items-center gap-2 mb-3">
          <Shield className="h-4 w-4" weight="fill" />
          Security Tips
        </h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" weight="fill" />
            Use a unique password that you don't use for other accounts
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" weight="fill" />
            Include a mix of letters, numbers, and special characters
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" weight="fill" />
            Avoid using personal information like birthdays or names
          </li>
        </ul>
      </div>
    </div>
  );
}
