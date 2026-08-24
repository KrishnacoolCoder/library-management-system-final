CREATE DATABASE IF NOT EXISTS library_manager;
USE library_manager;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('STUDENT','LIBRARIAN','ADMIN') NOT NULL DEFAULT 'STUDENT',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_role (role),
    INDEX idx_users_active (is_active)
);

CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    total_copies INT NOT NULL DEFAULT 1,
    available_copies INT NOT NULL DEFAULT 1,
    published_year INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (total_copies >= 0),
    CHECK (available_copies >= 0),
    CHECK (available_copies <= total_copies),
    INDEX idx_books_title (title),
    INDEX idx_books_author (author),
    INDEX idx_books_category (category)
);

CREATE TABLE IF NOT EXISTS loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    borrowed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_at DATETIME NOT NULL,
    returned_at DATETIME NULL,
    fine DECIMAL(10,2) NOT NULL DEFAULT 0,
    status ENUM('BORROWED','RETURNED') NOT NULL DEFAULT 'BORROWED',
    CONSTRAINT fk_loans_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_loans_book FOREIGN KEY (book_id) REFERENCES books(id),
    INDEX idx_loans_user_status (user_id, status),
    INDEX idx_loans_book_status (book_id, status),
    INDEX idx_loans_due (due_at)
);

CREATE TABLE IF NOT EXISTS otp_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    code_hash VARCHAR(255) NOT NULL,
    purpose ENUM('VERIFY_EMAIL','LOGIN') NOT NULL,
    expires_at DATETIME NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_otp_email (email),
    INDEX idx_otp_expiry (expires_at)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NULL,
    metadata JSON NULL,
    ip_address VARCHAR(64) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_entity (entity, entity_id),
    INDEX idx_audit_created (created_at)
);
