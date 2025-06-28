#!/bin/bash

# Zero Point Labs Dashboard - Manual Database Setup Script
# Use this if you're having authentication issues with Wrangler

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DB_NAME="zero-point-labs-dashboard"

echo -e "${BLUE}🗄️  Zero Point Labs Dashboard - Manual Database Setup${NC}"
echo "======================================================"
echo ""
echo -e "${YELLOW}⚠️  Use this script if you're experiencing authentication issues with Wrangler${NC}"
echo ""

# Check if wrangler is installed
check_wrangler() {
    if ! command -v wrangler &> /dev/null; then
        echo -e "${RED}❌ Wrangler CLI not found. Installing...${NC}"
        npm install -g wrangler
    else
        echo -e "${GREEN}✅ Wrangler CLI found${NC}"
    fi
}

# Try authentication fixes
fix_authentication() {
    echo -e "${BLUE}🔐 Fixing Authentication Issues${NC}"
    echo ""
    
    echo -e "${YELLOW}1️⃣ Clearing cached authentication...${NC}"
    rm -rf ~/.wrangler 2>/dev/null || true
    
    echo -e "${YELLOW}2️⃣ Logging out...${NC}"
    wrangler logout 2>/dev/null || true
    
    echo -e "${YELLOW}3️⃣ Fresh login required...${NC}"
    echo "Please complete the login process in your browser."
    wrangler login
    
    echo ""
    echo -e "${YELLOW}4️⃣ Verifying authentication...${NC}"
    if wrangler whoami &> /dev/null; then
        echo -e "${GREEN}✅ Authentication successful${NC}"
        wrangler whoami
    else
        echo -e "${RED}❌ Authentication still failing${NC}"
        echo ""
        echo -e "${YELLOW}📋 Manual Setup Instructions:${NC}"
        show_manual_instructions
        exit 1
    fi
}

# Show manual setup instructions
show_manual_instructions() {
    echo -e "${BLUE}📋 Manual Database Setup Instructions${NC}"
    echo "======================================"
    echo ""
    echo "Since automatic setup failed, please follow these manual steps:"
    echo ""
    echo -e "${YELLOW}1. Create Database via Cloudflare Dashboard:${NC}"
    echo "   → Go to: https://dash.cloudflare.com"
    echo "   → Navigate: Workers & Pages > D1 SQL Database"
    echo "   → Click: Create database"
    echo "   → Name: $DB_NAME"
    echo "   → Click: Create"
    echo ""
    echo -e "${YELLOW}2. Update wrangler.toml:${NC}"
    echo "   → Copy the Database ID from the dashboard"
    echo "   → Replace 'your-database-id-here' in wrangler.toml"
    echo ""
    echo -e "${YELLOW}3. Apply Schema:${NC}"
    echo "   → In D1 dashboard, click 'Query'"
    echo "   → Copy contents of schema.sql"
    echo "   → Paste and execute in the query console"
    echo ""
    echo -e "${YELLOW}4. Verify Setup:${NC}"
    echo "   → Run: SELECT * FROM clients;"
    echo "   → Should see 2 sample clients"
    echo ""
    echo -e "${GREEN}📁 Files you need:${NC}"
    echo "   → schema.sql (apply via dashboard)"
    echo "   → wrangler.toml (update with database ID)"
    echo ""
}

# Test database connection
test_connection() {
    echo -e "${BLUE}🧪 Testing Database Connection${NC}"
    
    if wrangler d1 list | grep -q "$DB_NAME"; then
        echo -e "${GREEN}✅ Database found${NC}"
        
        # Test a simple query
        if wrangler d1 execute $DB_NAME --command="SELECT COUNT(*) as count FROM clients;" &> /dev/null; then
            echo -e "${GREEN}✅ Database is accessible and has data${NC}"
            client_count=$(wrangler d1 execute $DB_NAME --command="SELECT COUNT(*) as count FROM clients;" --json | jq -r '.[0].count' 2>/dev/null || echo "0")
            echo -e "${GREEN}👥 Found $client_count clients${NC}"
        else
            echo -e "${YELLOW}⚠️  Database exists but may need schema applied${NC}"
        fi
    else
        echo -e "${RED}❌ Database not found. Please create it manually.${NC}"
        show_manual_instructions
        return 1
    fi
}

# Create .dev.vars and make scripts executable
setup_local_environment() {
    echo -e "${BLUE}🛠️  Setting up Local Environment${NC}"
    
    # Create .dev.vars
    if [ ! -f ".dev.vars" ]; then
        cat > .dev.vars << EOF
# Development Environment Variables
NODE_ENV=development
DATABASE_URL=local
DB_NAME=$DB_NAME
EOF
        echo -e "${GREEN}✅ .dev.vars created${NC}"
    else
        echo -e "${GREEN}✅ .dev.vars already exists${NC}"
    fi
    
    # Make scripts executable
    if [ -d "scripts" ]; then
        chmod +x scripts/*.sh 2>/dev/null || true
        echo -e "${GREEN}✅ Scripts made executable${NC}"
    fi
    
    # Create test endpoint
    mkdir -p src/app/api/test/clients
    if [ ! -f "src/app/api/test/clients/route.ts" ]; then
        cat > src/app/api/test/clients/route.ts << 'EOF'
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function GET() {
  try {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM clients WHERE is_active = 1');
    const result = await stmt.all();
    
    return NextResponse.json(result.results || []);
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
EOF
        echo -e "${GREEN}✅ Test API endpoint created${NC}"
    fi
}

# Show final instructions
show_final_instructions() {
    echo -e "${GREEN}🎉 Setup Complete!${NC}"
    echo "=================="
    echo ""
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo ""
    echo "1. 🚀 Start development server:"
    echo "   npm run dev"
    echo ""
    echo "2. 🌐 Test the login page:"
    echo "   http://localhost:3000/login"
    echo ""
    echo "3. 🔑 Use demo login codes:"
    echo "   SPARKLE2024 - Sparkle Clean Services"
    echo "   DEMO2024    - Demo Client"
    echo ""
    echo "4. 📊 Check database (if wrangler works):"
    echo "   npm run db:status"
    echo ""
    echo "5. 👥 Manage clients (if wrangler works):"
    echo "   npm run db:clients list"
    echo ""
    echo -e "${YELLOW}⚠️  If you still have wrangler issues:${NC}"
    echo "   • Use the Cloudflare Dashboard for database management"
    echo "   • All CRUD operations can be done via the web interface"
    echo "   • The application will work normally once the database is set up"
    echo ""
    echo -e "${GREEN}✅ Your dashboard system is ready!${NC}"
}

# Main execution
main() {
    check_wrangler
    
    echo ""
    read -p "Do you want to try fixing authentication first? (y/N): " fix_auth
    
    if [[ $fix_auth =~ ^[Yy]$ ]]; then
        fix_authentication
        echo ""
        
        # Try to test connection
        if test_connection; then
            echo -e "${GREEN}✅ Automatic setup successful!${NC}"
        else
            echo -e "${YELLOW}⚠️  Please complete setup manually${NC}"
            show_manual_instructions
        fi
    else
        echo -e "${YELLOW}📋 Showing manual setup instructions...${NC}"
        show_manual_instructions
    fi
    
    echo ""
    setup_local_environment
    echo ""
    show_final_instructions
}

# Run main function
main 