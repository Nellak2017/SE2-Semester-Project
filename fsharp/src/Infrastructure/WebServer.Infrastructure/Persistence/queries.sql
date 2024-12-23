-- name: GetAllUsers :many
SELECT * FROM users;

-- name: CreateUser :one
INSERT INTO users (username)
VALUES ($1)
RETURNING userid, username;

-- name: DeleteUser :exec
DELETE FROM users
WHERE userid = $1;