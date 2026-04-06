#!/bin/bash
# ============================================
# The Fontologist — One-Time Setup Script
# Run this ONCE on your Mac. Everything auto-deploys after.
# ============================================

set -e
echo "🔧 Setting up The Fontologist deployment pipeline..."

cd ~/Documents/equinox-suite-website

# 1. Pull latest code
echo "📥 Pulling latest code..."
git pull origin claude/build-fontsense-app-2RLjw

# 2. Install Wrangler (Cloudflare CLI)
echo "☁️ Installing Cloudflare Wrangler..."
npm install -g wrangler

# 3. Login to Cloudflare
echo "☁️ Login to Cloudflare (browser will open)..."
npx wrangler login

# 4. Create KV namespace for usage tracking
echo "📦 Creating KV namespace..."
KV_OUTPUT=$(npx wrangler kv namespace create USAGE --preview false 2>&1)
KV_ID=$(echo "$KV_OUTPUT" | grep -o 'id = "[^"]*"' | head -1 | cut -d'"' -f2)
echo "KV Namespace ID: $KV_ID"

# 5. Update wrangler.toml with actual KV ID
cd fontologist-worker
if [ -n "$KV_ID" ]; then
  sed -i '' "s/placeholder-replace-after-creating/$KV_ID/" wrangler.toml
  echo "✅ Updated wrangler.toml with KV ID"
fi

# 6. Install worker dependencies
npm install

# 7. Set the Anthropic API key as a secret
echo "🔑 Set your Anthropic API key..."
echo "Paste your sk-ant-... key when prompted:"
npx wrangler secret put ANTHROPIC_API_KEY

# 8. Deploy the worker
echo "🚀 Deploying Cloudflare Worker..."
npx wrangler deploy

echo ""
echo "============================================"
echo "✅ DONE! Your backend is live."
echo ""
echo "REMAINING MANUAL STEPS:"
echo "1. Go to dash.cloudflare.com → Pages → Create project"
echo "   → Connect to GitHub → select equinox-suite-website"
echo "   → Build command: (leave empty) → Deploy"
echo ""
echo "2. In Canva Developer Portal:"
echo "   cd ~/Documents/equinox-suite-website/fontologist"
echo "   npm run build"
echo "   Upload the bundle in Submission tab → Submit for review"
echo "============================================"
