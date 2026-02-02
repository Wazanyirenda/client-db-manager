"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
  showLogo?: boolean;
}

export function Loading({ 
  size = "md", 
  text = "Loading...", 
  fullScreen = false,
  showLogo = true 
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const logoSizes = {
    sm: 32,
    md: 48,
    lg: 64,
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        fullScreen && "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50"
      )}
    >
      <div className="relative">
        {/* Logo with pulse animation */}
        {showLogo && (
          <div className="animate-pulse-slow">
            <Image
              src="/cliently-logo.png"
              alt="Cliently"
              width={logoSizes[size]}
              height={logoSizes[size]}
              className="rounded-xl"
            />
          </div>
        )}
        
        {/* Spinning ring around logo */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 border-r-blue-600/30 animate-spin",
            sizeClasses[size],
            showLogo && "-inset-2"
          )}
          style={{ animationDuration: "1s" }}
        />
      </div>

      {/* Loading text with dots animation */}
      {text && (
        <div className={cn("text-gray-600 font-medium flex items-center gap-1", textSizes[size])}>
          <span>{text}</span>
          <span className="flex gap-0.5">
            <span className="animate-bounce-dot" style={{ animationDelay: "0ms" }}>.</span>
            <span className="animate-bounce-dot" style={{ animationDelay: "150ms" }}>.</span>
            <span className="animate-bounce-dot" style={{ animationDelay: "300ms" }}>.</span>
          </span>
        </div>
      )}
    </div>
  );
}

// Skeleton loader for content
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded-lg",
        className
      )}
    />
  );
}

// Card skeleton for loading states
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

// Table skeleton for loading states
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      {/* Rows */}
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4 flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

