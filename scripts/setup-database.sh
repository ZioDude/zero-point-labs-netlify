#!/bin/bash

# Zero Point Labs Dashboard - Complete Database Setup Script
# This script will set up your entire database system

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DB_NAME="zero-point-labs-dashboard"
PROJECT_NAME="zero-point-labs-dashboard"

echo -e "${BLUE}🗄️  Zero Point Labs Dashboard - Database Setup${NC}"
echo "=================================================="
echo ""

# Check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js not found. Please install Node.js 16+ from https://nodejs.org${NC}"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm not found. Please install npm${NC}"
        exit 1
    fi
    
    # Check if wrangler is installed
    if ! command -v wrangler &> /dev/null; then
        echo -e "${YELLOW}⚠️  Wrangler CLI not found. Installing...${NC}"
        npm install -g wrangler
    fi
    
    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
    echo ""
}

# Authenticate with Cloudflare
authenticate_cloudflare() {
    echo -e "${BLUE}🔐 Cloudflare Authentication${NC}"
    
    # Check if already authenticated
    if wrangler whoami &> /dev/null; then
        echo -e "${GREEN}✅ Already authenticated with Cloudflare${NC}"
        wrangler whoami
    else
        echo -e "${YELLOW}🔑 Please authenticate with Cloudflare...${NC}"
        wrangler login
        
        if wrangler whoami &> /dev/null; then
            echo -e "${GREEN}✅ Successfully authenticated${NC}"
        else
            echo -e "${RED}❌ Authentication failed${NC}"
            exit 1
        fi
    fi
    echo ""
}

# Create database
create_database() {
    echo -e "${BLUE}🗄️  Creating D1 Database${NC}"
    
    # Check if database already exists
    if wrangler d1 list | grep -q "$DB_NAME"; then
        echo -e "${YELLOW}⚠️  Database '$DB_NAME' already exists${NC}"
        read -p "Do you want to use the existing database? (y/N): " use_existing
        
        if [[ $use_existing =~ ^[Yy]$ ]]; then
            echo -e "${GREEN}✅ Using existing database${NC}"
        else
            echo -e "${RED}❌ Setup cancelled. Please delete the existing database or use a different name.${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}📝 Creating new database...${NC}"
        wrangler d1 create $DB_NAME
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Database created successfully${NC}"
            echo -e "${YELLOW}⚠️  IMPORTANT: Copy the database_id from above and update your wrangler.toml file${NC}"
            echo ""
            read -p "Press Enter after updating wrangler.toml with the database_id..."
        else
            echo -e "${RED}❌ Failed to create database${NC}"
            exit 1
        fi
    fi
    echo ""
}

# Apply schema
apply_schema() {
    echo -e "${BLUE}📊 Applying Database Schema${NC}"
    
    if [ ! -f "schema.sql" ]; then
        echo -e "${RED}❌ schema.sql not found. Please ensure you're in the project root directory.${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}📝 Applying schema to database...${NC}"
    wrangler d1 execute $DB_NAME --file=./schema.sql
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Schema applied successfully${NC}"
    else
        echo -e "${RED}❌ Failed to apply schema${NC}"
        exit 1
    fi
    echo ""
}

# Verify setup
verify_setup() {
    echo -e "${BLUE}🔍 Verifying Database Setup${NC}"
    
    # Check tables exist
    echo -e "${YELLOW}📋 Checking tables...${NC}"
    table_count=$(wrangler d1 execute $DB_NAME --command="SELECT COUNT(*) as count FROM sqlite_master WHERE type='table';" --json | jq -r '.[0].count')
    
    if [ "$table_count" -ge 5 ]; then
        echo -e "${GREEN}✅ Tables created successfully ($table_count tables)${NC}"
    else
        echo -e "${RED}❌ Expected at least 5 tables, found $table_count${NC}"
        exit 1
    fi
    
    # Check sample data
    echo -e "${YELLOW}👥 Checking sample clients...${NC}"
    client_count=$(wrangler d1 execute $DB_NAME --command="SELECT COUNT(*) as count FROM clients;" --json | jq -r '.[0].count')
    
    if [ "$client_count" -ge 2 ]; then
        echo -e "${GREEN}✅ Sample clients created successfully ($client_count clients)${NC}"
        wrangler d1 execute $DB_NAME --command="SELECT client_code, name FROM clients;" --json | jq -r '.[] | "  🔑 \(.client_code) - \(.name)"'
    else
        echo -e "${YELLOW}⚠️  No sample clients found, but that's okay${NC}"
    fi
    echo ""
}

# Set up development environment
setup_dev_environment() {
    echo -e "${BLUE}🛠️  Setting up Development Environment${NC}"
    
    # Create .dev.vars if it doesn't exist
    if [ ! -f ".dev.vars" ]; then
        echo -e "${YELLOW}📝 Creating .dev.vars file...${NC}"
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
        echo -e "${YELLOW}🔧 Making scripts executable...${NC}"
        chmod +x scripts/*.sh
        echo -e "${GREEN}✅ Scripts are now executable${NC}"
    fi
    echo ""
}

# Create test API endpoint
create_test_endpoint() {
    echo -e "${BLUE}🧪 Creating Test API Endpoint${NC}"
    
    # Create test directory
    mkdir -p src/app/api/test/clients
    
    # Create test route
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
    echo ""
}

# Final instructions
show_final_instructions() {
    echo -e "${GREEN}🎉 Database Setup Complete!${NC}"
    echo "=========================="
    echo ""
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo ""
    echo "1. 🚀 Start local development:"
    echo "   npm run dev"
    echo "   # or with local D1:"
    echo "   wrangler dev --local --persist"
    echo ""
    echo "2. 🧪 Test the database:"
    echo "   chmod +x scripts/test-database.js"
    echo "   node scripts/test-database.js"
    echo ""
    echo "3. 👥 Manage clients:"
    echo "   ./scripts/manage-clients.sh list"
    echo "   ./scripts/manage-clients.sh add \"Client Name\" \"email@example.com\" \"https://website.com\" \"CODE2024\""
    echo ""
    echo "4. 📊 Check database status:"
    echo "   ./scripts/db-status.sh"
    echo ""
    echo "5. 🌐 Access the login page:"
    echo "   http://localhost:3000/login"
    echo ""
    echo -e "${BLUE}🔑 Demo Login Codes:${NC}"
    echo "   SPARKLE2024 - Sparkle Clean Services"
    echo "   DEMO2024    - Demo Client"
    echo ""
    echo -e "${BLUE}📚 Documentation:${NC}"
    echo "   README_DASHBOARD.md     - Complete system overview"
    echo "   TRACKING_INTEGRATION.md - Client integration guide"
    echo ""
    echo -e "${YELLOW}⚠️  Important Notes:${NC}"
    echo "   • Update wrangler.toml with your actual database_id"
    echo "   • Keep your client codes secure"
    echo "   • Regular backups: wrangler d1 export $DB_NAME --output=backup.sql"
    echo ""
    echo -e "${GREEN}✅ Setup completed successfully!${NC}"
}

# Main execution
main() {
    check_prerequisites
    authenticate_cloudflare
    create_database
    apply_schema
    verify_setup
    setup_dev_environment
    create_test_endpoint
    show_final_instructions
}

# Run main function
main 