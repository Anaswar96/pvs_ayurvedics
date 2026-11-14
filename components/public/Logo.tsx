import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
  width?: number;
  height?: number;
  showText?: boolean;
}

export default function Logo({
  variant = "dark",
  className = "",
  width,
  height = 54,
}: LogoProps) {
  const logoSrc = variant === "light" ? "/images/logo-white.png" : "/images/logo.png";
  // Actual logo aspect ratio is ~1.1514 (943 / 819)
  const renderedWidth = width ?? Math.round(height * 1.1514);

  return (
    <Link
      href="/"
      className={`inline-flex items-center group transition-transform duration-200 hover:scale-[1.03] ${className}`}
      aria-label="PVS Ayurvedics Home"
    >
      <div
        className="relative flex-shrink-0"
        style={{ width: `${renderedWidth}px`, height: `${height}px` }}
      >
        <Image
          src={logoSrc}
          alt="PVS Ayurvedics"
          fill
          priority
          sizes="120px"
          className="object-contain"
        />
      </div>
    </Link>
  );
}
