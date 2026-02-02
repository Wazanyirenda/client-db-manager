import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Create your account
        </h1>
        <p className="text-gray-600">
          Get started with Cliently and manage your clients effortlessly
        </p>
      </div>
      <SignupForm />
    </div>
  );
}



