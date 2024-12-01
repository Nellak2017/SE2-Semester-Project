-- Create users Table
CREATE TABLE IF NOT EXISTS users (
  userid SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL
);

-- Create Threads Table
CREATE TABLE IF NOT EXISTS threads (
  threadid SERIAL PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  temperature INT DEFAULT 50 CHECK (temperature >= 0 AND temperature <= 100),
  typingSpeed INT DEFAULT 50 CHECK (typingSpeed >= 0 AND typingSpeed <= 100),
  userid INT NOT NULL,
  UNIQUE (Name, userid),
  CONSTRAINT fk_threads_user FOREIGN KEY (userid) REFERENCES users (userid)
);

-- Create Messages Table
CREATE TABLE IF NOT EXISTS messages (
  messageid SERIAL PRIMARY KEY,
  threadid INT REFERENCES threads (threadid),
  Text TEXT,
  Timestamp TIMESTAMP DEFAULT NOW(),
  sentbyuser BOOLEAN DEFAULT NULL,
  userid INT REFERENCES users (userid)
);