# Zero Point Labs Dashboard System

A comprehensive client management and analytics dashboard system built into the Zero Point Labs website.

## 🌟 Features

### For Zero Point Labs
- **Client Management**: Manage all client accounts with unique access codes
- **Multi-Client Analytics**: Track performance across all client websites
- **Centralized Dashboard**: View analytics, form submissions, visitor data
- **Secure Authentication**: Token-based authentication system
- **Real-time Tracking**: Live analytics updates from client sites

### For Clients
- **Unique Login Codes**: Secure access with personalized client codes
- **Analytics Dashboard**: View website performance metrics
- **Form Submissions**: Monitor contact form submissions
- **Visitor Tracking**: See visitor trends and engagement
- **Mobile Responsive**: Full mobile support

## 🚀 System Architecture

### Database (Cloudflare D1)
```
├── clients                 # Client information and codes
├── client_sessions        # Authentication sessions
├── form_submissions       # Form data from client sites
├── analytics_data         # Daily analytics aggregations
├── visitor_sessions       # Visitor session tracking
└── page_views            # Individual page view records
```

### API Endpoints
```
├── /api/auth/login       # Client authentication
├── /api/auth/validate    # Session validation
├── /api/track           # Analytics data collection
├── /api/dashboard/analytics    # Dashboard analytics
└── /api/dashboard/submissions  # Form submissions
```

### Frontend Structure
```
├── /login                # Client login page
├── /dashboard           # Main dashboard
├── /dashboard/analytics # Detailed analytics
├── /dashboard/submissions # Form submissions
├── /dashboard/visitors  # Visitor analytics
└── /dashboard/settings  # Client settings
```

## 🔧 Setup Instructions

### 1. Database Setup

1. Create a Cloudflare D1 database:
```bash
wrangler d1 create zero-point-labs-dashboard
```

2. Update `wrangler.toml` with your database ID:
```toml
[[d1_databases]]
binding = "DB"
database_name = "zero-point-labs-dashboard"
database_id = "your-actual-database-id"
```

3. Run the schema setup:
```bash
wrangler d1 execute zero-point-labs-dashboard --file=./schema.sql
```

### 2. Environment Variables

Create `.env.local`:
```env
# Database
DATABASE_URL="your-d1-connection-string"

# Authentication
JWT_SECRET="your-secure-jwt-secret"

# Optional: Analytics APIs
NEXT_PUBLIC_ANALYTICS_URL="https://your-domain.com/api/track"
```

### 3. Deploy to Cloudflare

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
wrangler pages publish .next
```

## 👥 Client Management

### Adding New Clients

Clients are added to the database with unique codes:

```sql
INSERT INTO clients (id, name, email, website_url, client_code, is_active) 
VALUES ('client-003', 'New Client', 'client@example.com', 'https://client.com', 'CLIENT2024', 1);
```

### Client Codes
- Format: `ALPHANUMERIC` (e.g., `SPARKLE2024`, `DEMO2024`)
- Must be unique per client
- Case-insensitive on login
- Should be memorable but secure

## 🔗 Client Integration

### Quick Integration

Add to client website's `<head>`:
```html
<script>
  window.ZPL_CONFIG = {
    clientCode: 'SPARKLE2024',
    trackPageViews: true,
    trackFormSubmissions: true,
    debug: false
  };
</script>
<script src="https://your-dashboard-domain.com/tracking.js"></script>
```

### Next.js Integration

```tsx
// app/layout.tsx
import Script from 'next/script';

export default function Layout({ children }) {
  return (
    <html>
      <head>
        <Script id="zpl-config" strategy="beforeInteractive">
          {`
            window.ZPL_CONFIG = {
              clientCode: 'SPARKLE2024',
              trackPageViews: true,
              trackFormSubmissions: true,
              debug: ${process.env.NODE_ENV === 'development'}
            };
          `}
        </Script>
        <Script src="https://your-dashboard-domain.com/tracking.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## 📊 Analytics Tracking

### Automatic Tracking
- **Page Views**: Tracked on every page load
- **Visitors**: Unique visitors per session
- **Form Submissions**: Automatic form detection and tracking
- **Session Data**: Duration, referrer, user agent

### Manual Tracking
```javascript
// Track custom events
ZPLTracking.trackCustomEvent('button_click', {
  button: 'Get Quote',
  location: 'header'
});

// Track form submissions manually
ZPLTracking.trackFormSubmission({
  name: 'John Doe',
  email: 'john@example.com',
  service: 'Web Design',
  message: 'Need a new website'
});
```

## 🔐 Security Features

### Authentication
- Token-based authentication with expiration
- Session management with automatic cleanup
- Client-specific data isolation
- Secure password-less login with codes

### Data Protection
- CORS protection for cross-origin requests
- Input validation on all endpoints
- SQL injection prevention with prepared statements
- Rate limiting on sensitive endpoints

## 🎨 UI/UX Features

### Design Consistency
- Matches Zero Point Labs branding
- Dark theme with orange accents
- Responsive mobile design
- Smooth animations and transitions

### User Experience
- Intuitive navigation
- Real-time data updates
- Loading states and error handling
- Mobile-first responsive design

## 🔧 Customization

### Adding New Analytics
1. Update database schema
2. Modify tracking script
3. Update API endpoints
4. Add dashboard components

### Custom Dashboard Sections
```tsx
// components/dashboard/CustomSection.tsx
export default function CustomSection() {
  return (
    <div className="bg-black/95 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">
        Custom Analytics
      </h3>
      {/* Your custom content */}
    </div>
  );
}
```

## 🚀 Deployment Checklist

- [ ] Database created and schema applied
- [ ] Environment variables configured
- [ ] CORS settings updated for client domains
- [ ] SSL certificate installed
- [ ] Client codes generated and distributed
- [ ] Tracking script URLs updated
- [ ] Client integration tested

## 📱 Mobile Support

The dashboard is fully responsive and optimized for:
- iOS Safari
- Android Chrome
- Mobile browsers
- Tablet devices

## 🔄 Data Flow

1. **Client Site**: User visits client website
2. **Tracking Script**: Collects analytics data
3. **API**: Sends data to `/api/track` endpoint
4. **Database**: Stores data in Cloudflare D1
5. **Dashboard**: Client views data in real-time
6. **Analytics**: Aggregated daily for reporting

## 🛠️ Troubleshooting

### Common Issues

1. **Client Code Invalid**
   - Check database for correct code
   - Verify case sensitivity
   - Ensure client is active

2. **Tracking Not Working**
   - Check CORS settings
   - Verify script URL
   - Enable debug mode

3. **Dashboard Not Loading**
   - Check authentication status
   - Verify API endpoints
   - Check browser console

### Debug Mode

Enable debug logging:
```javascript
window.ZPL_CONFIG = {
  clientCode: 'YOUR_CODE',
  debug: true
};
```

## 📈 Performance

- **Database**: Optimized with proper indexes
- **Caching**: Session and analytics data caching
- **CDN**: Static assets served via Cloudflare
- **Lazy Loading**: Components loaded on demand

## 🔮 Future Enhancements

- [ ] Advanced analytics (conversion tracking, funnel analysis)
- [ ] Email notifications for form submissions
- [ ] White-label dashboard options
- [ ] Advanced filtering and date ranges
- [ ] Export functionality (PDF, CSV)
- [ ] API webhooks for third-party integrations
- [ ] Advanced user permissions
- [ ] Custom branding per client

## 💬 Support

For technical support or questions:
- Email: support@zeropointlabs.com
- Documentation: See `TRACKING_INTEGRATION.md`
- Issues: Create GitHub issue

---

*Built with ❤️ by Zero Point Labs* 