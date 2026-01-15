-- SavorChef D1 Database Schema

-- Users Favorites Table
CREATE TABLE favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  recipe_id TEXT NOT NULL,
  recipe_data TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(user_id, recipe_id)
);

-- User Preferences (Taste Memory)
CREATE TABLE preferences (
  user_id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Usage Tracking (for analytics)
CREATE TABLE usage_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  action TEXT NOT NULL,
  metadata TEXT,
  created_at INTEGER NOT NULL
);

-- Indexes
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_usage_user ON usage_logs(user_id);
CREATE INDEX idx_usage_date ON usage_logs(created_at);