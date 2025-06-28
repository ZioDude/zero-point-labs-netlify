#!/bin/bash

echo "🚀 Deploying Zero Point Labs Dashboard with D1 Database Binding"
echo "=============================================================="

# Build the project
echo "📦 Building the project..."
npm run build:cf

# Deploy with bindings
echo "🌐 Deploying to Cloudflare Pages with database binding..."
wrangler pages deploy .vercel/output/static \
  --project-name zero-point-labs-dashboard \
  --d1 DB=3ce53a6b-3fbd-4c2b-86a8-ff1ecf8e2237

echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. The database binding should now be active"
echo "2. You may need to initialize the remote database with schema and data"
echo "3. Visit your site to test the login functionality"
