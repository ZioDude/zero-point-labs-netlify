#!/bin/bash

# Add D1 database binding to Cloudflare Pages project
echo "🔗 Adding D1 database binding to Cloudflare Pages project..."

# Add the database binding
wrangler pages project add-binding zero-point-labs-dashboard \
  --d1=DB=3ce53a6b-3fbd-4c2b-86a8-ff1ecf8e2237

echo "✅ Database binding added successfully!"
echo ""
echo "📝 Note: The binding will be available on the next deployment."
echo "   You may need to redeploy your project for the changes to take effect."
