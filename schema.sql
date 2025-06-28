-- ====================================
-- Zero Point Labs Dashboard Schema
-- ====================================

-- ====================================
-- CLIENTS TABLE
-- ====================================
CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  website_url TEXT,
  client_code TEXT UNIQUE NOT NULL,
  is_active INTEGER DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_clients_code ON clients(client_code);
CREATE INDEX idx_clients_active ON clients(is_active);

-- ====================================
-- CLIENT SESSIONS TABLE
-- ====================================
CREATE TABLE client_sessions (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE INDEX idx_sessions_token ON client_sessions(session_token);
CREATE INDEX idx_sessions_expires ON client_sessions(expires_at);

-- ====================================
-- FORM SUBMISSIONS TABLE
-- ====================================
CREATE TABLE form_submissions (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT NOT NULL,
  message TEXT,
  urgency TEXT DEFAULT 'flexible',
  status TEXT DEFAULT 'new',
  source_url TEXT,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE INDEX idx_form_submissions_client ON form_submissions(client_id);
CREATE INDEX idx_form_submissions_created_at ON form_submissions(created_at DESC);
CREATE INDEX idx_form_submissions_status ON form_submissions(status);

-- ====================================
-- ANALYTICS DATA TABLE
-- ====================================
CREATE TABLE analytics_data (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  date TEXT NOT NULL,
  visitors_count INTEGER DEFAULT 0,
  page_views_count INTEGER DEFAULT 0,
  submissions_count INTEGER DEFAULT 0,
  bounce_rate REAL DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0,
  top_pages TEXT DEFAULT '[]',
  traffic_sources TEXT DEFAULT '[]',
  device_types TEXT DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (client_id) REFERENCES clients(id),
  UNIQUE(client_id, date)
);

CREATE INDEX idx_analytics_client_date ON analytics_data(client_id, date DESC);

-- ====================================
-- VISITOR SESSIONS TABLE
-- ====================================
CREATE TABLE visitor_sessions (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  first_page TEXT,
  last_page TEXT,
  page_views INTEGER DEFAULT 1,
  duration INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE INDEX idx_visitor_sessions_client ON visitor_sessions(client_id);
CREATE INDEX idx_visitor_sessions_date ON visitor_sessions(created_at DESC);

-- ====================================
-- PAGE VIEWS TABLE
-- ====================================
CREATE TABLE page_views (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  page_title TEXT,
  timestamp TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE INDEX idx_page_views_client ON page_views(client_id);
CREATE INDEX idx_page_views_timestamp ON page_views(timestamp DESC);

-- ====================================
-- SAMPLE DATA
-- ====================================
-- Insert sample clients
INSERT INTO clients (id, name, email, website_url, client_code) VALUES 
('client-001', 'Sparkle Clean Services', 'owner@sparkleclean.com', 'https://sparkleclean.com', 'SPARKLE2024'),
('client-002', 'Demo Client', 'demo@example.com', 'https://demo.com', 'DEMO2024'); 