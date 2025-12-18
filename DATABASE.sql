-- ==========================================
-- 1. DATABASE STRUCTURE (SCHEMA)
-- ==========================================

-- Cleanup existing data
DROP TABLE IF EXISTS rsvps;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS user_role;

-- Create role enumeration
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Users Table
CREATE TABLE users (
id SERIAL PRIMARY KEY,
username VARCHAR(100) UNIQUE NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
password_hash VARCHAR(255) NOT NULL,
role user_role NOT NULL DEFAULT 'user',
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events Table
CREATE TABLE events (
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
description TEXT NOT NULL,
date TIMESTAMPTZ NOT NULL,
location_name VARCHAR(255) NOT NULL,
image_url VARCHAR(2048),
lat NUMERIC(10, 7),
lng NUMERIC(10, 7),
created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RSVPs Table (Join Table)
CREATE TABLE rsvps (
user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE, -- Event ID
rsvp_at TIMESTAMPTZ DEFAULT NOW(),
PRIMARY KEY(user_id, id)
);