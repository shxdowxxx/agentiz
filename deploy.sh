#!/bin/bash
# Agentiz deploy script
# Usage:
#   ./deploy.sh           — deploy to S3 (primary)
#   ./deploy.sh firebase  — deploy to Firebase (educationalisticz.web.app, GoGuardian bypass)

AWS=aws
BUCKET=agentiz
REGION=us-east-1

# Firebase deploy
if [ "$1" = "firebase" ]; then
  echo "Deploying to Firebase Hosting (educationalisticz.web.app) ..."
  firebase deploy --only hosting
  echo ""
  echo "Live at:"
  echo "  https://educationalisticz.web.app"
  echo "  https://educationalisticz.firebaseapp.com"
  exit 0
fi

echo "Deploying to s3://$BUCKET ..."

# HTML
$AWS s3 sync . s3://$BUCKET/ \
  --exclude "*" \
  --include "*.html" \
  --content-type "text/html; charset=utf-8" \
  --exclude ".git/*" --exclude "node_modules/*" --exclude ".wrangler/*"

# JavaScript
$AWS s3 sync . s3://$BUCKET/ \
  --exclude "*" \
  --include "*.js" \
  --content-type "application/javascript" \
  --exclude ".git/*" --exclude "node_modules/*" --exclude ".wrangler/*"

# CSS
$AWS s3 sync . s3://$BUCKET/ \
  --exclude "*" \
  --include "*.css" \
  --content-type "text/css" \
  --exclude ".git/*" --exclude "node_modules/*" --exclude ".wrangler/*"

# WASM
$AWS s3 sync . s3://$BUCKET/ \
  --exclude "*" \
  --include "*.wasm" \
  --content-type "application/wasm" \
  --exclude ".git/*" --exclude "node_modules/*" --exclude ".wrangler/*"

# JSON
$AWS s3 sync . s3://$BUCKET/ \
  --exclude "*" \
  --include "*.json" \
  --content-type "application/json" \
  --exclude ".git/*" --exclude "node_modules/*" --exclude ".wrangler/*"

# Plain text (humans.txt, robots.txt)
$AWS s3 sync . s3://$BUCKET/ \
  --exclude "*" \
  --include "*.txt" \
  --content-type "text/plain; charset=utf-8" \
  --exclude ".git/*" --exclude "node_modules/*" --exclude ".wrangler/*"

# XML (sitemap)
$AWS s3 sync . s3://$BUCKET/ \
  --exclude "*" \
  --include "*.xml" \
  --content-type "application/xml" \
  --exclude ".git/*" --exclude "node_modules/*" --exclude ".wrangler/*"

# .well-known directory (security.txt etc.) — must use cp, not sync, to preserve dot prefix
$AWS s3 cp .well-known/security.txt s3://$BUCKET/.well-known/security.txt \
  --content-type "text/plain; charset=utf-8"

echo ""
echo "Done! Live at:"
echo "  Landing  : https://$BUCKET.s3.$REGION.amazonaws.com/index.html"
echo "  App      : https://$BUCKET.s3.$REGION.amazonaws.com/app/index.html"
echo "  Sitemap  : https://$BUCKET.s3.$REGION.amazonaws.com/sitemap.xml"
echo "  Privacy  : https://$BUCKET.s3.$REGION.amazonaws.com/privacy.html"
