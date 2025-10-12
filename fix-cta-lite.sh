#!/bin/sh
set -e

say(){ printf "\n%s\n" "$*"; }
info(){ printf "  • %s\n" "$*"; }
warn(){ printf "  ! %s\n" "$*"; }
die(){ printf "\n✖ %s\n" "$*"; exit 1; }

# Find project root (nearest package.json walking up)
find_root() {
  START="$PWD"
  while [ "$START" != "/" ]; do
    [ -f "$START/package.json" ] && { echo "$START"; return; }
    START=$(dirname "$START")
  done
  # fallback: shallow search
  for base in "$PWD" "$HOME/workspace" "$HOME/project" "$HOME"; do
    [ -d "$base" ] || continue
    hit=$(find "$base" -maxdepth 3 -type f -name package.json 2>/dev/null | head -n1)
    [ -n "$hit" ] && { dirname "$hit"; return; }
  done
  echo ""
}

ROOT=$(find_root)
[ -n "$ROOT" ] || die "Could not find a project with package.json. Run inside your project."
cd "$ROOT"
say "Project root: $ROOT"

# Detect UI base dir
if [ -d src ]; then UI_BASE="src"
elif [ -d app ]; then UI_BASE="app"
else
  UI_BASE="src"
  mkdir -p src
  warn "No src/ or app/ found — created src/."
fi
COMP_DIR="$UI_BASE/components"
mkdir -p "$COMP_DIR"
info "Using UI base: $UI_BASE"

# Ensure clsx
say "Ensuring clsx is installed"
if node -e 'try{p=require("./package.json");process.stdout.write((p.dependencies&&p.dependencies.clsx)?"yes":"no")}catch(e){process.stdout.write("no")}' | grep -q yes; then
  info "clsx already present"
else
  npm i -S clsx
fi

# Write ThemedTile.tsx (with ThemedCTA)
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

# Normalize imports (default -> named) using find + perl; no arrays/globstar
say "Normalizing imports referring to ThemedTile/ThemedCTA"
find "$UI_BASE" -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' \) -print0 2>/dev/null \
| while IFS= read -r -d '' f; do
    [ "$f" = "$TT" ] && continue
    perl -0777 -i -pe '
      s/import\s+ThemedCTA\s*,\s*\{([^}]*)\}\s*from\s*([\"\'][^\"\']*ThemedTile[\"\']);/import { ThemedCTA, \1 } from \2;/g;
      s/import\s+ThemedCTA\s+from\s*([\"\'][^\"\']*ThemedTile[\"\']);/import { ThemedCTA } from \1;/g;
      s/import\s+ThemedTile\s*,\s*\{([^}]*)\}\s*from\s*([\"\'][^\"\']*ThemedTile[\"\']);/import { ThemedTile, \1 } from \2;/g;
      s/import\s+ThemedTile\s+from\s*([\"\'][^\"\']*ThemedTile[\"\']);/import { ThemedTile } from \1;/g;
    ' "$f" 2>/dev/null || true
  done

# Barrel export
echo 'export * from "./ThemedTile";' > "$COMP_DIR/index.ts"

# tsconfig alias (@/* -> UI_BASE/*)
if [ -f tsconfig.json ]; then
  say "Ensuring tsconfig baseUrl + @/* -> $UI_BASE/*"
  node - <<NODE
const fs=require('fs'); const p='tsconfig.json';
let ts={}; try{ ts=JSON.parse(fs.readFileSync(p,'utf8')); }catch(e){}
ts.compilerOptions=ts.compilerOptions||{};
ts.compilerOptions.baseUrl=ts.compilerOptions.baseUrl||".";
ts.compilerOptions.paths=ts.compilerOptions.paths||{};
ts.compilerOptions.paths["@/*"]=[ "$UI_BASE/*" ];
fs.writeFileSync(p, JSON.stringify(ts,null,2));
console.log("  • tsconfig.json updated");
NODE
fi

# Vite: add vite-tsconfig-paths + quiet overlay (best-effort)
if ls vite.config.* >/dev/null 2>&1; then
  say "Vite detected — wiring vite-tsconfig-paths + HMR overlay false"
  npm i -D vite-tsconfig-paths || true
  for v in vite.config.ts vite.config.js; do
    [ -f "$v" ] || continue
    if ! grep -q 'vite-tsconfig-paths' "$v"; then
      # add import at top
      tmp="$v.tmp"; printf 'import tsconfigPaths from "vite-tsconfig-paths";\n' > "$tmp"; cat "$v" >> "$tmp"; mv "$tmp" "$v"
      # add plugin call if plugins array exists; otherwise inject minimal config
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

# Scan for earlier paste garbage
say "Scanning for stray paste garbage"
if grep -REn --color=never -e 'en}sName|</button>en|onClick}>:ring|:ring",er",' "$UI_BASE" >/dev/null 2>&1; then
  warn "Suspicious lines found (manual review suggested):"
  grep -REn --color=never -e 'en}sName|</button>en|onClick}>:ring|:ring",er",' "$UI_BASE" || true
else
  info "No obvious garbage found."
fi

# Type-check (best-effort)
if command -v npx >/dev/null 2>&1; then
  if npx --yes tsc --version >/dev/null 2>&1; then
    say "Type-check (no emit)"
    npx --yes tsc --noEmit || true
  else
    warn "TypeScript not detected; skipping tsc check."
  fi
fi

say "Done. Fire up your dev server: npm run dev"
