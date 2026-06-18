-- =============================================
-- StudyTracker Database Schema
-- Universitas Bakrie - IT Project Management
-- =============================================

CREATE DATABASE IF NOT EXISTS studytracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE studytracker;

-- =============================================
-- TABLE: users
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE: tasks
-- =============================================
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    judul VARCHAR(200) NOT NULL,
    mata_kuliah VARCHAR(100) NOT NULL,
    prioritas ENUM('low', 'medium', 'high') DEFAULT 'medium',
    deadline DATETIME NOT NULL,
    deskripsi TEXT,
    status ENUM('pending', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_status (user_id, status),
    INDEX idx_deadline (deadline)
);

-- =============================================
-- TABLE: daily_plans
-- =============================================
CREATE TABLE IF NOT EXISTS daily_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    aktivitas VARCHAR(255) NOT NULL,
    is_done TINYINT(1) DEFAULT 0,
    tanggal DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, tanggal)
);

-- =============================================
-- TABLE: focus_sessions
-- =============================================
CREATE TABLE IF NOT EXISTS focus_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    task_id INT,
    tipe ENUM('pomodoro', 'short_break', 'long_break') DEFAULT 'pomodoro',
    durasi_menit INT NOT NULL,
    selesai TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL,
    INDEX idx_user_created (user_id, created_at)
);

-- =============================================
-- SEED DATA: Users
-- Password plaintext: 123456789
-- Hash: bcrypt(123456789, rounds=10) - verified
-- =============================================
INSERT INTO users (nama_lengkap, email, password_hash) VALUES
('Satrio', 'Satrio@student.bakrie.ac.id', '$2b$10$i0VLyGEt4.5EwbisSS1.1.6Sm8y5F0DxPlvmvhZWnxyEQNMTiZ8b2'),
('Otto', 'Otto@student.bakrie.ac.id', '$2b$10$i0VLyGEt4.5EwbisSS1.1.6Sm8y5F0DxPlvmvhZWnxyEQNMTiZ8b2'),
('Adrian', 'Adrian@student.bakrie.ac.id', '$2b$10$i0VLyGEt4.5EwbisSS1.1.6Sm8y5F0DxPlvmvhZWnxyEQNMTiZ8b2'),
('Yurfa', 'Yurfa@student.bakrie.ac.id', '$2b$10$i0VLyGEt4.5EwbisSS1.1.6Sm8y5F0DxPlvmvhZWnxyEQNMTiZ8b2'),
('Rio', 'Rio@student.bakrie.ac.id', '$2b$10$i0VLyGEt4.5EwbisSS1.1.6Sm8y5F0DxPlvmvhZWnxyEQNMTiZ8b2');
