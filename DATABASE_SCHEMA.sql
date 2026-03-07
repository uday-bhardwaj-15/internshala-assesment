-- CarRent Database Schema
-- This schema is designed to support the car rental platform with customers and agencies

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type ENUM('customer', 'agency') NOT NULL,
  agency_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_type (type)
);

-- Create Cars table
CREATE TABLE IF NOT EXISTS cars (
  id VARCHAR(36) PRIMARY KEY,
  agency_id VARCHAR(36) NOT NULL,
  model VARCHAR(255) NOT NULL,
  vehicle_number VARCHAR(255) NOT NULL UNIQUE,
  seating_capacity INT NOT NULL,
  rent_per_day DECIMAL(10, 2) NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (agency_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_agency_id (agency_id),
  INDEX idx_available (available)
);

-- Create Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(36) PRIMARY KEY,
  car_id VARCHAR(36) NOT NULL,
  customer_id VARCHAR(36) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  number_of_days INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_car_id (car_id),
  INDEX idx_customer_id (customer_id),
  INDEX idx_start_date (start_date),
  INDEX idx_status (status)
);

-- Create Sessions table (for authentication)
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);

-- Sample data for testing (OPTIONAL - remove for production)
INSERT INTO users (id, email, password_hash, name, type, agency_name) VALUES
('user-1', 'customer@example.com', '$2b$10$hashedpassword', 'John Doe', 'customer', NULL),
('agency-1', 'agency@example.com', '$2b$10$hashedpassword', 'Jane Smith', 'agency', 'QuickRent Agency');

INSERT INTO cars (id, agency_id, model, vehicle_number, seating_capacity, rent_per_day, available) VALUES
('car-1', 'agency-1', 'Toyota Camry', 'CAR001', 5, 50.00, TRUE),
('car-2', 'agency-1', 'Honda Civic', 'CAR002', 5, 45.00, TRUE),
('car-3', 'agency-1', 'Ford Mustang', 'CAR003', 4, 80.00, TRUE);

-- Note: Password hashes above are placeholders. Use bcrypt hashing in your application!
