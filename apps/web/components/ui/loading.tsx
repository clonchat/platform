"use client";

import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "pulse" | "skeleton";
  text?: string;
  className?: string;
}

export function Loading({
  size = "md",
  variant = "spinner",
  text,
  className,
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  if (variant === "spinner") {
    return (
      <div className={cn("flex flex-col items-center space-y-3", className)}>
        <div className={cn("relative", sizeClasses[size])}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-full animate-spin">
            <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
              <div className="w-1/3 h-1/3 bg-[#2563eb] rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        {text && (
          <p className={cn("text-gray-600 font-medium", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex flex-col items-center space-y-3", className)}>
        <div className="flex space-x-1">
          <div
            className={cn(
              "bg-[#2563eb] rounded-full animate-bounce",
              size === "sm" ? "w-1 h-1" : size === "md" ? "w-2 h-2" : "w-3 h-3"
            )}
          ></div>
          <div
            className={cn(
              "bg-[#2563eb] rounded-full animate-bounce",
              size === "sm" ? "w-1 h-1" : size === "md" ? "w-2 h-2" : "w-3 h-3"
            )}
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className={cn(
              "bg-[#2563eb] rounded-full animate-bounce",
              size === "sm" ? "w-1 h-1" : size === "md" ? "w-2 h-2" : "w-3 h-3"
            )}
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
        {text && (
          <p className={cn("text-gray-600 font-medium", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex flex-col items-center space-y-3", className)}>
        <div
          className={cn(
            "bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-full animate-pulse",
            sizeClasses[size]
          )}
        ></div>
        {text && (
          <p className={cn("text-gray-600 font-medium", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === "skeleton") {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        {text && (
          <p className={cn("text-gray-600 font-medium", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return null;
}

// Full screen loading component
export function FullScreenLoading({
  title = "Cargando Clonchat",
  subtitle = "Preparando tu experiencia...",
  className,
}: {
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100",
        className
      )}
    >
      <div className="text-center space-y-6">
        {/* Animated Logo */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-pulse">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full animate-bounce">
            <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-full animate-pulse"></div>
        </div>

        {/* Loading Dots */}
        <Loading variant="dots" size="sm" />
      </div>
    </div>
  );
}
