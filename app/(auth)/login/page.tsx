import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold tracking-tight">
        Sign in to your workspace
      </h1>
      <LoginForm />
    </div>
  );
}


