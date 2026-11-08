/* Migration to add guest support and nullable email/password, plus additional profile columns */
ALTER TABLE users
    ADD COLUMN is_guest BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    MODIFY COLUMN email VARCHAR(255) NULL,
    MODIFY COLUMN password VARCHAR(255) NULL,
    ADD COLUMN full_name VARCHAR(255),
    ADD COLUMN phone VARCHAR(50),
    ADD COLUMN currency VARCHAR(10),
    ADD COLUMN monthly_budget DECIMAL(10,2),
    ADD COLUMN prompt_dismissals JSON;

-- Ensure unique email allows multiple NULLs (MySQL treats multiple NULLs as distinct)
ALTER TABLE users
    ADD UNIQUE KEY uk_user_email (email);
