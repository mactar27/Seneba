-- SENEBA Driver App Database Schema (MySQL)

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  profile_image_url VARCHAR(512),
  vehicle_make VARCHAR(100),
  vehicle_model VARCHAR(100),
  vehicle_year INT,
  vehicle_color VARCHAR(50),
  license_plate VARCHAR(20),
  license_document_url VARCHAR(512),
  registration_document_url VARCHAR(512),
  is_available BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_rides INT DEFAULT 0,
  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Rides table
CREATE TABLE IF NOT EXISTS rides (
  id VARCHAR(36) PRIMARY KEY,
  client_id VARCHAR(36) NOT NULL,
  driver_id VARCHAR(36),
  pickup_address TEXT NOT NULL,
  pickup_latitude DECIMAL(10, 8) NOT NULL,
  pickup_longitude DECIMAL(11, 8) NOT NULL,
  destination_address TEXT NOT NULL,
  destination_latitude DECIMAL(10, 8) NOT NULL,
  destination_longitude DECIMAL(11, 8) NOT NULL,
  distance_km DECIMAL(10, 2),
  duration_minutes INT,
  base_fare DECIMAL(10, 2) DEFAULT 50.00,
  distance_fare DECIMAL(10, 2),
  time_fare DECIMAL(10, 2),
  total_fare DECIMAL(10, 2),
  status ENUM('requested', 'accepted', 'arriving', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'requested',
  client_name VARCHAR(255),
  client_phone VARCHAR(20),
  client_user_id VARCHAR(36),
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP NULL,
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  cancelled_at TIMESTAMP NULL,
  cancelled_by ENUM('client', 'driver') NULL,
  rating INT COMMENT '1 to 5',
  rating_comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (driver_id) REFERENCES drivers(id),
  FOREIGN KEY (client_user_id) REFERENCES users(id)
);

-- Driver earnings table
CREATE TABLE IF NOT EXISTS driver_earnings (
  id VARCHAR(36) PRIMARY KEY,
  driver_id VARCHAR(36) NOT NULL,
  ride_id VARCHAR(36),
  amount DECIMAL(10, 2) NOT NULL,
  commission_rate DECIMAL(5, 2) DEFAULT 15.00,
  commission_amount DECIMAL(10, 2),
  net_amount DECIMAL(10, 2),
  earning_type ENUM('ride', 'bonus', 'tip') NOT NULL DEFAULT 'ride',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE,
  FOREIGN KEY (ride_id) REFERENCES rides(id)
);

-- Indexes
CREATE INDEX idx_drivers_user_id ON drivers(user_id);
CREATE INDEX idx_drivers_available ON drivers(is_available);
CREATE INDEX idx_rides_driver_id ON rides(driver_id);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_earnings_driver_id ON driver_earnings(driver_id);
CREATE INDEX idx_earnings_created_at ON driver_earnings(created_at);
