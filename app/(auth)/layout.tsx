import type { ReactNode } from "react";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <Image
              src="/cliently-logo.png"
              alt="Cliently"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-2xl font-bold text-gray-900">Cliently</span>
          </div>
          {children}
        </div>
      </div>

      {/* Right Side - Stock Image with overlay */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden">
        {/* Unsplash stock image - Team collaboration */}
        <Image
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&fit=crop"
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
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Pipeline Management</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Smart Notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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
