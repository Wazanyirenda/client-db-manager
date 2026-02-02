import type { ReactNode } from "react";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white px-8 py-10 shadow-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Image
            src="/cliently-logo.png"
            alt="Cliently"
            width={48}
            height={48}
            className="rounded-xl"
          />
          <span className="text-2xl font-bold text-blue-600">Cliently</span>
        </div>
        {children}
      </div>
    </div>
  );
}


