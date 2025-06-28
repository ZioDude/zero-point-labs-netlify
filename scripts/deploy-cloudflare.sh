#!/bin/bash

# Zero Point Labs Dashboard - Cloudflare Pages Deployment Script
# This script handles project creation and deployment to Cloudflare Pages

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="zero-point-labs-dashboard"
PRODUCTION_BRANCH="main"
BUILD_COMMAND="npm run build"
BUILD_OUTPUT_DIR=".next-deploy"  # Updated to use cleaned directory

echo -e "${BLUE}🚀 Zero Point Labs Dashboard - Cloudflare Pages Deployment${NC}"
echo "=========================================================="
echo ""

# Check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
    
    # Check if wrangler is installed
    if ! command -v wrangler &> /dev/null; then
        echo -e "${RED}❌ Wrangler CLI not found. Installing...${NC}"
        npm install -g wrangler
    else
        echo -e "${GREEN}✅ Wrangler CLI found${NC}"
    fi
    
    # Check if authenticated
    if ! wrangler whoami &> /dev/null; then
        echo -e "${YELLOW}🔑 Please authenticate with Cloudflare...${NC}"
        wrangler login
    else
        echo -e "${GREEN}✅ Authenticated with Cloudflare${NC}"
    fi
    
    # Check if project files exist
    if [ ! -f "package.json" ] || [ ! -f "next.config.js" ] && [ ! -f "next.config.mjs" ]; then
        echo -e "${RED}❌ This doesn't appear to be a Next.js project directory${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
    echo ""
}

# Build the project
build_project() {
    echo -e "${BLUE}🔨 Building Next.js Project${NC}"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Installing dependencies...${NC}"
        npm install
    fi
    
    # Build the project
    echo -e "${YELLOW}🏗️  Building for production...${NC}"
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Build completed successfully${NC}"
    else
        echo -e "${RED}❌ Build failed${NC}"
        exit 1
    fi
    echo ""
}

# Prepare deployment files
prepare_deployment() {
    echo -e "${BLUE}🧹 Preparing deployment files${NC}"
    
    # Make preparation script executable
    chmod +x scripts/prepare-deployment.sh
    
    # Run the preparation script
    ./scripts/prepare-deployment.sh
    
    if [ ! -d "$BUILD_OUTPUT_DIR" ]; then
        echo -e "${RED}❌ Deployment directory not created${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Deployment files prepared${NC}"
    echo ""
}

# Create Pages project
create_pages_project() {
    echo -e "${BLUE}🌐 Creating Cloudflare Pages Project${NC}"
    
    # Check if project already exists
    if wrangler pages project list | grep -q "$PROJECT_NAME"; then
        echo -e "${YELLOW}⚠️  Project '$PROJECT_NAME' already exists${NC}"
        read -p "Do you want to deploy to the existing project? (y/N): " use_existing
        
        if [[ $use_existing =~ ^[Yy]$ ]]; then
            echo -e "${GREEN}✅ Using existing project${NC}"
            return 0
        else
            echo -e "${RED}❌ Deployment cancelled${NC}"
            exit 1
        fi
    fi
    
    # Create new project
    echo -e "${YELLOW}📝 Creating new Pages project...${NC}"
    wrangler pages project create "$PROJECT_NAME" --production-branch "$PRODUCTION_BRANCH"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Pages project created successfully${NC}"
    else
        echo -e "${RED}❌ Failed to create Pages project${NC}"
        echo -e "${YELLOW}💡 You can also create it manually in the dashboard${NC}"
        exit 1
    fi
    echo ""
}

# Deploy to Pages
deploy_to_pages() {
    echo -e "${BLUE}🚀 Deploying to Cloudflare Pages${NC}"
    
    # Show deployment directory size
    if command -v du &> /dev/null; then
        deploy_size=$(du -sh "$BUILD_OUTPUT_DIR" 2>/dev/null | cut -f1 || echo "unknown")
        echo -e "${YELLOW}📊 Deployment size: $deploy_size${NC}"
    fi
    
    # Deploy using the correct command
    echo -e "${YELLOW}📤 Uploading files...${NC}"
    wrangler pages deploy "$BUILD_OUTPUT_DIR" --project-name "$PROJECT_NAME" --commit-dirty=true
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Deployment successful!${NC}"
        
        # Clean up deployment directory
        if [ -d "$BUILD_OUTPUT_DIR" ]; then
            echo -e "${YELLOW}🧹 Cleaning up deployment files...${NC}"
            rm -rf "$BUILD_OUTPUT_DIR"
        fi
    else
        echo -e "${RED}❌ Deployment failed${NC}"
        exit 1
    fi
    echo ""
}

# Setup environment variables
setup_environment_variables() {
    echo -e "${BLUE}⚙️  Setting up Environment Variables${NC}"
    
    echo -e "${YELLOW}🔧 Setting production environment variables...${NC}"
    
    # Set NODE_ENV
    echo "production" | wrangler pages secret put NODE_ENV --project-name "$PROJECT_NAME"
    
    # You can add more environment variables here
    # echo "your-api-key" | wrangler pages secret put API_KEY --project-name "$PROJECT_NAME"
    
    echo -e "${GREEN}✅ Environment variables configured${NC}"
    echo ""
}

# Setup custom domain (optional)
setup_custom_domain() {
    echo ""
    read -p "Do you want to setup a custom domain? (y/N): " setup_domain
    
    if [[ $setup_domain =~ ^[Yy]$ ]]; then
        echo ""
        read -p "Enter your custom domain (e.g., dashboard.zeropointlabs.com): " custom_domain
        
        if [[ -n "$custom_domain" ]]; then
            echo -e "${YELLOW}🌐 Adding custom domain...${NC}"
            wrangler pages domain add "$custom_domain" --project-name "$PROJECT_NAME"
            
            echo -e "${GREEN}✅ Custom domain added${NC}"
            echo -e "${YELLOW}📋 Next steps for custom domain:${NC}"
            echo "   1. Add CNAME record: $custom_domain → $PROJECT_NAME.pages.dev"
            echo "   2. Wait for DNS propagation (up to 24 hours)"
            echo "   3. SSL certificate will be automatically provisioned"
        fi
    fi
}

# Show final information
show_final_info() {
    echo -e "${GREEN}🎉 Deployment Complete!${NC}"
    echo "========================"
    echo ""
    echo -e "${BLUE}📋 Your Dashboard URLs:${NC}"
    echo "   🌐 Production: https://$PROJECT_NAME.pages.dev"
    echo "   🧪 Preview: https://<commit-hash>.$PROJECT_NAME.pages.dev"
    echo ""
    echo -e "${BLUE}🔑 Demo Login Codes:${NC}"
    echo "   SPARKLE2024 - Sparkle Clean Services"
    echo "   DEMO2024    - Demo Client"
    echo ""
    echo -e "${BLUE}📊 Next Steps:${NC}"
    echo "   1. Visit your dashboard URL"
    echo "   2. Test the login with demo codes"
    echo "   3. Create new client codes for your actual clients"
    echo "   4. Add tracking scripts to client websites"
    echo ""
    echo -e "${BLUE}🛠️  Management Commands:${NC}"
    echo "   Deploy updates: npm run pages:deploy"
    echo "   View deployments: npm run pages:list"
    echo "   View logs: npm run pages:logs"
    echo ""
    echo -e "${GREEN}✅ Your Zero Point Labs Dashboard is now live!${NC}"
}

# Main execution
main() {
    check_prerequisites
    build_project
    prepare_deployment
    create_pages_project
    deploy_to_pages
    setup_environment_variables
    setup_custom_domain
    show_final_info
}

# Show help
show_help() {
    echo "Zero Point Labs Dashboard - Cloudflare Pages Deployment"
    echo "======================================================="
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --help, -h    Show this help message"
    echo "  --build-only  Only build the project (don't deploy)"
    echo "  --deploy-only Only deploy (skip build)"
    echo ""
    echo "Examples:"
    echo "  $0                    # Full build and deploy"
    echo "  $0 --build-only       # Just build"
    echo "  $0 --deploy-only      # Just deploy"
}

# Handle command line arguments
case "$1" in
    "--help"|"-h")
        show_help
        exit 0
        ;;
    "--build-only")
        check_prerequisites
        build_project
        prepare_deployment
        echo -e "${GREEN}✅ Build complete. Run with --deploy-only to deploy.${NC}"
        ;;
    "--deploy-only")
        check_prerequisites
        
        # Check if we have a prepared deployment directory
        if [ ! -d "$BUILD_OUTPUT_DIR" ]; then
            echo -e "${YELLOW}⚠️  No prepared deployment found. Preparing now...${NC}"
            if [ ! -d ".next" ]; then
                echo -e "${RED}❌ No build found. Please run 'npm run build' first.${NC}"
                exit 1
            fi
            prepare_deployment
        fi
        
        deploy_to_pages
        show_final_info
        ;;
    "")
        main
        ;;
    *)
        echo -e "${RED}❌ Unknown option: $1${NC}"
        show_help
        exit 1
        ;;
esac 