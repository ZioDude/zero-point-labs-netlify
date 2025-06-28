#!/bin/bash

# Deployment Preparation Script
# Removes cache files and unnecessary build artifacts before deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧹 Preparing deployment files...${NC}"

# Check if .next directory exists
if [ ! -d ".next" ]; then
    echo -e "${RED}❌ .next directory not found. Please run 'npm run build' first.${NC}"
    exit 1
fi

# Function to get directory size
get_size() {
    if [ -d "$1" ]; then
        du -sh "$1" 2>/dev/null | cut -f1 || echo "0B"
    else
        echo "0B"
    fi
}

# Show initial size
echo -e "${YELLOW}📊 Initial .next directory size: $(get_size .next)${NC}"

# Remove cache directories (main culprit)
if [ -d ".next/cache" ]; then
    cache_size=$(get_size .next/cache)
    echo -e "${YELLOW}🗑️  Removing .next/cache (${cache_size})...${NC}"
    rm -rf .next/cache
    echo -e "${GREEN}✅ Cache directory removed${NC}"
fi

# Remove webpack cache if it exists
if [ -d ".next/cache/webpack" ]; then
    echo -e "${YELLOW}🗑️  Removing webpack cache...${NC}"
    rm -rf .next/cache/webpack
fi

# Remove source maps (optional - saves space)
echo -e "${YELLOW}🗑️  Removing source maps to save space...${NC}"
find .next -name "*.map" -type f -delete 2>/dev/null || true

# Remove any other cache directories
find .next -name "cache" -type d -exec rm -rf {} + 2>/dev/null || true

# Create deployment directory
echo -e "${YELLOW}📁 Creating clean deployment directory...${NC}"
if [ -d ".next-deploy" ]; then
    rm -rf .next-deploy
fi

# Copy .next to deployment directory, excluding problematic files
cp -r .next .next-deploy

# Remove any remaining large files (over 20MB)
echo -e "${YELLOW}🔍 Checking for large files...${NC}"
find .next-deploy -type f -size +20M -exec ls -lh {} \; | while read line; do
    file=$(echo "$line" | awk '{print $NF}')
    size=$(echo "$line" | awk '{print $5}')
    echo -e "${YELLOW}⚠️  Large file found: $file ($size)${NC}"
    
    # Remove if it's a cache or temporary file
    if [[ "$file" == *cache* ]] || [[ "$file" == *temp* ]] || [[ "$file" == *.map ]]; then
        echo -e "${YELLOW}🗑️  Removing large file: $file${NC}"
        rm -f "$file"
    fi
done

# Show final size
echo -e "${YELLOW}📊 Final deployment directory size: $(get_size .next-deploy)${NC}"

# List contents for verification
echo -e "${BLUE}📋 Deployment directory contents:${NC}"
ls -la .next-deploy/

echo ""
echo -e "${GREEN}✅ Deployment preparation complete!${NC}"
echo -e "${BLUE}📁 Deploy from: .next-deploy${NC}" 