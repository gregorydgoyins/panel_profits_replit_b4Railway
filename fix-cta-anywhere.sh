#!/usr/bin/env bash
set -euo pipefail

say() { printf "\n\033[1m%s\033[0m\n" "$*"; }
info(){ printf "  • %s\n" "$*"; }
warn(){ printf "\033[33m  ! %s\033[0m\n" "$*"; }
die(){ printf "\n\033[31m✖ %s\033[0m\n" "$*"; exit 1; }

# 0) Find project root (nearest package.json upward from CWD, or search common work dirs)
find_root() {
  local start="$PWD"
  while [ "$start" != "/" ]; do
    [ -f "$start/package.json" ] && { echo "$start"; return; }
    start="$(dirname "$start")"
  done
  # fallback: search typical workspace dir
  for base in "$PWD" "$HOME/workspace" "$HOME/project" "$HOME"; do
    [ -d "$base" ] || continue
    local hit
    hit="$(find "$base" -maxdepth 3 -type f -name package.json 2>/dev/null | head -n1 || true)"
    [ -n "$hit" ] && { dirname "$hit"; return; }
  done
  echo ""
}

ROOT="$(find_root)"
[ -n "$ROOT" ] || die "Could not find a project root with package.json. Run inside your project."
cd "$ROOT"
say "Project root: $ROOT"

# 1) Detect UI base dir (src/ preferred; else app/)
UI_BASE=""
if [ -d src ]; then UI_BASE="src"
elif [ -d app ]; then UI_BASE="app"
else
  # create src if neither exists
  UI_BASE="src"
  mkdir -p src
  warn "No src/ or app/ found — created src/."
fi
COMP_DIR="$UI_BASE/components"
mkdir -p "$COMP_DIR"
info "Using UI base: $UI_BASE"

# 2) Ensure clsx installed
say "Ensuring clsx is installed"
if ! node -e 'try{process.stdout.write((require("./package.json").dependencies||{}).clsx?"yes":"no")}catch{process.stdout.write("no")}' | grep -q yes; then
  npm i -S clsx
else
  info "clsx already present"
fi

# 3) Write ThemedTile.tsx (with ThemedCTA)
TT="$COMP_DIR/ThemedTile.tsx"
say "Writing $TT"
cat > "$TT" <<'TSX'
// ThemedTile + ThemedCTA
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

# 4) Normalize imports across project
say "Normalizing imports referring to ThemedTile/ThemedCTA"
shopt -s globstar nullglob
files=("$UI_BASE"/**/*.{ts,tsx,js,jsx})
for f in "${files[@]}"; do
  [[ "$f" == "$TT" ]] && continue
  perl -0777 -i -pe '
    s/import\s+ThemedCTA\s*,\s*\{([^}]*)\}\s*from\s*([\"\'][^\"\']*ThemedTile[\"\']);/import { ThemedCTA, \1 } from \2;/g;
    s/import\s+ThemedCTA\s+from\s*([\"\'][^\"\']*ThemedTile[\"\']);/import { ThemedCTA } from \1;/g;
    s/import\s+ThemedTile\s*,\s*\{([^}]*)\}\s*from\s*([\"\'][^\"\']*ThemedTile[\"\']);/import { ThemedTile, \1 } from \2;/g;
    s/import\s+ThemedTile\s+from\s*([\"\'][^\"\']*ThemedTile[\"\']);/import { ThemedTile } from \1;/g;
  ' "$f" 2>/dev/null || true
done

# 5) Barrel export
say "Adding barrel at $COMP_DIR/index.ts"
echo 'export * from "./ThemedTile";' > "$COMP_DIR/index.ts"

# 6) Set tsconfig alias (@/*) to point at UI base
if [ -f tsconfig.json ]; then
  say "Ensuring tsconfig baseUrl + @/* -> $UI_BASE/*"
  node - <<NODE
const fs = require('fs');
const path='tsconfig.json';
let ts={};
try{ ts = JSON.parse(fs.readFileSync(path,'utf8')); }catch{}
ts.compilerOptions = ts.compilerOptions || {};
ts.compilerOptions.baseUrl = ts.compilerOptions.baseUrl || ".";
ts.compilerOptions.paths = ts.compilerOptions.paths || {};
ts.compilerOptions.paths["@/*"] = [ "${UI_BASE}/*" ];
fs.writeFileSync(path, JSON.stringify(ts,null,2));
console.log("  • tsconfig.json updated");
NODE
fi

# 7) If Vite present, add vite-tsconfig-paths + soften overlay
if ls vite.config.* >/dev/null 2>&1; then
  say "Vite detected — wiring vite-tsconfig-paths + HMR overlay false"
  npm i -D vite-tsconfig-paths || true
  for v in vite.config.ts vite.config.js; do
    [ -f "$v" ] || continue
    if ! grep -q "vite-tsconfig-paths" "$v"; then
      awk 'NR==1{print "import tsconfigPaths from \"vite-tsconfig-paths\";"}1' "$v" > "$v.tmp" && mv "$v.tmp" "$v"
      if grep -q "plugins:" "$v"; then
        perl -0777 -i -pe 's/plugins:\s*\[([^\]]*)\]/plugins: [tsconfigPaths(), \1]/s' "$v" || true
      else
        perl -0777 -i -pe 's/export\s+default\s+defineConfig\(\{([\s\S]*?)\}\);/export default defineConfig({ plugins: [tsconfigPaths()], $1 });/s' "$v" || true
      fi
    fi
    if ! grep -q "hmr" "$v"; then
      perl -0777 -i -pe 's/export\s+default\s+defineConfig\(\{?/export default defineConfig({ server: { hmr: { overlay: false } },/s' "$v" || true
    fi
  done
fi

# 8) Quick scan for earlier paste garbage
say "Scanning for stray paste garbage"
if grep -REn --color=never -e 'en}sName|</button>en|onClick}>:ring|:ring",er",' "$UI_BASE" >/dev/null 2>&1; then
  warn "Suspicious lines found (manual review suggested):"
  grep -REn --color=never -e 'en}sName|</button>en|onClick}>:ring|:ring",er",' "$UI_BASE" || true
else
  info "No obvious garbage found."
fi

# 9) Type-check (best-effort)
if npx --yes tsc --version >/dev/null 2>&1; then
  say "Type-check (no emit)"
  npx --yes tsc --noEmit || true
else
  warn "TypeScript not detected; skipping tsc check."
fi

say "All set. Try your dev server (npm run dev). If any file still imports ThemedCTA wrong, share the path + import line."
