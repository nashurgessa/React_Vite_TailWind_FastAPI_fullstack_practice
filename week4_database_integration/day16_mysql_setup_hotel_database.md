# Day 16: MySQL Setup & Hotel Database Design

## 🎯 Objectives (4 Hours)

By the end of this 4-hour session, you should be able to:

- Install and configure MySQL for hotel booking
- Design database schema for hotel entities
- Create tables for hotels, rooms, bookings, guests
- Define relationships between entities
- Implement proper data types and constraints
- Add indexes for performance
- Understand normalization for hotel data

---

## 🏨 MySQL for Hotel Booking

**MySQL** provides robust, scalable database storage for hotel booking systems with ACID compliance and strong data integrity.

**MySQL Benefits for Hotel Booking:**
- **Relational Data**: Complex relationships between hotels, rooms, bookings
- **ACID Compliance**: Transactional integrity for bookings
- **Performance**: Fast queries for hotel searches
- **Scalability**: Handle growing booking data
- **Security**: User authentication and data protection

---

## 🎯 Activity 1: Installing MySQL (30 minutes)

### Setting Up MySQL Database

**🏨 MySQL Installation:**

**macOS (Homebrew):**
```bash
brew install mysql
brew services start mysql
```

**Windows:**
```bash
# Download MySQL Installer from https://dev.mysql.com/downloads/installer/
# Follow installation wizard
```

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

**Secure MySQL Installation:**
```bash
mysql_secure_installation
```

**Connect to MySQL:**
```bash
mysql -u root -p
```

**Create Hotel Booking Database:**
```sql
CREATE DATABASE hotel_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hotel_booking;
```

---

## 🎯 Activity 2: Database Schema Design (60 minutes)

### Designing Hotel Booking Schema

**🏨 Hotel Booking ER Diagram:**

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Hotels     │       │    Rooms     │       │  Bookings   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ name        │───────│ hotel_id(FK) │───────│ hotel_id(FK)│
│ location    │       │ room_number │       │ room_number │
│ rating      │       │ type        │       │ guest_id(FK)│
│ price       │       │ capacity    │       │ check_in    │
│ available   │       │ price       │       │ check_out   │
│ description│       │ available   │       │ guests      │
│ created_at  │       │ amenities   │       │ total_price │
│ updated_at  │       │ created_at  │       │ status      │
└─────────────┘       └─────────────┘       │ created_at  │
                                            │ updated_at  │
                                            └─────────────┘
                                                    │
                                                    │
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Guests    │       │   Reviews   │       │  Amenities  │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ name        │       │ hotel_id(FK) │       │ name        │
│ email       │       │ guest_id(FK) │       │ description │
│ phone       │       │ rating      │       │ icon        │
│ address     │       │ comment     │       └─────────────┘
│ city        │       │ created_at  │
│ country     │       └─────────────┘
│ postal_code │
│ created_at  │
│ updated_at  │
└─────────────┘
```

---

## 🎯 Activity 3: Creating Hotel Tables (60 minutes)

### Implementing Database Schema

**🏨 Hotel Table Creation:**

```sql
-- Hotels table
CREATE TABLE hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    available BOOLEAN DEFAULT TRUE,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_location (location),
    INDEX idx_rating (rating),
    INDEX idx_price (price),
    INDEX idx_available (available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Rooms table
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT NOT NULL,
    room_number VARCHAR(10) NOT NULL,
    type ENUM('single', 'double', 'suite', 'penthouse') NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    price_per_night DECIMAL(10,2) NOT NULL CHECK (price_per_night > 0),
    available BOOLEAN DEFAULT TRUE,
    amenities JSON,
    images JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    UNIQUE KEY (hotel_id, room_number),
    INDEX idx_hotel_id (hotel_id),
    INDEX idx_type (type),
    INDEX idx_available (available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Guests table
CREATE TABLE guests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(200),
    city VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    preferences JSON,
    loyalty_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id VARCHAR(20) NOT NULL UNIQUE,
    hotel_id INT NOT NULL,
    room_number VARCHAR(10) NOT NULL,
    guest_id INT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INT NOT NULL CHECK (guests > 0),
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled') DEFAULT 'pending',
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE RESTRICT,
    FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE RESTRICT,
    CHECK (check_out > check_in),
    INDEX idx_booking_id (booking_id),
    INDEX idx_hotel_id (hotel_id),
    INDEX idx_guest_id (guest_id),
    INDEX idx_dates (check_in, check_out),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviews table
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT NOT NULL,
    guest_id INT NOT NULL,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE,
    INDEX idx_hotel_id (hotel_id),
    INDEX idx_guest_id (guest_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Amenities table
CREATE TABLE amenities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(200),
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Hotel amenities junction table
CREATE TABLE hotel_amenities (
    hotel_id INT NOT NULL,
    amenity_id INT NOT NULL,
    PRIMARY KEY (hotel_id, amenity_id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**🎯 Practice:** Create tables for:
- Room availability calendar
- Booking payments
- Hotel images
- Guest preferences

---

## 🎯 Activity 4: Inserting Sample Data (30 minutes)

### Populating Hotel Database

**🏨 Sample Hotel Data:**

```sql
-- Insert amenities
INSERT INTO amenities (name, description, icon) VALUES
('WiFi', 'High-speed wireless internet', 'wifi'),
('Pool', 'Swimming pool', 'pool'),
('Spa', 'Full-service spa', 'spa'),
('Restaurant', 'On-site restaurant', 'restaurant'),
('Gym', 'Fitness center', 'gym'),
('Parking', 'Free parking', 'parking'),
('Air Conditioning', 'Climate control', 'ac'),
('Room Service', '24/7 room service', 'room_service'),
('Bar', 'Hotel bar', 'bar'),
('Beach Access', 'Direct beach access', 'beach');

-- Insert hotels
INSERT INTO hotels (name, location, rating, price, available, description) VALUES
('Grand Palace Hotel', 'New York', 4.5, 200.00, TRUE, 'Luxury hotel in the heart of Manhattan'),
('Seaside Resort', 'Miami', 4.0, 150.00, TRUE, 'Beautiful beachfront resort'),
('Mountain Lodge', 'Denver', 4.8, 180.00, FALSE, 'Cozy mountain retreat'),
('City Center Inn', 'Chicago', 3.5, 120.00, TRUE, 'Affordable downtown accommodation'),
('Ocean View Hotel', 'San Diego', 4.2, 175.00, TRUE, 'Stunning ocean views');

-- Insert rooms
INSERT INTO rooms (hotel_id, room_number, type, capacity, price_per_night, available, amenities) VALUES
(1, '101', 'single', 1, 100.00, TRUE, '["WiFi", "TV"]'),
(1, '102', 'double', 2, 150.00, TRUE, '["WiFi", "TV", "Mini-bar"]'),
(1, '201', 'suite', 4, 250.00, TRUE, '["WiFi", "TV", "Mini-bar", "Ocean View"]'),
(2, '101', 'single', 1, 80.00, TRUE, '["WiFi", "Beach Access"]'),
(2, '201', 'double', 2, 120.00, TRUE, '["WiFi", "Pool", "Beach Access"]'),
(3, '101', 'single', 1, 90.00, FALSE, '["WiFi", "Fireplace"]'),
(4, '101', 'single', 1, 70.00, TRUE, '["WiFi", "Parking"]'),
(5, '101', 'double', 2, 140.00, TRUE, '["WiFi", "Ocean View", "Balcony"]');

-- Insert guests
INSERT INTO guests (name, email, phone, address, city, country, postal_code) VALUES
('John Doe', 'john@example.com', '+1234567890', '123 Main St', 'New York', 'USA', '10001'),
('Jane Smith', 'jane@example.com', '+1987654321', '456 Oak Ave', 'Los Angeles', 'USA', '90001'),
('Bob Johnson', 'bob@example.com', '+1555555555', '789 Pine Rd', 'Chicago', 'USA', '60601');

-- Insert sample booking
INSERT INTO bookings (booking_id, hotel_id, room_number, guest_id, check_in, check_out, guests, total_price, status) VALUES
('BK-000001', 1, '101', 1, '2024-07-01', '2024-07-03', 1, 200.00, 'pending');
```

**🎯 Practice:** Insert sample data for:
- Multiple room types per hotel
- Various guest profiles
- Different booking statuses
- Hotel reviews

---

## 🎯 Activity 5: Database Views and Stored Procedures (30 minutes)

### Creating Database Views

**🏨 Hotel Booking Views:**

```sql
-- View for available hotels with room count
CREATE VIEW available_hotels_view AS
SELECT 
    h.id,
    h.name,
    h.location,
    h.rating,
    h.price,
    COUNT(r.id) as available_rooms,
    MIN(r.price_per_night) as min_room_price,
    MAX(r.price_per_night) as max_room_price
FROM hotels h
LEFT JOIN rooms r ON h.id = r.hotel_id AND r.available = TRUE
WHERE h.available = TRUE
GROUP BY h.id;

-- View for booking statistics
CREATE VIEW booking_stats_view AS
SELECT 
    h.name as hotel_name,
    COUNT(b.id) as total_bookings,
    SUM(b.total_price) as total_revenue,
    AVG(b.total_price) as avg_booking_value,
    COUNT(CASE WHEN b.status = 'confirmed' THEN 1 END) as confirmed_bookings
FROM hotels h
LEFT JOIN bookings b ON h.id = b.hotel_id
GROUP BY h.id;

-- View for guest booking history
CREATE VIEW guest_booking_history_view AS
SELECT 
    g.name as guest_name,
    g.email,
    h.name as hotel_name,
    b.booking_id,
    b.check_in,
    b.check_out,
    b.total_price,
    b.status
FROM guests g
JOIN bookings b ON g.id = b.guest_id
JOIN hotels h ON b.hotel_id = h.id
ORDER BY b.created_at DESC;
```

**🎯 Practice:** Create views for:
- Room availability by date
- Hotel performance metrics
- Guest loyalty statistics
- Revenue by location

---

## 🎯 Activity 6: Database Backup and Maintenance (30 minutes)

### Database Maintenance

**🏨 Backup and Restore:**

```bash
# Backup database
mysqldump -u root -p hotel_booking > hotel_booking_backup.sql

# Restore database
mysql -u root -p hotel_booking < hotel_booking_backup.sql

# Backup specific tables
mysqldump -u root -p hotel_booking hotels rooms > hotel_tables_backup.sql
```

**Database Maintenance:**
```sql
-- Optimize tables
OPTIMIZE TABLE hotels;
OPTIMIZE TABLE rooms;
OPTIMIZE TABLE bookings;

-- Analyze tables
ANALYZE TABLE hotels;
ANALYZE TABLE rooms;

-- Check table status
SHOW TABLE STATUS;
```

---

## 🎯 Main Class Activity: Complete Database Setup (60 minutes)

**Task:** Set up complete MySQL database for hotel booking

**Requirements:**
- MySQL installation and configuration
- Complete database schema
- All tables with proper constraints
- Sample data insertion
- Database views
- Backup procedures

**Steps:**
1. Install and configure MySQL
2. Create hotel booking database
3. Design and create all tables
4. Add constraints and indexes
5. Insert sample data
6. Create useful views
7. Set up backup procedures
8. Test database operations

---

## 🎯 Homework: Complete Database Setup

### Task 1: Enhanced Database Features
- Add triggers for audit logging
- Create stored procedures
- Implement user permissions
- Add database users with roles

### Task 2: Performance Optimization
- Add composite indexes
- Optimize slow queries
- Implement query caching
- Add database monitoring

### Task 3: Preparation for Next Session
**Read before next class:**
- SQLAlchemy Documentation: https://docs.sqlalchemy.org/
- ORM Basics: https://docs.sqlalchemy.org/en/14/orm/

---

## 🎯 Summary: MySQL Setup for Hotel Booking

**Key Takeaways:**
- **MySQL** provides reliable data storage
- **Schema design** ensures data integrity
- **Relationships** connect hotel entities
- **Indexes** improve query performance
- **Constraints** enforce business rules
- **Views** simplify complex queries

**Next Session:** We'll use SQLAlchemy ORM to interact with the MySQL database from Python.
