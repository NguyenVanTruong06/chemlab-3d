#!/usr/bin/env bash
set -euo pipefail

npm run build

DEPLOY_DIR="/tmp/chemlab_gh_pages_deploy"
rm -rf "$DEPLOY_DIR"
cp -r dist "$DEPLOY_DIR"
touch "$DEPLOY_DIR/.nojekyll"

git -C "$DEPLOY_DIR" init -b gh-pages
git -C "$DEPLOY_DIR" add -A
git -C "$DEPLOY_DIR" commit -m "deploy: ChemLab 3D static build ($(date -u +%Y-%m-%dT%H:%M:%SZ))"

REMOTE_URL=$(git remote get-url origin)
ANTIGRAVITY_APP_DATA_DIR="${ANTIGRAVITY_APP_DATA_DIR:-/tmp/agy_app_data}" \
  git -C "$DEPLOY_DIR" push -f "$REMOTE_URL" gh-pages

rm -rf "$DEPLOY_DIR"
echo "Deployed to https://nguyenvantruong06.github.io/chemlab-3d/"
