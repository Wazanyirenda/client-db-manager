import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold tracking-tight">
        Create your account
      </h1>
      <SignupForm />
    </div>
  );
}

