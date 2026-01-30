"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name?: string | null;
  avatarUrl?: string | null;
  size?: number;
  className?: string;
}

const colors = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-gray-200 text-gray-700",
  "bg-blue-100 text-blue-700",
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

export function UserAvatar({ name, avatarUrl, size = 40, className }: UserAvatarProps) {
  const initials = getInitials(name);
  const colorClass = colors[getColorIndex(name)];

  // If there's an avatar URL, show the image
  if (avatarUrl) {
    return (
      <div
        className={cn("rounded-full overflow-hidden flex-shrink-0", className)}
        style={{ width: size, height: size }}
        aria-label={name ? `Avatar for ${name}` : "User avatar"}
      >
        <Image
          src={avatarUrl}
          alt={name || "User avatar"}
          width={size}
          height={size}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Otherwise show initials
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold select-none flex-shrink-0",
        colorClass,
        className
      )}
      style={{ width: size, height: size }}
      aria-label={name ? `Avatar for ${name}` : "User avatar"}
    >
      <span style={{ fontSize: size * 0.4 }}>{initials}</span>
    </div>
  );
}

