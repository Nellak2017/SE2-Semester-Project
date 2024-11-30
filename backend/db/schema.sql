-- Create Users Table
CREATE TABLE IF NOT EXISTS Users (
  UserID SERIAL PRIMARY KEY,
  UserName VARCHAR(50) NOT NULL
);

-- Create Threads Table
CREATE TABLE IF NOT EXISTS Threads (
  ThreadID SERIAL PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Temperature INT DEFAULT 50 CHECK (Temperature >= 0 AND Temperature <= 100),
  TypingSpeed INT DEFAULT 50 CHECK (TypingSpeed >= 0 AND TypingSpeed <= 100),
  UserID INT NOT NULL,
  UNIQUE (Name, UserID),
  CONSTRAINT fk_threads_user FOREIGN KEY (UserID) REFERENCES Users (UserID)
);

-- Create Messages Table
CREATE TABLE IF NOT EXISTS Messages (
  MessageID SERIAL PRIMARY KEY,
  ThreadID INT REFERENCES Threads (ThreadID),
  Text TEXT,
  Timestamp TIMESTAMP DEFAULT NOW(),
  SentByUser BOOLEAN DEFAULT NULL,
  UserID INT REFERENCES Users (UserID)
);