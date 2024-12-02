package threads

import (
	"database/sql"
	"log"
	"net/http"
	"strconv"

	db "github.com/Nellak2017/SE2-Semester-Project/backend/db/SQLc"
	"github.com/Nellak2017/SE2-Semester-Project/backend/scripts"
)

// DELETE endpoint for deleting a thread
// /deleteThread
func DeleteThreadHandler(w http.ResponseWriter, r *http.Request, database *sql.DB) {
	// Associate query with transaction preamble
	ctx := r.Context()
	tx, err := database.Begin()
	queries := db.New(database)
	qtx := queries.WithTx(tx)
	if err != nil {
		http.Error(w, "Failed to start transaction", http.StatusInternalServerError)
		log.Println("Error starting transaction:", err)
		return
	}
	defer func() {
		if err != nil {
			tx.Rollback() // Rollback in case of error
		}
	}()

	// Parse the thread ID from the URL (assumes it's part of the URL path, e.g., /deleteThread/{threadid})
	threadID, err := scripts.ParseNumberURLQuery(w, r, "threadid")
	if err != nil {
		return
	}

	// Perform the delete operation
	err = qtx.DeleteMessages(ctx, sql.NullInt32{Int32: int32(threadID), Valid: true})
	if err != nil {
		http.Error(w, "Failed to delete messages", http.StatusInternalServerError)
		log.Println("Error deleting messages:", err)
		return
	}

	err = qtx.DeleteThread(ctx, int32(threadID))
	if err != nil {
		http.Error(w, "Failed to delete thread", http.StatusInternalServerError)
		log.Println("Error deleting thread:", err)
		return
	}

	// Commit the transaction if both deletions are successful
	if err := tx.Commit(); err != nil {
		http.Error(w, "Failed to commit transaction", http.StatusInternalServerError)
		log.Println("Error committing transaction:", err)
		return
	}
	scripts.SetResponseHeader(w, "Thread deleted successfully", "DELETE - DeleteThread success")
}

// GET endpoint for seeing if thread with userid and name exists
func GetIsThreadNameExist(w http.ResponseWriter, r *http.Request, database *sql.DB) {
	// Preamble
	ctx := r.Context()
	queries := db.New(database)

	// Get query params
	userID, err := scripts.ParseNumberURLQuery(w, r, "userid")
	if err != nil {
		return
	}
	name, err := scripts.ParseStringURLQuery(w, r, "name")
	if err != nil {
		return
	}

	// Do GET request
	count, err := queries.GetIsThreadNameExist(ctx, db.GetIsThreadNameExistParams{Userid: int32(userID), Name: name})
	if err != nil {
		http.Error(w, "Failed to GET - GetIsThreadNameExist", http.StatusInternalServerError)
		log.Println(err)
		return
	}
	scripts.SetResponseHeader(w, strconv.FormatInt(count, 10), "GET - GetAllUsers")
}
