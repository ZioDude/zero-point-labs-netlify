-- Initialize demo clients for Zero Point Labs Dashboard
-- This script adds analytics and form submission data to existing clients

-- First, let's check what clients exist
SELECT 'Existing clients:' as info;
SELECT id, name, client_code FROM clients;

-- Insert analytics data for existing clients (last 7 days)
-- Using the client IDs from the schema
INSERT OR IGNORE INTO analytics_data (id, client_id, date, visitors_count, page_views_count, submissions_count, bounce_rate, avg_session_duration, created_at, updated_at) VALUES
-- Sparkle Clean data (client-001)
('analytics-sparkle-1', 'client-001', date('now', '-6 days'), 45, 120, 2, 35.5, 180, datetime('now'), datetime('now')),
('analytics-sparkle-2', 'client-001', date('now', '-5 days'), 52, 145, 3, 32.1, 195, datetime('now'), datetime('now')),
('analytics-sparkle-3', 'client-001', date('now', '-4 days'), 38, 98, 1, 40.2, 165, datetime('now'), datetime('now')),
('analytics-sparkle-4', 'client-001', date('now', '-3 days'), 61, 178, 4, 28.9, 210, datetime('now'), datetime('now')),
('analytics-sparkle-5', 'client-001', date('now', '-2 days'), 55, 162, 2, 31.5, 188, datetime('now'), datetime('now')),
('analytics-sparkle-6', 'client-001', date('now', '-1 days'), 48, 135, 3, 33.8, 175, datetime('now'), datetime('now')),
('analytics-sparkle-7', 'client-001', date('now'), 42, 110, 1, 36.2, 170, datetime('now'), datetime('now')),

-- Demo Client data (client-002)
('analytics-demo-1', 'client-002', date('now', '-6 days'), 25, 68, 1, 42.5, 150, datetime('now'), datetime('now')),
('analytics-demo-2', 'client-002', date('now', '-5 days'), 32, 85, 2, 38.1, 165, datetime('now'), datetime('now')),
('analytics-demo-3', 'client-002', date('now', '-4 days'), 28, 72, 0, 45.2, 140, datetime('now'), datetime('now')),
('analytics-demo-4', 'client-002', date('now', '-3 days'), 35, 95, 3, 35.9, 180, datetime('now'), datetime('now')),
('analytics-demo-5', 'client-002', date('now', '-2 days'), 30, 82, 1, 40.5, 155, datetime('now'), datetime('now')),
('analytics-demo-6', 'client-002', date('now', '-1 days'), 33, 88, 2, 37.8, 170, datetime('now'), datetime('now')),
('analytics-demo-7', 'client-002', date('now'), 29, 75, 1, 41.2, 160, datetime('now'), datetime('now'));

-- Insert sample form submissions
INSERT OR IGNORE INTO form_submissions (id, client_id, name, email, phone, service, message, urgency, status, source_url, created_at, updated_at) VALUES
-- Sparkle Clean submissions (client-001)
('sub-sparkle-1', 'client-001', 'John Doe', 'john@example.com', '(555) 123-4567', 'Deep Cleaning', 'Need a deep clean for my 3-bedroom house', 'this-week', 'new', 'https://sparkleclean.com/contact', datetime('now', '-5 days'), datetime('now', '-5 days')),
('sub-sparkle-2', 'client-001', 'Jane Smith', 'jane@example.com', '(555) 234-5678', 'Regular Cleaning', 'Looking for weekly cleaning service', 'flexible', 'contacted', 'https://sparkleclean.com/services', datetime('now', '-4 days'), datetime('now', '-3 days')),
('sub-sparkle-3', 'client-001', 'Bob Johnson', 'bob@example.com', NULL, 'Office Cleaning', 'Need quote for office cleaning', 'next-month', 'new', 'https://sparkleclean.com', datetime('now', '-2 days'), datetime('now', '-2 days')),

-- Demo Client submissions (client-002)
('sub-demo-1', 'client-002', 'Alice Brown', 'alice@example.com', '(555) 345-6789', 'General Inquiry', 'Interested in your services', 'flexible', 'new', 'https://demo.example.com/contact', datetime('now', '-3 days'), datetime('now', '-3 days')),
('sub-demo-2', 'client-002', 'Charlie Davis', 'charlie@example.com', '(555) 456-7890', 'Support', 'Need help with my account', 'today', 'resolved', 'https://demo.example.com/support', datetime('now', '-1 days'), datetime('now'));

-- Verify the data was inserted
SELECT 'Total clients:' as info, COUNT(*) as count FROM clients;
SELECT 'Analytics records inserted:' as info, COUNT(*) as count FROM analytics_data;
SELECT 'Form submissions inserted:' as info, COUNT(*) as count FROM form_submissions;
