import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f1014] text-zinc-100 flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#16171f] px-8 py-10 shadow-lg shadow-black/50">
        {children}
      </div>
    </div>
  );
}


