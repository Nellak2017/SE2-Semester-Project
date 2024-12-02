// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: queries.sql

package db

import (
	"context"
	"database/sql"
)

const createUser = `-- name: CreateUser :one
INSERT INTO users (username)
VALUES ($1)
RETURNING userid, username
`

func (q *Queries) CreateUser(ctx context.Context, username string) (User, error) {
	row := q.db.QueryRowContext(ctx, createUser, username)
	var i User
	err := row.Scan(&i.Userid, &i.Username)
	return i, err
}

const deleteMessages = `-- name: DeleteMessages :exec
DELETE FROM messages WHERE threadid = $1
`

// /deleteThread
func (q *Queries) DeleteMessages(ctx context.Context, threadid sql.NullInt32) error {
	_, err := q.db.ExecContext(ctx, deleteMessages, threadid)
	return err
}

const deleteThread = `-- name: DeleteThread :exec
DELETE FROM threads WHERE threadid = $1
`

func (q *Queries) DeleteThread(ctx context.Context, threadid int32) error {
	_, err := q.db.ExecContext(ctx, deleteThread, threadid)
	return err
}

const deleteUser = `-- name: DeleteUser :exec
DELETE FROM users
WHERE userid = $1
`

func (q *Queries) DeleteUser(ctx context.Context, userid int32) error {
	_, err := q.db.ExecContext(ctx, deleteUser, userid)
	return err
}

const getAllUsers = `-- name: GetAllUsers :many
SELECT userid, username FROM users
`

func (q *Queries) GetAllUsers(ctx context.Context) ([]User, error) {
	rows, err := q.db.QueryContext(ctx, getAllUsers)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []User
	for rows.Next() {
		var i User
		if err := rows.Scan(&i.Userid, &i.Username); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getIsThreadNameExist = `-- name: GetIsThreadNameExist :one
SELECT COUNT(*) AS count
FROM threads
WHERE userid = $1 AND name = $2
`

type GetIsThreadNameExistParams struct {
	Userid int32
	Name   string
}

// /getIsThreadNameExist
func (q *Queries) GetIsThreadNameExist(ctx context.Context, arg GetIsThreadNameExistParams) (int64, error) {
	row := q.db.QueryRowContext(ctx, getIsThreadNameExist, arg.Userid, arg.Name)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const getMessages = `-- name: GetMessages :many
SELECT messages.messageid, messages.threadid, messages.text, messages.timestamp, messages.sentbyuser, messages.userid 
FROM messages 
JOIN users ON messages.userid = users.userid 
JOIN threads ON messages.threadid = threads.threadid 
WHERE users.userid = $1 
AND threads.threadid = $2
ORDER BY messages.messageid DESC
LIMIT 150
`

type GetMessagesParams struct {
	Userid   int32
	Threadid int32
}

// /getMessages
func (q *Queries) GetMessages(ctx context.Context, arg GetMessagesParams) ([]Message, error) {
	rows, err := q.db.QueryContext(ctx, getMessages, arg.Userid, arg.Threadid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Message
	for rows.Next() {
		var i Message
		if err := rows.Scan(
			&i.Messageid,
			&i.Threadid,
			&i.Text,
			&i.Timestamp,
			&i.Sentbyuser,
			&i.Userid,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getTemperature = `-- name: GetTemperature :one
SELECT temperature 
FROM threads
WHERE userid = $1 AND threadid = $2
`

type GetTemperatureParams struct {
	Userid   int32
	Threadid int32
}

// /getTemperature
func (q *Queries) GetTemperature(ctx context.Context, arg GetTemperatureParams) (sql.NullInt32, error) {
	row := q.db.QueryRowContext(ctx, getTemperature, arg.Userid, arg.Threadid)
	var temperature sql.NullInt32
	err := row.Scan(&temperature)
	return temperature, err
}

const getThreads = `-- name: GetThreads :many
SELECT threads.threadid, threads.name, threads.temperature, threads.typingspeed, threads.userid
FROM threads
WHERE threads.userid = $1
LIMIT 10
`

// /getThreads
func (q *Queries) GetThreads(ctx context.Context, userid int32) ([]Thread, error) {
	rows, err := q.db.QueryContext(ctx, getThreads, userid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Thread
	for rows.Next() {
		var i Thread
		if err := rows.Scan(
			&i.Threadid,
			&i.Name,
			&i.Temperature,
			&i.Typingspeed,
			&i.Userid,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getTypingSpeed = `-- name: GetTypingSpeed :one
SELECT typingspeed 
FROM threads
WHERE userid = $1 AND threadid = $2
`

type GetTypingSpeedParams struct {
	Userid   int32
	Threadid int32
}

// /getTypingSpeed
func (q *Queries) GetTypingSpeed(ctx context.Context, arg GetTypingSpeedParams) (sql.NullInt32, error) {
	row := q.db.QueryRowContext(ctx, getTypingSpeed, arg.Userid, arg.Threadid)
	var typingspeed sql.NullInt32
	err := row.Scan(&typingspeed)
	return typingspeed, err
}

const patchTemperature = `-- name: PatchTemperature :exec
UPDATE threads
SET temperature = $1
WHERE threadid = $2
`

type PatchTemperatureParams struct {
	Temperature sql.NullInt32
	Threadid    int32
}

// /patchTemperature
func (q *Queries) PatchTemperature(ctx context.Context, arg PatchTemperatureParams) error {
	_, err := q.db.ExecContext(ctx, patchTemperature, arg.Temperature, arg.Threadid)
	return err
}

const patchTypingSpeed = `-- name: PatchTypingSpeed :exec
UPDATE threads
SET typingspeed = $1
WHERE threadid = $2
`

type PatchTypingSpeedParams struct {
	Typingspeed sql.NullInt32
	Threadid    int32
}

// /patchTypingSpeed
func (q *Queries) PatchTypingSpeed(ctx context.Context, arg PatchTypingSpeedParams) error {
	_, err := q.db.ExecContext(ctx, patchTypingSpeed, arg.Typingspeed, arg.Threadid)
	return err
}

const postMessage = `-- name: PostMessage :exec
WITH message_count AS (
  SELECT COUNT(*) AS messagecount
  FROM messages
  WHERE threadid = $1 AND userid = $2
)
INSERT INTO messages (threadid, userid, text, timestamp, sentbyuser) 
SELECT $1, $2, $3, CURRENT_TIMESTAMP, $4
WHERE (SELECT messagecount FROM message_count) < 100
`

type PostMessageParams struct {
	Threadid   sql.NullInt32
	Userid     sql.NullInt32
	Text       sql.NullString
	Sentbyuser sql.NullBool
}

// /postMessage
func (q *Queries) PostMessage(ctx context.Context, arg PostMessageParams) error {
	_, err := q.db.ExecContext(ctx, postMessage,
		arg.Threadid,
		arg.Userid,
		arg.Text,
		arg.Sentbyuser,
	)
	return err
}

const postMessageAndResponse = `-- name: PostMessageAndResponse :exec
WITH message_count AS (
  SELECT COUNT(*) AS messagecount
  FROM messages
  WHERE threadid = $1 AND userid = $2
)
INSERT INTO messages (text, userid, threadid, sentbyuser)
SELECT $1, $2, $3, $4
WHERE (SELECT messagecount FROM message_count) < 100
`

type PostMessageAndResponseParams struct {
	Text       sql.NullString
	Userid     sql.NullInt32
	Threadid   sql.NullInt32
	Sentbyuser sql.NullBool
}

// /postMessageAndResponse
func (q *Queries) PostMessageAndResponse(ctx context.Context, arg PostMessageAndResponseParams) error {
	_, err := q.db.ExecContext(ctx, postMessageAndResponse,
		arg.Text,
		arg.Userid,
		arg.Threadid,
		arg.Sentbyuser,
	)
	return err
}

const postThread = `-- name: PostThread :exec
WITH thread_count AS (
  SELECT COUNT(*) AS threadcount
  FROM threads
  WHERE userid = $1
)
INSERT INTO threads (name, userid)
SELECT $2, $1
WHERE (SELECT threadcount FROM thread_count) < 10
`

type PostThreadParams struct {
	Userid int32
	Name   string
}

// /postThread
func (q *Queries) PostThread(ctx context.Context, arg PostThreadParams) error {
	_, err := q.db.ExecContext(ctx, postThread, arg.Userid, arg.Name)
	return err
}
