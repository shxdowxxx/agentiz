#!/bin/bash
# Agentiz S3 deploy script
# Usage: ./deploy.sh

AWS=~/.local/bin/aws
BUCKET=agentiz-organization
REGION=us-east-1

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

# JSON / text
$AWS s3 sync . s3://$BUCKET/ \
  --exclude "*" \
  --include "*.json" --include "*.txt" \
  --content-type "application/json" \
  --exclude ".git/*" --exclude "node_modules/*" --exclude ".wrangler/*"

echo ""
echo "Done! Live at:"
echo "  Landing : https://$BUCKET.s3.$REGION.amazonaws.com/index.html"
echo "  App     : https://$BUCKET.s3.$REGION.amazonaws.com/app/index.html"
