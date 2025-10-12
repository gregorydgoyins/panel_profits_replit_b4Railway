import React from "react";
import clsx from "clsx";

type BaseProps = {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

const OUTER_RIM = "#ffffff";
const INNER_BG = "#ffffff";

function rimHoverClass() {
  return "ring-2 ring-offset-2 hover:ring-4 transition-shadow";
}

export function ThemedTile({ className, onClick, children }: BaseProps) {
  return (
    <div
      onClick={onClick}
      className={clsx("rounded-2xl p-4 cursor-pointer", rimHoverClass(), className)}
      style={{
        boxShadow: `0 0 0 3px ${OUTER_RIM} inset, 0 6px 22px rgba(0,0,0,0.22)`,
        background: INNER_BG,
        color: "#111111",
      }}
    >
      {children}
    </div>
  );
}

type CTAProps = {
  as?: "button" | "a";
  href?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
};

export function ThemedCTA({ as = "button", href, onClick, children, className }: CTAProps) {
  const base = clsx(
    "rounded-xl px-4 py-2 font-semibold inline-flex items-center justify-center",
    "transition-transform active:scale-[0.98] focus:outline-none focus:ring",
    className
  );

  const style: React.CSSProperties = {
    background: OUTER_RIM,
    color: "#1a0d00",
    boxShadow: `0 0 0 2px ${OUTER_RIM} inset`,
  };

  if (as === "a") {
    return (
      <a href={href} className={base} style={style} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button className={base} style={style} onClick={onClick}>
      {children}
    </button>
  );
}
