-- name: GetAllUsers :many
SELECT * FROM Users;

-- name: CreateUser :one
INSERT INTO Users (UserName)
VALUES ($1)
RETURNING UserID, UserName;

-- name: DeleteUser :exec
DELETE FROM Users
WHERE UserID = $1;