#!/usr/bin/env bash
# Deploy local changes to production (www.wedgewood.ca) via GitHub → Vercel.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

PRODUCTION_URL="https://www.wedgewood.ca"
REPO_URL="https://github.com/wedgewoodravine-hoa/WRHOA_Website"

red() { printf '\033[0;31m%s\033[0m\n' "$*"; }
green() { printf '\033[0;32m%s\033[0m\n' "$*"; }
bold() { printf '\033[1m%s\033[0m\n' "$*"; }

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  red "Error: not a git repository."
  exit 1
fi

branch="$(git branch --show-current)"
if [[ "$branch" != "main" ]]; then
  red "Error: deploy only from main (currently on '$branch')."
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  red "Error: no 'origin' remote configured."
  exit 1
fi

# Stage everything except ignored files (e.g. .env.local stays local).
git add -A
dirty="$(git status --porcelain)"

if [[ -n "$dirty" ]]; then
  bold "Changes to deploy:"
  git status --short
  echo

  # Auto message — no prompt. Optional override: bash deploy.sh "custom message"
  message="${1:-Deploy $(date '+%Y-%m-%d %H:%M')}"
  git commit -m "$message"
  green "Committed."
else
  bold "No new local changes to commit."
fi

# Catch build errors before pushing to production.
bold "Running production build…"
npm run build
green "Build succeeded."

bold "Pushing main → origin…"
git push origin main
green "Pushed to GitHub."

echo
green "Deploy started."
echo "Vercel will update production from $REPO_URL"
echo "Site: $PRODUCTION_URL"
echo "Preview usually appears within 1–2 minutes."
echo
echo "Watch the deploy: https://vercel.com/dashboard"
