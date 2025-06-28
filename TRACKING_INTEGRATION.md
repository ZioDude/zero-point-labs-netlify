# Zero Point Labs Dashboard Integration Guide

This guide explains how to integrate your client websites with the Zero Point Labs dashboard system to track analytics and form submissions.

## Quick Start

### 1. Include the Tracking Script

Add this script to your client website's HTML `<head>` section:

```html
<!-- Zero Point Labs Analytics -->
<script>
  window.ZPL_CONFIG = {
    clientCode: 'YOUR_CLIENT_CODE', // Replace with your actual client code
    trackPageViews: true,
    trackFormSubmissions: true,
    debug: false // Set to true for development
  };
</script>
<script src="https://your-dashboard-domain.com/tracking.js"></script>
```

### 2. Replace Configuration

Replace `YOUR_CLIENT_CODE` with the unique client code provided by Zero Point Labs.
Replace `your-dashboard-domain.com` with the actual dashboard domain.

## Integration Examples

### Next.js Integration

Create a component for the tracking script:

```tsx
// components/ZPLTracking.tsx
import Script from 'next/script';

interface ZPLTrackingProps {
  clientCode: string;
  debug?: boolean;
}

export default function ZPLTracking({ clientCode, debug = false }: ZPLTrackingProps) {
  return (
    <>
      <Script id="zpl-config" strategy="beforeInteractive">
        {`
          window.ZPL_CONFIG = {
            clientCode: '${clientCode}',
            trackPageViews: true,
            trackFormSubmissions: true,
            debug: ${debug}
          };
        `}
      </Script>
      <Script 
        src="https://your-dashboard-domain.com/tracking.js"
        strategy="afterInteractive"
      />
    </>
  );
}
```

Then include it in your layout:

```tsx
// app/layout.tsx
import ZPLTracking from '@/components/ZPLTracking';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <ZPLTracking clientCode="SPARKLE2024" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Manual Form Tracking

For custom form handling:

```javascript
// Track a form submission manually
ZPLTracking.trackFormSubmission({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '(555) 123-4567',
  service: 'Website Design',
  message: 'I need a new website',
  urgency: 'this-week'
});
```

### Custom Event Tracking

Track custom events:

```javascript
// Track custom events
ZPLTracking.trackCustomEvent('button_click', {
  button: 'Get Quote',
  location: 'header'
});

ZPLTracking.trackCustomEvent('video_play', {
  video: 'intro-video',
  duration: 30
});
```

## API Endpoints

The tracking script sends data to these endpoints:

- `POST /api/track` - Main tracking endpoint

### Data Types

1. **page_view** - Tracks page visits
2. **visitor** - Tracks unique visitors
3. **form_submission** - Tracks form submissions
4. **analytics_bulk** - Bulk analytics updates

## Simple Template Integration Example

Here's how to integrate the tracking into your simple template:

### 1. Update the layout file

```tsx
// simple-template/src/app/layout.tsx
import type { Metadata } from "next";
import Script from 'next/script';
import "./globals.css";

const CLIENT_CODE = process.env.NEXT_PUBLIC_CLIENT_CODE || 'SPARKLE2024';
const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://zero-point-labs.vercel.app';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Zero Point Labs Analytics */}
        <Script id="zpl-config" strategy="beforeInteractive">
          {`
            window.ZPL_CONFIG = {
              clientCode: '${CLIENT_CODE}',
              trackPageViews: true,
              trackFormSubmissions: true,
              debug: ${process.env.NODE_ENV === 'development'}
            };
          `}
        </Script>
        <Script 
          src="${DASHBOARD_URL}/tracking.js"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 2. Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_CLIENT_CODE=SPARKLE2024
NEXT_PUBLIC_DASHBOARD_URL=https://your-dashboard-domain.com
```

### 3. Manual Analytics Integration

For more advanced tracking, you can also send analytics data from your API routes:

```tsx
// simple-template/src/app/api/sync-analytics/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Get your local analytics data
    const localAnalytics = getLocalAnalyticsData();
    
    // Send to dashboard
    const response = await fetch('https://your-dashboard-domain.com/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientCode: process.env.CLIENT_CODE,
        type: 'analytics_bulk',
        data: {
          visitors_count: localAnalytics.totalVisitors,
          page_views_count: localAnalytics.totalPageViews,
          submissions_count: localAnalytics.totalSubmissions,
          // ... other analytics data
        }
      }),
    });

    if (response.ok) {
      return NextResponse.json({ success: true });
    } else {
      throw new Error('Failed to sync analytics');
    }
  } catch (error) {
    console.error('Analytics sync error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
```

## Testing

1. Set `debug: true` in the configuration
2. Open browser developer tools
3. Check console for tracking messages
4. Verify data appears in the dashboard

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the dashboard domain allows your client domain
2. **Invalid Client Code**: Check that the client code is correct
3. **Network Errors**: Verify the dashboard URL is accessible

### Debug Mode

Enable debug mode to see detailed logging:

```javascript
window.ZPL_CONFIG = {
  clientCode: 'YOUR_CLIENT_CODE',
  debug: true
};
```

## Security Notes

- Client codes are not sensitive but should be unique per client
- The tracking script only sends analytics data, no sensitive information
- All data is sent over HTTPS
- Session data is stored in browser sessionStorage only

## Support

For integration support, contact Zero Point Labs or refer to the dashboard documentation. 