"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { CheckCircle, Lock } from "@phosphor-icons/react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMatch = Boolean(password) && Boolean(confirmPassword) && password === confirmPassword;
  const passwordsDontMatch = Boolean(confirmPassword) && password !== confirmPassword;
  const passwordLongEnough = password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  };

  return (
    <div className="flex flex-col justify-center h-full">
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
            <Lock className="h-6 w-6 text-blue-600" weight="fill" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Set new password
          </h1>
          <p className="text-gray-600">
            Choose a strong password for your account.
          </p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" weight="fill" />
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-emerald-900">Password updated!</p>
                  <p className="text-sm text-emerald-700">
                    Your password has been reset successfully. Redirecting you to sign in...
                  </p>
                </div>
              </div>
            </div>
            <Link href="/login">
              <Button className="w-full h-12 text-base font-semibold">
                Go to sign in
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900" htmlFor="password">
                New Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  minLength={6}
                  className="pr-12 h-12 text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {password && (
                <p className={`text-xs flex items-center gap-1 ${passwordLongEnough ? 'text-emerald-600' : 'text-gray-500'}`}>
                  {passwordLongEnough ? (
                    <><Check className="h-3 w-3" /> At least 6 characters</>
                  ) : (
                    `${password.length}/6 characters minimum`
                  )}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className={`pr-12 h-12 text-base ${passwordsDontMatch ? 'border-red-400 focus-visible:ring-red-400' : ''} ${passwordsMatch ? 'border-emerald-500 focus-visible:ring-emerald-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {confirmPassword && (
                <p className={`text-xs flex items-center gap-1 ${passwordsMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                  {passwordsMatch ? (
                    <><Check className="h-3 w-3" /> Passwords match</>
                  ) : (
                    <><X className="h-3 w-3" /> Passwords do not match</>
                  )}
                </p>
              )}
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-700 font-medium" aria-live="polite">
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={loading || !passwordsMatch}
            >
              {loading ? "Updating password..." : "Reset password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
