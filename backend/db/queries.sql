-- name: GetAllUsers :many
SELECT * FROM users;

-- name: CreateUser :one
INSERT INTO users (username)
VALUES ($1)
RETURNING userid, username;

-- name: DeleteUser :exec
DELETE FROM users
WHERE userid = $1;





-- /deleteThread
-- name: DeleteMessages :exec
DELETE FROM messages WHERE threadid = $1;

-- name: DeleteThread :exec
DELETE FROM threads WHERE threadid = $1;

-- /getIsThreadNameExist
-- name: GetIsThreadNameExist :one
SELECT COUNT(*) AS count
FROM threads
WHERE userid = $1 AND name = $2;

-- /getMessages
-- name: GetMessages :many
SELECT messages.* 
FROM messages 
JOIN users ON messages.userid = users.userid 
JOIN threads ON messages.threadid = threads.threadid 
WHERE users.userid = $1 
AND threads.threadid = $2
ORDER BY messages.messageid DESC
LIMIT 150;

-- /getTemperature
-- name: GetTemperature :one
SELECT temperature 
FROM threads
WHERE userid = $1 AND threadid = $2;

-- /getThreads
-- name: GetThreads :many
SELECT threads.*
FROM threads
WHERE threads.userid = $1
LIMIT 10;

-- /getTypingSpeed
-- name: GetTypingSpeed :one
SELECT typingspeed 
FROM threads
WHERE userid = $1 AND threadid = $2;

-- /patchTemperature
-- name: PatchTemperature :exec
UPDATE threads
SET temperature = $1
WHERE threadid = $2;

-- /patchTypingSpeed
-- name: PatchTypingSpeed :exec
UPDATE threads
SET typingspeed = $1
WHERE threadid = $2;

-- /postMessage
-- name: PostMessage :exec
WITH message_count AS (
  SELECT COUNT(*) AS messagecount
  FROM messages
  WHERE threadid = $1 AND userid = $2
)
INSERT INTO messages (threadid, userid, text, timestamp, sentbyuser) 
SELECT $1, $2, $3, CURRENT_TIMESTAMP, $4
WHERE (SELECT messagecount FROM message_count) < 100;

-- /postMessageAndResponse
-- name: PostMessageAndResponse :exec
WITH message_count AS (
  SELECT COUNT(*) AS messagecount
  FROM messages
  WHERE threadid = $1 AND userid = $2
)
INSERT INTO messages (text, userid, threadid, sentbyuser)
SELECT $1, $2, $3, $4
WHERE (SELECT messagecount FROM message_count) < 100;

INSERT INTO messages (text, userid, threadid, sentbyuser)
SELECT $5, $6, $7, $8
WHERE (SELECT messagecount FROM message_count) < 100;

-- /postThread
-- name: PostThread :exec
WITH thread_count AS (
  SELECT COUNT(*) AS threadcount
  FROM threads
  WHERE userid = $1
)
INSERT INTO threads (name, userid)
SELECT $2, $1
WHERE (SELECT threadcount FROM thread_count) < 10;