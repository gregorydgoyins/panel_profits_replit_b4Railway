#!/usr/bin/env bash
set -euo pipefail

say() { printf "\n\033[1m%s\033[0m\n" "$*"; }
info() { printf "  • %s\n" "$*"; }
warn() { printf "\033[33m  ! %s\033[0m\n" "$*"; }
die() { printf "\n\033[31m✖ %s\033[0m\n" "$*" ; exit 1; }

[ -f package.json ] || die "Run this from your project root (package.json not found)."
[ -d src ] || die "src/ directory not found."

say "1) Ensuring clsx is installed"
if ! node -e 'try{console.log(require("./package.json").dependencies?.clsx?"yes":"no")}catch{console.log("no")}' | grep -q yes; then
  npm i -S clsx || die "Failed to install clsx"
else
  info "clsx already present"
fi

say "2) Writing src/components/ThemedTile.tsx (Tile + CTA export)"
mkdir -p src/components
cat > src/components/ThemedTile.tsx <<'TSX'
// src/components/ThemedTile.tsx
import React from "react";
import clsx from "clsx";

type BaseProps = {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

const OUTER_RIM = "#d3a625"; // rim
const INNER_BG = "#AE0001";  // inside

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
        color: "white",
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
TSX

say "3) Normalizing imports (default -> named) for ThemedTile/ThemedCTA"
shopt -s globstar nullglob
files=(src/**/*.{ts,tsx,js,jsx})
for f in "${files[@]}"; do
  [[ "$f" == "src/components/ThemedTile.tsx" ]] && continue
  perl -0777 -i -pe '
    s/import\s+ThemedCTA\s*,\s*\{([^}]*)\}\s*from\s*([\"\'][^\"\']*ThemedTile[\"\']);/import { ThemedCTA, \1 } from \2;/g;
    s/import\s+ThemedCTA\s+from\s*([\"\'][^\"\']*ThemedTile[\"\']);/import { ThemedCTA } from \1;/g;
    s/import\s+ThemedTile\s*,\s*\{([^}]*)\}\s*from\s*([\"\'][^\"\']*ThemedTile[\"\']);/import { ThemedTile, \1 } from \2;/g;
    s/import\s+ThemedTile\s+from\s*([\"\'][^\"\']*ThemedTile[\"\']);/import { ThemedTile } from \1;/g;
  ' "$f" 2>/dev/null || true
done

say "4) Barrel export (optional)"
cat > src/components/index.ts <<'TS'
export * from "./ThemedTile";
TS

say "5) Ensure tsconfig paths for '@/...'"
node - <<'NODE'
const fs = require('fs');
const path = 'tsconfig.json';
let ts = {};
try { ts = JSON.parse(fs.readFileSync(path,'utf8')); } catch {}
ts.compilerOptions = ts.compilerOptions || {};
ts.compilerOptions.baseUrl = ts.compilerOptions.baseUrl || ".";
ts.compilerOptions.paths = ts.compilerOptions.paths || {};
ts.compilerOptions.paths["@/*"] = ts.compilerOptions.paths["@/*"] || ["src/*"];
fs.writeFileSync(path, JSON.stringify(ts, null, 2));
console.log("  • tsconfig.json updated");
NODE

if ls vite.config.* >/dev/null 2>&1; then
  say "6) Add vite-tsconfig-paths (if not present) and enable it"
  npm i -D vite-tsconfig-paths || true
  for v in vite.config.ts vite.config.js; do
    [ -f "$v" ] || continue
    if ! grep -q "vite-tsconfig-paths" "$v"; then
      awk '
        NR==1{print "import tsconfigPaths from \"vite-tsconfig-paths\";"}1
      ' "$v" > "$v.tmp" && mv "$v.tmp" "$v"
      # insert plugin call if plugins array exists
      if grep -q "plugins:" "$v"; then
        perl -0777 -i -pe 's/plugins:\s*\[([^\]]*)\]/plugins: [tsconfigPaths(), \1]/s' "$v" || true
      else
        perl -0777 -i -pe 's/export\s+default\s+defineConfig\(\{([\s\S]*?)\}\);/export default defineConfig({ plugins: [tsconfigPaths()], $1 });/s' "$v" || true
      fi
    fi
    # (Optional) quiet overlay while iterating
    if ! grep -q "hmr" "$v"; then
      perl -0777 -i -pe 's/export\s+default\s+defineConfig\(\{?/export default defineConfig({ server: { hmr: { overlay: false } },/s' "$v" || true
    fi
  done
fi

say "7) Scan for stray paste garbage"
garb='en}sName|</button>en|onClick}>:ring|:ring\",er\",'
if grep -REn --color=never -e "$garb" src >/dev/null 2>&1; then
  warn "Suspicious lines found—review below:"
  grep -REn --color=never -e "$garb" src || true
else
  info "No obvious garbage found."
fi

say "8) Type-check (no-emit)"
if npx --yes tsc --version >/dev/null 2>&1; then
  npx --yes tsc --noEmit || true
else
  warn "TypeScript not detected; skipping tsc check."
fi

say "Done. Try: npm run dev"
