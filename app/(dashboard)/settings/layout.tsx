"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { User, Shield, Sliders, Database, ArrowLeft, Gear, CaretRight, ClockCounterClockwise } from "@phosphor-icons/react";

const navItems = [
  { href: "/settings/profile", label: "Profile", icon: User, description: "Personal information" },
  { href: "/settings/security", label: "Security", icon: Shield, description: "Password & authentication" },
  { href: "/settings/preferences", label: "Preferences", icon: Sliders, description: "App customization" },
  { href: "/settings/data", label: "Data", icon: Database, description: "Export & backup" },
  { href: "/settings/activity", label: "Activity", icon: ClockCounterClockwise, description: "View activity log" },
];

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button onClick={() => router.push('/dashboard')} className="hover:text-gray-700 flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" weight="bold" />
          Dashboard
        </button>
        <CaretRight className="h-4 w-4" weight="bold" />
        <span className="text-gray-900 font-medium">Settings</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Gear className="h-5 w-5 text-blue-600" weight="fill" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-1">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                    active
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent"
                  )}
                >
                  <Icon className={cn("h-5 w-5", active ? "text-blue-600" : "text-gray-400")} weight={active ? "fill" : "regular"} />
                  <div>
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className={cn("text-xs", active ? "text-blue-600" : "text-gray-400")}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          {children}
        </main>
      </div>
    </div>
  );
}
