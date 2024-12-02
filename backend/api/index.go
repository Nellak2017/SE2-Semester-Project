package api

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/Nellak2017/SE2-Semester-Project/backend/api/messages"
	"github.com/Nellak2017/SE2-Semester-Project/backend/api/threads"
	"github.com/gorilla/mux"
)

type Endpoint struct {
	Route   string
	Handler func(w http.ResponseWriter, r *http.Request, db *sql.DB)
	Method  string
}

func GetEndpointData() []Endpoint {
	return []Endpoint{
		{Route: "/deleteThread", Handler: threads.DeleteThreadHandler, Method: "DELETE"},
		{Route: "/getIsThreadNameExist", Handler: threads.GetIsThreadNameExistHandler, Method: "GET"},
		{Route: "/getMessages", Handler: messages.GetMessagesHandler, Method: "GET"},
		// Add more routes as needed
	}
}

func RegisterEndpoints(r *mux.Router, endpointData []Endpoint, database *sql.DB) {
	for _, endpoint := range endpointData {
		r.HandleFunc(endpoint.Route, func(w http.ResponseWriter, r *http.Request) {
			endpoint.Handler(w, r, database)
		}).Methods(endpoint.Method)
	}
}

func StartServer(database *sql.DB) {
	r := mux.NewRouter()
	RegisterEndpoints(r, GetEndpointData(), database)

	log.Println("Starting server on http://localhost:8080...")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
