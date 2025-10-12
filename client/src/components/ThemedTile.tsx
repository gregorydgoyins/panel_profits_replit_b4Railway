// Minimal tile: subtle rimlight on hover (Tailwind-only), NON-WHITE inside
import React from "react";
import { Link } from "wouter";
import clsx from "clsx";

type BaseProps = {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  to?: string;   // route to subpage (optional)
};

const OUTER_RIM = "#eeba30"; // gold
const INNER_BG  = "#ae0001"; // deep red (not white)

export function ThemedTile({ className, onClick, children, to }: BaseProps) {
  const box = (
    <div
      onClick={onClick}
      className={clsx(
        // subtle border + glow using Tailwind, no JS state
        "rounded-2xl p-4 cursor-pointer transition-shadow",
        "ring-2 ring-offset-2",
        // ring color via arbitrary value
        "ring-[var(--rim)] hover:ring-4",
        // soft outer glow on hover
        "hover:shadow-[0_0_10px_rgba(238,186,48,0.35)]",
        className
      )}
      style={{
        // provide CSS var for the ring color
        // (Tailwind uses it via ring-[var(--rim)] above)
        ["--rim" as any]: OUTER_RIM,
        background: INNER_BG,
        color: "white",
      }}
    >
      {children}
    </div>
  );

  return to ? <Link to={to} className="block rounded-2xl">{box}</Link> : box;
}

// tiny stub so any existing imports don't crash
export const ThemedCTA: React.FC = () => null;
