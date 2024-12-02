package messages

import (
	"database/sql"
	"log"
	"net/http"
	"strings"

	db "github.com/Nellak2017/SE2-Semester-Project/backend/db/SQLc"
	"github.com/Nellak2017/SE2-Semester-Project/backend/scripts"
)

// GET endpoint for getting all messages for a given user and threadid
func GetMessagesHandler(w http.ResponseWriter, r *http.Request, database *sql.DB) {
	ctx, queries := scripts.EndpointPreamble(r, database)

	// Get query params
	userID, err := scripts.ParseNumberURLQuery(w, r, "userid")
	if err != nil {
		return
	}
	threadID, err := scripts.ParseNumberURLQuery(w, r, "threadid")
	if err != nil {
		return
	}

	// do GET request
	items, err := queries.GetMessages(ctx, db.GetMessagesParams{Userid: int32(userID), Threadid: int32(threadID)})
	if err != nil {
		http.Error(w, "Failed to GET - GetMessagesHandler", http.StatusInternalServerError)
		log.Println(err)
		return
	}
	scripts.SetResponseHeader(w, strings.Join(scripts.ConvertMessagesToStrings(items), " "), "GET - GetMessages")
}
