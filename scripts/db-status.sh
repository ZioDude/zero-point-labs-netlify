#!/bin/bash

# Database Status Check Script
# Run with: chmod +x scripts/db-status.sh && ./scripts/db-status.sh

echo "🗄️  Zero Point Labs Dashboard - Database Status Check"
echo "=================================================="

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Please install it first:"
    echo "   npm install -g wrangler"
    exit 1
fi

# Database name
DB_NAME="zero-point-labs-dashboard"

echo "📋 Database: $DB_NAME"
echo ""

# Check if database exists
echo "🔍 Checking database existence..."
if wrangler d1 list | grep -q "$DB_NAME"; then
    echo "✅ Database found"
else
    echo "❌ Database not found"
    echo "   Run: wrangler d1 create $DB_NAME"
    exit 1
fi

echo ""
echo "📊 Database Statistics:"
echo "----------------------"

# Count clients
CLIENT_COUNT=$(wrangler d1 execute $DB_NAME --command="SELECT COUNT(*) as count FROM clients WHERE is_active = 1;" --json | grep -o '"count":[0-9]*' | cut -d':' -f2)
echo "👥 Active Clients: $CLIENT_COUNT"

# Count sessions
SESSION_COUNT=$(wrangler d1 execute $DB_NAME --command="SELECT COUNT(*) as count FROM client_sessions;" --json | grep -o '"count":[0-9]*' | cut -d':' -f2)
echo "🔐 Active Sessions: $SESSION_COUNT"

# Count form submissions
SUBMISSION_COUNT=$(wrangler d1 execute $DB_NAME --command="SELECT COUNT(*) as count FROM form_submissions;" --json | grep -o '"count":[0-9]*' | cut -d':' -f2)
echo "📝 Total Form Submissions: $SUBMISSION_COUNT"

# Count analytics records
ANALYTICS_COUNT=$(wrangler d1 execute $DB_NAME --command="SELECT COUNT(*) as count FROM analytics_data;" --json | grep -o '"count":[0-9]*' | cut -d':' -f2)
echo "📈 Analytics Records: $ANALYTICS_COUNT"

echo ""
echo "🏷️  Sample Client Codes:"
echo "------------------------"
wrangler d1 execute $DB_NAME --command="SELECT name, client_code, website_url FROM clients WHERE is_active = 1 LIMIT 5;" --json | grep -o '"name":"[^"]*\|"client_code":"[^"]*\|"website_url":"[^"]*' | sed 's/"name":"/* /; s/"client_code":"/ (/; s/"website_url":"/: /'

echo ""
echo "📅 Recent Activity:"
echo "------------------"
wrangler d1 execute $DB_NAME --command="SELECT date, visitors_count, page_views_count, submissions_count FROM analytics_data ORDER BY date DESC LIMIT 3;" --json

echo ""
echo "✅ Database status check completed!"
echo ""
echo "💡 Useful commands:"
echo "   - View all clients: wrangler d1 execute $DB_NAME --command=\"SELECT * FROM clients;\""
echo "   - View recent submissions: wrangler d1 execute $DB_NAME --command=\"SELECT * FROM form_submissions ORDER BY created_at DESC LIMIT 5;\""
echo "   - Backup database: wrangler d1 export $DB_NAME --output=backup-\$(date +%Y%m%d).sql" 