import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white px-8 py-10 shadow-lg">
        {children}
      </div>
    </div>
  );
}


