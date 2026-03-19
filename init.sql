-- Database Creation Script for comic_db
-- Configure connection details in your .env.local file (see .env.example)

CREATE TABLE IF NOT EXISTS manga (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    description TEXT,
    cover_image VARCHAR(255),
    banner_image VARCHAR(255),
    genres TEXT[], -- Array of strings
    status VARCHAR(50) DEFAULT 'Ongoing',
    rating DECIMAL(3, 2) DEFAULT 0.0,
    trending BOOLEAN DEFAULT FALSE,
    fresh BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chapters (
    id VARCHAR(255) PRIMARY KEY,
    manga_id VARCHAR(255) REFERENCES manga(id) ON DELETE CASCADE,
    number INTEGER NOT NULL,
    title VARCHAR(255),
    release_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pages (
    id SERIAL PRIMARY KEY,
    chapter_id VARCHAR(255) REFERENCES chapters(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Initial Data (Optional, for testing)
INSERT INTO manga (id, title, author, description, cover_image, banner_image, genres, status, rating, trending, fresh)
VALUES 
('neon-valkyrie', 'NEON VALKYRIE', 'K. SATO', 'In the year 2088, the last of the Valkyries must navigate a neon-drenched cyberpunk landscape...', '/images/valk1.jpg', '/images/valk-banner.jpg', ARRAY['Action', 'Sci-Fi', 'Cyberpunk'], 'Ongoing', 4.9, TRUE, FALSE),
('shadow-blade', 'SHADOW BLADE', 'M. TANAKA', 'A master assassin seeks redemption in a world where shadows come alive.', '/images/shadow1.jpg', '/images/shadow-banner.jpg', ARRAY['Action', 'Fantasy', 'Ninja'], 'Ongoing', 4.7, FALSE, TRUE),
('starlight-odyssey', 'STARLIGHT ODYSSEY', 'L. CHEN', 'Join Captain Ray on an epic journey across the galaxy to find the lost star.', '/images/star1.jpg', '/images/star-banner.jpg', ARRAY['Sci-Fi', 'Adventure', 'Space'], 'Completed', 4.8, TRUE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Sample Chapters
INSERT INTO chapters (id, manga_id, number, title)
VALUES 
('nv-ch1', 'neon-valkyrie', 1, 'The Awakening'),
('nv-ch2', 'neon-valkyrie', 2, 'Neon Rain'),
('sb-ch1', 'shadow-blade', 1, 'First Blood')
ON CONFLICT (id) DO NOTHING;

-- Sample Pages (Paths relative to IMAGE_DIR)
INSERT INTO pages (chapter_id, page_number, image_path)
VALUES 
('nv-ch1', 1, 'neon-valkyrie/ch1/001.jpg'),
('nv-ch1', 2, 'neon-valkyrie/ch1/002.jpg'),
('nv-ch2', 1, 'neon-valkyrie/ch2/001.jpg')
ON CONFLICT DO NOTHING;
