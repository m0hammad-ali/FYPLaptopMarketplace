-- Ensure timestamps exist on users table
-- This runs BEFORE services sync their schemas

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all other expected tables will be created by services
-- This is a safety net; the actual schema is created by Sequelize

SELECT 'Database initialized' AS status;
