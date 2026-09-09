#!/usr/bin/env bash
#
# deploy.sh — push the RHS AI Solutions static site to GitHub Pages
#
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh
#
# Run this FROM your local machine (not a sandbox), inside:
#   /home/righthandservicesbyjp/rhs-ai-solutions-site/
#
# Prereqs:
#   - A fresh GitHub personal access token (repo scope), since the old one expired.
#     You'll be prompted for it as the "password" when git push asks for credentials.
#   - An empty public repo already created at:
#     https://github.com/righthandservices/righthandservices.github.io
#

set -euo pipefail

REPO_URL="git@github.com:Rhsjp1/Rhsjp1.github.io.git"
SITE_DIR="/home/righthandservicesbyjp/rhs-ai-solutions-site"

echo "== RHS AI Solutions — GitHub Pages deploy =="
echo

# --- 1. Sanity checks -------------------------------------------------------

if [ "$(pwd)" != "$SITE_DIR" ]; then
  echo "!! You're running this from $(pwd), not $SITE_DIR"
  echo "   cd into the site directory first, then re-run."
  exit 1
fi

if ! command -v git >/dev/null 2>&1; then
  echo "!! git is not installed or not on PATH."
  exit 1
fi

echo "-- Checking for expected files..."
MISSING=0

check_file() {
  if [ -f "$1" ]; then
    echo "   [ok] $1"
  else
    echo "   [MISSING] $1"
    MISSING=1
  fi
}

check_file "llms.txt"
check_file "index.html"

# Warn (don't hard-fail) on schema markup, since it could be inline in index.html
# or in a separate file depending on how the site was built.
if grep -rl "application/ld+json" . --include="*.html" >/dev/null 2>&1; then
  echo "   [ok] found application/ld+json schema markup referenced in HTML"
else
  echo "   [warn] no application/ld+json schema markup found in any .html file"
  echo "          (fine if it's injected another way — just double-check before pushing)"
fi

if [ "$MISSING" -eq 1 ]; then
  echo
  echo "!! One or more expected files are missing. Fix that before pushing, or"
  echo "   edit this script if the filenames/paths are different than assumed."
  exit 1
fi

echo
echo "-- Files look good. Proceeding."
echo

# --- 2. Git setup ------------------------------------------------------------

if [ -d ".git" ]; then
  echo "-- Existing git repo detected, reusing it."
else
  echo "-- Initializing new git repo."
  git init
fi

if git remote get-url origin >/dev/null 2>&1; then
  CURRENT_ORIGIN="$(git remote get-url origin)"
  if [ "$CURRENT_ORIGIN" != "$REPO_URL" ]; then
    echo "-- Updating existing 'origin' remote to $REPO_URL"
    git remote set-url origin "$REPO_URL"
  fi
else
  echo "-- Adding remote origin: $REPO_URL"
  git remote add origin "$REPO_URL"
fi

git branch -M main

# --- 3. Commit ---------------------------------------------------------------

git add .

if git diff --cached --quiet; then
  echo "-- Nothing new to commit (working tree already matches last commit)."
else
  git commit -m "Initial commit: RHS AI Solutions production site"
fi

# --- 4. Push -------------------------------------------------------------

echo
echo "-- Pushing to GitHub. When prompted for a password, paste your"
echo "   personal access token (not your GitHub account password)."
echo

git push -u origin main

echo
echo "== Done. =="
echo "Next: repo -> Settings -> Pages -> Source -> Deploy from a branch -> main / root"
echo "Site will go live at: https://Rhsjp1.github.io/"
