import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back
        </h1>
        <p className="text-gray-600">
          Sign in to your account to continue
        </p>
      </div>
      <LoginForm />
    </div>
  );
}


