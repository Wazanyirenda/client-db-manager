"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Eye, EyeOff, Check, X } from "lucide-react";

// Google icon component
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function SignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [role, setRole] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace("/");
      }
    };
    checkSession();
  }, [router]);

  // Real-time password validation
  const passwordsMatch = Boolean(password) && Boolean(confirmPassword) && password === confirmPassword;
  const passwordsDontMatch = Boolean(confirmPassword) && password !== confirmPassword;
  const passwordLongEnough = password.length >= 6;

  const handleGoogleSignUp = async () => {
    setError(null);
    setGoogleLoading(true);
    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }

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

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: fullName,
          company_name: companyName,
          phone,
          industry,
          website,
          role,
          company_size: companySize,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setSuccess(true);
    // Redirect to login after a short delay
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Google Sign Up Button */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 h-12 px-4 rounded-lg bg-white hover:bg-gray-50 text-gray-900 font-medium border-2 border-gray-200 shadow-sm transition-all hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleGoogleSignUp}
        disabled={googleLoading}
      >
        <GoogleIcon />
        {googleLoading ? "Redirecting..." : "Continue with Google"}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-gray-500 font-medium">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900" htmlFor="fullName">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900" htmlFor="email">
                Email <span className="text-red-500">*</span>
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
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900" htmlFor="phone">
                Phone
              </label>
              <PhoneInput
                value={phone}
                onChange={setPhone}
                placeholder="97 123 4567"
                defaultCountry="ZM"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900" htmlFor="website">
                Website
              </label>
              <Input
                id="website"
                type="url"
                autoComplete="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://acme.com"
                className="h-12 text-base"
              />
            </div>
          </div>
        </div>

        {/* Business Information Section */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Business Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900" htmlFor="companyName">
                Company / Organization
              </label>
              <Input
                id="companyName"
                type="text"
                autoComplete="organization"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Inc. (optional)"
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                Industry
              </label>
              <Select value={industry || undefined} onValueChange={setIndustry}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Real Estate">Real Estate</SelectItem>
                  <SelectItem value="Consulting">Consulting</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                Role / Position
              </label>
              <Select value={role || undefined} onValueChange={setRole}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Sales Rep">Sales Rep</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                Company Size
              </label>
              <Select value={companySize || undefined} onValueChange={setCompanySize}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10</SelectItem>
                  <SelectItem value="11-50">11-50</SelectItem>
                  <SelectItem value="51-200">51-200</SelectItem>
                  <SelectItem value="200+">200+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="space-y-4 pt-2 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Account Security</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-900"
                htmlFor="password"
              >
                Password <span className="text-red-500">*</span>
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
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {password && (
                <p className={`text-xs flex items-center gap-1 ${passwordLongEnough ? 'text-emerald-600' : 'text-gray-500'}`}>
                  {passwordLongEnough ? (
                    <>
                      <Check className="h-3 w-3" /> At least 6 characters
                    </>
                  ) : (
                    `${password.length}/6 characters minimum`
                  )}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-900"
                htmlFor="confirmPassword"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={`pr-12 h-12 text-base ${passwordsDontMatch ? 'border-red-400 focus-visible:ring-red-400 focus-visible:border-red-400' : ''} ${passwordsMatch ? 'border-emerald-500 focus-visible:ring-emerald-500 focus-visible:border-emerald-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {confirmPassword && (
                <p className={`text-xs flex items-center gap-1 ${passwordsMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                  {passwordsMatch ? (
                    <>
                      <Check className="h-3 w-3" /> Passwords match
                    </>
                  ) : (
                    <>
                      <X className="h-3 w-3" /> Passwords do not match
                    </>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-700 font-medium" aria-live="polite">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <p className="text-sm text-emerald-700 font-medium" aria-live="polite">
              Account created successfully! Redirecting to login...
            </p>
            <p className="text-xs text-emerald-600 mt-1">
              Check your email to verify your account (if email confirmation is enabled).
            </p>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-12 text-base font-semibold" 
          disabled={loading || success || passwordsDontMatch}
        >
          {loading ? "Creating account..." : success ? "Account Created!" : "Create Account"}
        </Button>

        <div className="text-center text-sm text-gray-600 pt-2">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
