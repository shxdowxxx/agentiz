#!/bin/bash
# Agentiz deploy script
# Usage:
#   ./deploy.sh         — build + deploy everything to S3
#   ./deploy.sh nobuild — skip build, just sync

AWS=aws
BUCKET=agentiz
REGION=us-east-1
BUILD_DIR="agentiz-build"

set -e

if [ "$1" != "nobuild" ]; then
  echo "Building React app..."
  cd src-app && npm run build && cd ..
fi

echo "Deploying to s3://$BUCKET ..."

# App HTML — upload built index.html as key "agentiz" (no extension, clean URL)
$AWS s3 cp $BUILD_DIR/index.html s3://$BUCKET/agentiz \
  --content-type "text/html; charset=utf-8" \
  --cache-control "no-cache"

# Built assets (JS, CSS — long-term cacheable via hashed names)
$AWS s3 sync $BUILD_DIR/assets/ s3://$BUCKET/assets/ \
  --cache-control "public, max-age=31536000, immutable"

# Landing page
$AWS s3 cp index.html s3://$BUCKET/index.html \
  --content-type "text/html; charset=utf-8" \
  --cache-control "no-cache"

# Proxy engine files
$AWS s3 sync engine/ s3://$BUCKET/engine/ --content-type "application/javascript"
# Transport — bare-mux + bare-as-module3 (.mjs needs javascript MIME too)
$AWS s3 sync transport/ s3://$BUCKET/transport/ \
  --content-type "application/javascript" \
  --cache-control "public, max-age=3600" \
  --exclude "*.mjs"
$AWS s3 sync transport/ s3://$BUCKET/transport/ \
  --content-type "application/javascript" \
  --cache-control "public, max-age=3600" \
  --exclude "*" --include "*.mjs"
# Relay — epoxy transport (.mjs needs javascript MIME too)
$AWS s3 sync relay/ s3://$BUCKET/relay/ \
  --content-type "application/javascript" \
  --cache-control "public, max-age=3600" \
  --exclude "*.mjs"
$AWS s3 sync relay/ s3://$BUCKET/relay/ \
  --content-type "application/javascript" \
  --cache-control "public, max-age=3600" \
  --exclude "*" --include "*.mjs"
$AWS s3 sync netfetch/ s3://$BUCKET/netfetch/ --content-type "application/javascript"

# Service workers (no-cache required)
for f in sw.js sw-net.js transport-worker.js net-bundle.js net-sync.js relay.js; do
  [ -f "$f" ] && $AWS s3 cp $f s3://$BUCKET/$f \
    --content-type "application/javascript" \
    --cache-control "no-cache"
done

# WASM files
$AWS s3 sync . s3://$BUCKET/ \
  --exclude "*" --include "*.wasm" \
  --content-type "application/wasm" \
  --exclude ".git/*" --exclude "node_modules/*" --exclude "src-app/*" --exclude "$BUILD_DIR/*"

# Static files
$AWS s3 cp privacy.html s3://$BUCKET/privacy.html --content-type "text/html; charset=utf-8"
$AWS s3 cp manifest.json s3://$BUCKET/manifest.json --content-type "application/json"
$AWS s3 cp sitemap.xml s3://$BUCKET/sitemap.xml --content-type "application/xml"
$AWS s3 cp robots.txt s3://$BUCKET/robots.txt --content-type "text/plain; charset=utf-8"
$AWS s3 cp humans.txt s3://$BUCKET/humans.txt --content-type "text/plain; charset=utf-8"
$AWS s3 cp .well-known/security.txt s3://$BUCKET/.well-known/security.txt \
  --content-type "text/plain; charset=utf-8"

echo ""
echo "✓ Deployed to s3://$BUCKET"
echo ""
echo "  Landing  → https://$BUCKET.s3.$REGION.amazonaws.com/index.html"
echo "  App      → https://$BUCKET.s3.$REGION.amazonaws.com/agentiz"
echo "  Privacy  → https://$BUCKET.s3.$REGION.amazonaws.com/privacy.html"
echo "  Sitemap  → https://$BUCKET.s3.$REGION.amazonaws.com/sitemap.xml"
