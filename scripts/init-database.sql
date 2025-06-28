-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  website_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table for tracking visitors
CREATE TABLE IF NOT EXISTS analytics (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  visitor_id TEXT,
  page_path TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Form submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  service TEXT,
  message TEXT,
  urgency TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Page views table
CREATE TABLE IF NOT EXISTS page_views (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  page_path TEXT,
  visitor_id TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_analytics_client_id ON analytics(client_id);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_visitor_id ON analytics(visitor_id);
CREATE INDEX IF NOT EXISTS idx_submissions_client_id ON submissions(client_id);
CREATE INDEX IF NOT EXISTS idx_submissions_timestamp ON submissions(timestamp);
CREATE INDEX IF NOT EXISTS idx_page_views_client_id ON page_views(client_id);
CREATE INDEX IF NOT EXISTS idx_page_views_timestamp ON page_views(timestamp);

-- Insert some test clients
INSERT OR IGNORE INTO clients (id, code, name, website_url) VALUES
  ('1', 'DEMO123', 'Demo Cleaning Services', 'https://demo-cleaning.example.com'),
  ('2', 'TEST456', 'Test Company', 'https://test-company.example.com');
