"use client";

import React, { useCallback } from "react";
import { cinematicAudio } from "@/lib/cinematic-audio";

export interface SpinningBorderCtaProps {
  onClick?: () => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  children: React.ReactNode;
  theme?: "teal" | "amber" | "white";
  type?: "button" | "submit" | "reset";
  size?: "sm" | "md" | "lg";
}

const THEME_BEAMS = {
  teal: "bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_70%,#4ed4b7_100%)]",
  amber: "bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_70%,#e8c76d_100%)]",
  white: "bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_70%,#ffffff_100%)]",
};

const THEME_HOVER_SHADOW = {
  teal: "hover:shadow-[0_0_28px_rgba(78,212,183,0.25)]",
  amber: "hover:shadow-[0_0_28px_rgba(232,199,109,0.25)]",
  white: "hover:shadow-[0_0_25px_rgba(255,255,255,0.15)]",
};

export function SpinningBorderCta({
  onClick,
  disabled = false,
  id,
  className = "",
  children,
  theme = "teal",
  type = "button",
  size = "md",
}: SpinningBorderCtaProps) {
  const handleClick = useCallback(() => {
    if (disabled) return;
    cinematicAudio.playCue("action");
    onClick?.();
  }, [disabled, onClick]);

  const sizeClasses = {
    sm: "py-2 px-4 text-xs",
    md: "py-2.5 px-6 text-xs",
    lg: "py-3.5 px-8 text-sm",
  }[size];

  return (
    <button
      id={id}
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full p-[1px] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0.5 ${
        THEME_HOVER_SHADOW[theme]
      } ${disabled ? "opacity-35 cursor-not-allowed pointer-events-none" : "cursor-pointer"} ${className}`}
    >
      {/* 360-degree Spinning Conic Gradient Beam */}
      <span
        className={`absolute inset-[-150%] animate-[spin_3s_linear_infinite] ${THEME_BEAMS[theme]} opacity-0 transition-opacity duration-300 group-hover:opacity-100 will-change-transform pointer-events-none`}
      />

      {/* Static Subdued Border Base */}
      <span className="absolute inset-0 rounded-full bg-zinc-800/80 transition-opacity duration-300 group-hover:opacity-20 pointer-events-none" />

      {/* Tactile Surface Layer */}
      <span
        className={`relative z-10 flex w-full h-full items-center justify-center gap-2 rounded-full font-mono uppercase tracking-wider font-semibold text-zinc-300 transition-colors duration-300 group-hover:text-white bg-gradient-to-b from-[#141822] to-[#0a0d14] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] ${sizeClasses}`}
      >
        {children}
      </span>
    </button>
  );
}
