"use client";

import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name?: string | null;
  size?: number;
}

const colors = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
  "bg-slate-100 text-slate-700",
];

function getInitials(name?: string | null) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const initials = parts.map((part) => part[0]?.toUpperCase()).join("");
  return initials || "U";
}

function getColorIndex(name?: string | null) {
  if (!name) return 0;
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % colors.length;
}

export function UserAvatar({ name, size = 40 }: UserAvatarProps) {
  const initials = getInitials(name);
  const colorClass = colors[getColorIndex(name)];

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold select-none",
        colorClass
      )}
      style={{ width: size, height: size }}
      aria-label={name ? `Avatar for ${name}` : "User avatar"}
    >
      <span style={{ fontSize: size * 0.4 }}>{initials}</span>
    </div>
  );
}

