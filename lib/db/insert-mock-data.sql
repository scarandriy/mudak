-- Insert Mock Data
-- Run this after schema initialization to populate the database
-- UUIDs will be generated automatically by the database

-- Users (with password hash for 'password123')
-- Password hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- All users have password: password123

-- User 1: Eleanor Antin (Artist)
INSERT INTO users (email, name, role, password_hash, bio, contact) VALUES
('artist@example.com', 'Eleanor Antin', 'artist', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Pioneer representative of conceptual, feminist art.', 'contact@eleanorantin.com')
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- User 2: Bettina Steinbrügge (Organizer)
INSERT INTO users (email, name, role, password_hash) VALUES
('organizer@example.com', 'Bettina Steinbrügge', 'organizer', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy')
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- User 3: John Visitor (Visitor)
INSERT INTO users (email, name, role, password_hash) VALUES
('visitor@example.com', 'John Visitor', 'visitor', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy')
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- User 4: Admin User (Admin)
INSERT INTO users (email, name, role, password_hash) VALUES
('admin@example.com', 'Admin User', 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy')
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Artist Social Links (for artist@example.com)
INSERT INTO artist_social_links (user_id, website, instagram, twitter)
SELECT id, 'https://eleanorantin.com', NULL, NULL
FROM users WHERE email = 'artist@example.com'
ON CONFLICT (user_id) DO NOTHING;

-- Artworks (by artist@example.com)
INSERT INTO artworks (title, description, type, image_url, artist_id, created_at, updated_at)
SELECT 
  '100 Boots',
  'A road movie without people - an iconic photographic series exploring narrative and movement.',
  'Photography',
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
  id,
  '2024-01-15T10:00:00Z'::timestamptz,
  '2024-01-15T10:00:00Z'::timestamptz
FROM users WHERE email = 'artist@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO artworks (title, description, type, image_url, artist_id, created_at, updated_at)
SELECT 
  'Carving: A Traditional Sculpture',
  'An early feminist examination of the female body through taxonomy systems.',
  'Photography',
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
  id,
  '2024-01-20T10:00:00Z'::timestamptz,
  '2024-01-20T10:00:00Z'::timestamptz
FROM users WHERE email = 'artist@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO artworks (title, description, type, image_url, artist_id, created_at, updated_at)
SELECT 
  'The Ballerina',
  'A series exploring identity through fictional alter egos.',
  'Photography',
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
  id,
  '2024-02-01T10:00:00Z'::timestamptz,
  '2024-02-01T10:00:00Z'::timestamptz
FROM users WHERE email = 'artist@example.com'
ON CONFLICT DO NOTHING;

-- Exhibitions (organized by organizer@example.com)
INSERT INTO exhibitions (title, description, start_date, end_date, location, is_visible, organizer_id, capacity, created_at, updated_at)
SELECT 
  'Eleanor Antin: A Retrospective',
  'This first major retrospective since 1999 presents Antin''s œuvre in full breadth. The exhibition highlights the continued relevance and influence of her work from the late 1960s till today.',
  '2025-09-26'::date,
  '2026-02-08'::date,
  'Mudam Luxembourg',
  true,
  id,
  100,
  '2024-01-01T10:00:00Z'::timestamptz,
  '2024-01-01T10:00:00Z'::timestamptz
FROM users WHERE email = 'organizer@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO exhibitions (title, description, start_date, end_date, location, is_visible, organizer_id, capacity, created_at, updated_at)
SELECT 
  'Contemporary Perspectives',
  'Exploring modern artistic expressions and cultural narratives.',
  '2025-03-01'::date,
  '2025-05-31'::date,
  'Gallery Space A',
  true,
  id,
  50,
  '2024-01-10T10:00:00Z'::timestamptz,
  '2024-01-10T10:00:00Z'::timestamptz
FROM users WHERE email = 'organizer@example.com'
ON CONFLICT DO NOTHING;

-- Exhibitions-Artworks Junction Table
-- Link all artworks to "Eleanor Antin: A Retrospective" exhibition
INSERT INTO exhibitions_artworks (exhibition_id, artwork_id)
SELECT 
  e.id,
  a.id
FROM exhibitions e
CROSS JOIN artworks a
WHERE e.title = 'Eleanor Antin: A Retrospective'
  AND a.title IN ('100 Boots', 'Carving: A Traditional Sculpture', 'The Ballerina')
ON CONFLICT (exhibition_id, artwork_id) DO NOTHING;

-- Registrations
-- Register visitor@example.com for "Eleanor Antin: A Retrospective"
INSERT INTO registrations (exhibition_id, user_id, status, registered_at)
SELECT 
  e.id,
  u.id,
  'confirmed',
  '2024-01-15T10:00:00Z'::timestamptz
FROM exhibitions e
CROSS JOIN users u
WHERE e.title = 'Eleanor Antin: A Retrospective'
  AND u.email = 'visitor@example.com'
ON CONFLICT (exhibition_id, user_id) DO NOTHING;

-- Sponsors
INSERT INTO sponsors (name, logo_url, exhibition_id)
SELECT 
  'Dikamar',
  NULL,
  id
FROM exhibitions WHERE title = 'Eleanor Antin: A Retrospective'
ON CONFLICT DO NOTHING;

INSERT INTO sponsors (name, logo_url, exhibition_id)
SELECT 
  'Le Monde',
  NULL,
  id
FROM exhibitions WHERE title = 'Eleanor Antin: A Retrospective'
ON CONFLICT DO NOTHING;

-- Submissions
-- Submit "100 Boots" artwork to "Contemporary Perspectives" exhibition
INSERT INTO submissions (artwork_id, exhibition_id, status, feedback, submitted_at)
SELECT 
  a.id,
  e.id,
  'pending',
  NULL,
  '2024-01-20T10:00:00Z'::timestamptz
FROM artworks a
CROSS JOIN exhibitions e
WHERE a.title = '100 Boots'
  AND e.title = 'Contemporary Perspectives'
ON CONFLICT DO NOTHING;
