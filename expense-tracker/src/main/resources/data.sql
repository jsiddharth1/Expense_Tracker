-- Create a default user (password: 'password123' encoded with BCrypt)
INSERT IGNORE INTO users (id, username, email, password)
VALUES (1, 'admin', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');
