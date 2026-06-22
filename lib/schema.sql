-- Vision Performance Inc. — Client Portal Schema

CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  plan VARCHAR(50) DEFAULT 'standard',
  industry VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portal_users (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(20) DEFAULT 'client',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  employee_id VARCHAR(50),
  department VARCHAR(100),
  job_title VARCHAR(100),
  eligible BOOLEAN DEFAULT true,
  enrolled_at DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  employee_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,
  employee_name VARCHAR(255),
  frame_name VARCHAR(255),
  lens_type VARCHAR(100),
  order_date DATE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','processing','in_review','complete')),
  compliance_type VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS compliance_docs (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  doc_type VARCHAR(50),
  file_url VARCHAR(500),
  issue_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session (
  sid VARCHAR NOT NULL COLLATE "default",
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL,
  CONSTRAINT session_pkey PRIMARY KEY (sid)
) WITH (OIDS=FALSE);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON session(expire);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES portal_users(id) ON DELETE CASCADE,
  token VARCHAR(64) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enquiries table — stores all inbound form submissions
CREATE TABLE IF NOT EXISTS enquiries (
  id SERIAL PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('contact','mobile','corporate','appointment')),
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new','in_progress','closed')),
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  subject VARCHAR(255),
  message TEXT,
  org VARCHAR(255),
  employees VARCHAR(50),
  preferred_date VARCHAR(100),
  preferred_time VARCHAR(50),
  address TEXT,
  location VARCHAR(255),
  exam_type VARCHAR(50),
  notes TEXT,
  staff_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add status constraint to existing orders table (safe to re-run)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_status_check') THEN
    ALTER TABLE orders ADD CONSTRAINT orders_status_check
      CHECK (status IN ('pending','processing','in_review','complete'));
  END IF;
END $$;

-- Add status constraint to existing tables (safe to run multiple times)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_status_check'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_status_check
      CHECK (status IN ('pending','processing','in_review','complete'));
  END IF;
END $$;
