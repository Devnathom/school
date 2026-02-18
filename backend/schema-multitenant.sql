-- Multi-Tenant School Management System Schema

-- Plans/Packages
CREATE TABLE IF NOT EXISTS plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  max_students INT DEFAULT 50,
  max_teachers INT DEFAULT 10,
  max_classes INT DEFAULT 10,
  features TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default plans
INSERT INTO plans (name, slug, price, max_students, max_teachers, max_classes, features) VALUES
('ฟรี', 'free', 0, 50, 10, 5, 'จัดการนักเรียน,จัดการครู,เช็คชื่อ,รายงานพื้นฐาน'),
('Pro', 'pro', 299, 500, 50, 30, 'ทุกฟีเจอร์ฟรี,จัดการเกรด,รายงานขั้นสูง,ส่งออก Excel'),
('Enterprise', 'enterprise', 999, 9999, 999, 999, 'ทุกฟีเจอร์ Pro,API Access,Support 24/7,Custom Branding');

-- Schools
CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  logo VARCHAR(255),
  plan_id INT DEFAULT 1,
  status ENUM('active', 'suspended', 'pending') DEFAULT 'pending',
  expires_at DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (plan_id) REFERENCES plans(id)
);

-- Users (all users including super admin, school admin, teachers)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  school_id INT,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(200) NOT NULL,
  role ENUM('super_admin', 'school_admin', 'teacher', 'staff') DEFAULT 'staff',
  avatar VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

-- Add school_id to existing tables
ALTER TABLE students ADD COLUMN school_id INT AFTER id;
ALTER TABLE students ADD FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE;

ALTER TABLE teachers ADD COLUMN school_id INT AFTER id;
ALTER TABLE teachers ADD FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE;

ALTER TABLE classes ADD COLUMN school_id INT AFTER id;
ALTER TABLE classes ADD FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE;

ALTER TABLE subjects ADD COLUMN school_id INT AFTER id;
ALTER TABLE subjects ADD FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE;

ALTER TABLE attendance ADD COLUMN school_id INT AFTER id;
ALTER TABLE attendance ADD FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE;

ALTER TABLE grades ADD COLUMN school_id INT AFTER id;
ALTER TABLE grades ADD FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE;

-- Insert Super Admin
INSERT INTO users (school_id, email, password, name, role) VALUES
(NULL, 'superadmin@schoolms.com', '$2a$10$example', 'Super Admin', 'super_admin');
