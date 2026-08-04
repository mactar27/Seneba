-- Create clients table for passenger users (MySQL)
CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  profile_image_url VARCHAR(512),
  home_address TEXT,
  home_latitude DECIMAL(10, 8),
  home_longitude DECIMAL(11, 8),
  work_address TEXT,
  work_latitude DECIMAL(10, 8),
  work_longitude DECIMAL(11, 8),
  total_rides INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add client_user_id to rides table if not exists
-- Handled in mysql-schema.sql already

-- Create index for faster lookups
CREATE INDEX idx_clients_user_id ON clients(user_id);
