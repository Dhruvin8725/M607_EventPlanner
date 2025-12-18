-- Drop tables if they already exist, in reverse order
DROP TABLE IF EXISTS rsvps;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

-- Drop custom types if they exist
DROP TYPE IF EXISTS user_role;

-- Create a custom type for user roles
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- 1. Users Table
-- All column names (e.g., "id") now match the application code.
CREATE TABLE users (
    id SERIAL PRIMARY KEY, -- Changed from 'user_id'
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Events Table
-- All column names (e.g., "id", "title") now match the application code.
CREATE TABLE events (
    id SERIAL PRIMARY KEY, -- Changed from 'event_id'
    title VARCHAR(255) NOT NULL, -- Changed from 'name'
    description TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    location_name VARCHAR(255) NOT NULL, -- Changed from 'location'
    image_url VARCHAR(2048),
    lat NUMERIC(10, 7), -- Changed from 'latitude'
    lng NUMERIC(10, 7), -- Changed from 'longitude'
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL, -- References new 'id'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RSVPs Table
-- This table links users and events.
CREATE TABLE rsvps (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- References new 'id'
    id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE, -- Changed from 'event_id' to 'id'
    rsvp_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Primary key to prevent duplicate RSVPs
    PRIMARY KEY(user_id, id)
);

---
--- SEED DATA (SAMPLE DATA)
---

-- Insert a standard user (will have id = 1)
-- Password: user123
INSERT INTO users (username, email, password_hash, role)
VALUES (
    'standarduser',
    'user@example.com',
    '$2b$10$wS.112gBf9jA2i9s4.iJg.Wb8DF..s/8n.5jefs.t.0f.c/5L1L/W',
    'user'
);

-- Insert an admin user (will have id = 2)
-- Password: admin123
INSERT INTO users (username, email, password_hash, role)
VALUES (
    'adminuser',
    'admin@example.com',
    '$2b$10$T8Z.CM.yqBY.eN/0eSgSj.N/Gv/S7E.5I5/U5.sP.wS/F.O.uU.m',
    'admin'
);

-- Insert sample events (created_by '2' is the admin's id)
-- All column names in the INSERT query are now correct.
INSERT INTO events (title, description, date, location_name, image_url, created_by, lat, lng)
VALUES (
    'Annual Tech Conference',
    'Join us for the biggest tech conference of the year. Networking, talks, and more from industry leaders.',
    '2025-10-30 09:00:00-04',
    '123 Tech Way, New York, NY',
    'https://placehold.co/600x400/007bff/white?text=Tech+Conference',
    2,
    40.7128000,
    -74.0060000
);

INSERT INTO events (title, description, date, location_name, image_url, created_by, lat, lng)
VALUES (
    'Downtown Music Festival',
    'Live music from 20+ artists. Food trucks and fun for all ages. Bring a blanket and enjoy the show!',
    '2025-11-15 14:00:00-05',
    '456 Park Ave, Chicago, IL',
    'https://placehold.co/600x400/6c757d/white?text=Music+Festival',
    2,
    41.8781000,
    -87.6298000
);

INSERT INTO events (title, description, date, location_name, image_url, created_by, lat, lng)
VALUES (
    'Community Art Workshop',
    'A free workshop for all ages. Learn watercolor basics from a local artist. All materials provided.',
    '2025-11-20 18:00:00-05',
    '789 Main St, Austin, TX',
    'https://placehold.co/600x400/28a745/white?text=Art+Workshop',
    2,
    30.2672000,
    -97.7431000
);

-- RSVP the standard user (id = 1) to the tech conference (id = 1)
-- Column names are now correct.
INSERT INTO rsvps (user_id, id)
VALUES (1, 1);