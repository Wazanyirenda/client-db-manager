"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, EnvelopeSimple, CheckCircle } from "@phosphor-icons/react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  };

  return (
    <div className="flex flex-col justify-center h-full">
      <div className="space-y-8">
        <div className="space-y-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" weight="bold" />
            Back to sign in
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Reset your password
          </h1>
          <p className="text-gray-600">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {sent ? (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" weight="fill" />
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-emerald-900">Check your email</p>
                  <p className="text-sm text-emerald-700">
                    We&apos;ve sent a password reset link to <strong>{email}</strong>. 
                    Click the link in the email to reset your password.
                  </p>
                  <p className="text-xs text-emerald-600 mt-2">
                    Didn&apos;t receive the email? Check your spam folder or try again.
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 text-base"
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
            >
              <EnvelopeSimple className="h-5 w-5 mr-2" weight="bold" />
              Try a different email
            </Button>

            <div className="text-center text-sm text-gray-600">
              Remember your password?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign in
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900" htmlFor="email">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 text-base"
              />
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
              disabled={loading || !email}
            >
              {loading ? "Sending link..." : "Send reset link"}
            </Button>

            <div className="text-center text-sm text-gray-600 pt-2">
              Remember your password?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
