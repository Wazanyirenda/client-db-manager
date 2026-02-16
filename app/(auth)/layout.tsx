import type { ReactNode } from "react";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 bg-white flex overflow-hidden">
      {/* Left Side - Form: logo fixed, only form content scrolls */}
      <div className="flex-1 flex flex-col min-h-0 px-5 py-4 lg:px-12 lg:py-8">
        {/* Logo - fixed at top, no scroll */}
        <div className="flex-shrink-0 flex justify-center mb-4 lg:mb-6">
          <div className="w-full max-w-md flex items-center gap-3">
            <Image
              src="/cliently-logo.png"
              alt="Cliently"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="text-xl font-bold text-gray-900">Cliently</span>
          </div>
        </div>
        {/* Form content - each page controls its own scroll */}
        <div className="flex-1 min-h-0 flex justify-center overflow-hidden">
          <div className="w-full max-w-md flex flex-col min-h-0">
            {children}
          </div>
        </div>
      </div>

      {/* Right Side - Stock Image with overlay (fixed, no scroll) */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden">
        <Image
          src="/sign-up.jpeg"
          alt="Team collaborating in modern workspace"
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />

        {/* Dark gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

        {/* Bottom content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/cliently-logo.png"
                alt="Cliently"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="text-xl font-bold">Cliently</span>
            </div>
            <h2 className="text-3xl font-bold leading-tight mb-3">
              Manage your clients with ease
            </h2>
            <p className="text-white/80 text-base leading-relaxed mb-6">
              The simple CRM for your business. Track leads, manage relationships, and grow your client base.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Pipeline Management</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Smart Notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Invoice Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
