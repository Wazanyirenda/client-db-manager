import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-0 h-full overflow-hidden">
      {/* Heading - pinned, never scrolls */}
      <div className="flex-shrink-0 space-y-1 pb-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Create your account
        </h1>
        <p className="text-sm text-gray-600">
          Get started with Cliently and manage your clients effortlessly
        </p>
      </div>
      {/* Form takes remaining height */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <SignupForm />
      </div>
    </div>
  );
}



