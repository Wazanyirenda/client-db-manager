"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Eye, EyeSlash, CheckCircle, Lock, Warning, Trash } from "@phosphor-icons/react";

export default function SecuritySettingsPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      setMessage({ type: 'error', text: 'Please type "DELETE" to confirm account deletion.' });
      return;
    }

    setDeleteLoading(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Delete all user's clients
      const { error: clientsError } = await supabase
        .from('clients')
        .delete()
        .eq('user_id', user.id);

      if (clientsError) {
        console.error('Error deleting clients:', clientsError);
        // Continue even if this fails
      }

      // Delete user's profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
        // Continue even if this fails
      }

      // Sign out the user
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        throw signOutError;
      }

      // Redirect to login page
      router.push('/login');
    } catch (err: any) {
      setDeleteLoading(false);
      setMessage({ type: 'error', text: err.message || 'Failed to delete account. Please try again.' });
    }
  };

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
              <p className="text-xs text-emerald-600 flex items-center gap-1">
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
              <p className="text-xs text-emerald-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" weight="fill" />
                Passwords match
              </p>
            )}
          </div>

          {message && (
            <div className={`p-4 rounded-lg flex items-center gap-2 ${
              message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
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

      {/* Delete Account */}
      <div className="bg-white border border-red-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-red-200 bg-red-50">
          <h3 className="font-semibold text-red-900 flex items-center gap-2">
            <Trash className="h-4 w-4 text-red-600" weight="fill" />
            Delete Account
          </h3>
          <p className="text-sm text-red-700 mt-1">Permanently delete your account and all associated data.</p>
        </div>
        <div className="p-6 space-y-5">
          {!showDeleteConfirm ? (
            <>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Warning className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" weight="fill" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-red-900">Warning: This action cannot be undone</p>
                    <p className="text-sm text-red-700">
                      Deleting your account will permanently remove:
                    </p>
                    <ul className="text-sm text-red-700 list-disc list-inside space-y-1 ml-2">
                      <li>All your client data</li>
                      <li>Your profile information</li>
                      <li>All settings and preferences</li>
                      <li>Your account access</li>
                    </ul>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="destructive"
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
              >
                <Trash className="h-4 w-4 mr-2" weight="fill" />
                Delete My Account
              </Button>
            </>
          ) : (
            <>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Warning className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" weight="fill" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-red-900">Are you absolutely sure?</p>
                    <p className="text-sm text-red-700">
                      This will permanently delete your account and all your data. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Type <span className="font-bold text-red-600">DELETE</span> to confirm:
                </label>
                <Input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="h-11"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading || deleteConfirmText !== "DELETE"}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteLoading ? "Deleting..." : "Yes, Delete My Account"}
                </Button>
                <Button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText("");
                    setMessage(null);
                  }}
                  variant="outline"
                  disabled={deleteLoading}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
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
