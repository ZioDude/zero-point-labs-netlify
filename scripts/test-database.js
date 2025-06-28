#!/usr/bin/env node

/**
 * Database Test Script
 * Run with: node scripts/test-database.js
 */

async function testDatabaseConnection() {
  console.log('🧪 Testing database connection...\n');

  try {
    // Test 1: List all clients
    console.log('1️⃣ Testing client query...');
    const clientsResponse = await fetch('http://localhost:8787/api/test/clients', {
      method: 'GET',
    });
    
    if (clientsResponse.ok) {
      const clients = await clientsResponse.json();
      console.log('✅ Clients found:', clients.length);
      clients.forEach(client => {
        console.log(`   - ${client.name} (${client.client_code})`);
      });
    } else {
      console.log('❌ Failed to fetch clients');
    }

    // Test 2: Test authentication
    console.log('\n2️⃣ Testing authentication...');
    const authResponse = await fetch('http://localhost:8787/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientCode: 'SPARKLE2024'
      }),
    });

    if (authResponse.ok) {
      const authResult = await authResponse.json();
      console.log('✅ Authentication successful for:', authResult.client?.name);
    } else {
      console.log('❌ Authentication failed');
    }

    // Test 3: Test analytics tracking
    console.log('\n3️⃣ Testing analytics tracking...');
    const trackResponse = await fetch('http://localhost:8787/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientCode: 'SPARKLE2024',
        type: 'page_view',
        data: {
          count: 1,
          page: '/test-page',
          title: 'Test Page'
        }
      }),
    });

    if (trackResponse.ok) {
      console.log('✅ Analytics tracking successful');
    } else {
      console.log('❌ Analytics tracking failed');
    }

    console.log('\n🎉 Database test completed!');

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.log('\n💡 Make sure to run "wrangler dev --local" first');
  }
}

// Add test API endpoint for clients
const testEndpoint = `
// Add this to your API routes for testing
// File: src/app/api/test/clients/route.ts

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
`;

if (require.main === module) {
  testDatabaseConnection();
} 