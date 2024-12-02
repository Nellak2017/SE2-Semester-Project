package scripts

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"strconv"

	db "github.com/Nellak2017/SE2-Semester-Project/backend/db/SQLc"
	"github.com/joho/godotenv"
)

// loadEnvFile loads the environment variables from the specified .env file.
func LoadEnvFile(envPath string) { // does a side effect and doesn't return
	err := godotenv.Load(envPath) // relative path approach
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

// GetEnvVariable fetches the database URL from environment variables.
func GetEnvVariable(envName string) string { // does side effect and returns
	connStr := os.Getenv(envName) // os.Getenv always returns a string
	if connStr == "" {
		log.Fatal(envName + " is not set in the environment")
	}
	return connStr
}

// ConnectToDatabase establishes a connection to the database and returns a *sql.DB.
func ConnectToDatabase(driverName string, connStr string) *sql.DB { // does side effect and returns
	database, err := sql.Open(driverName, connStr)
	if err != nil {
		log.Fatal(err)
	}
	return database
}

// Loads env and Connects to a specified DB from a DB ENV variable
func LoadDB(env_path string, DB_URL string) (*sql.DB, string) { // does side effects and returns a string
	LoadEnvFile(env_path)
	connStr := GetEnvVariable(DB_URL)
	db := ConnectToDatabase("postgres", connStr)
	return db, connStr
}

// A shortcut for the os.ReadFile thing
func GetFileData(path string) []byte {
	data, err := os.ReadFile(path)
	if err != nil {
		log.Fatal(err)
	}
	return data
}

// A shortcut for the db.exec thing without returning anything
func ExecuteSQL(db *sql.DB, sql []byte, args ...interface{}) {
	_, err := db.Exec(string(sql), args...)
	if err != nil {
		log.Fatal(err)
	}
}

// will do the whole process of making test db from scratch
func CreateAndSeedTestDB() {
	DropTestDB()
	CreateTestDB()
	TestSeed()
}

// --- Helpers for api stuff
func SetResponseHeader(w http.ResponseWriter, content string, success_text string) error {
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(content); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		log.Println("Error encoding response:", err)
		return err
	}
	log.Println(success_text)
	return nil
}

func ParseNumberURLQuery(w http.ResponseWriter, r *http.Request, URL_Query string) (int, error) {
	numStr := r.URL.Query().Get(URL_Query)
	if numStr == "" {
		http.Error(w, URL_Query+" is required", http.StatusBadRequest)
		return 0, errors.New(URL_Query + " is required")
	}
	num, err := strconv.Atoi(numStr)
	if err != nil {
		http.Error(w, "Invalid "+URL_Query, http.StatusBadRequest)
		return 0, errors.New("Invalid " + URL_Query)
	}
	return num, nil
}

func ParseStringURLQuery(w http.ResponseWriter, r *http.Request, URL_Query string) (string, error) {
	numStr := r.URL.Query().Get(URL_Query)
	if numStr == "" {
		http.Error(w, URL_Query+" is required", http.StatusBadRequest)
		return "", errors.New(URL_Query + " is required")
	}
	return numStr, nil
}

func EndpointPreamble(r *http.Request, database *sql.DB) (ctx context.Context, queries *db.Queries) {
	return r.Context(), db.New(database)
}

func ConvertMessagesToStrings(messages []db.Message) []string {
	strings := make([]string, 0, len(messages)) // Preallocate for efficiency
	for _, msg := range messages {
		if msg.Text.Valid { // Check if the Text field is valid
			strings = append(strings, msg.Text.String)
		} else {
			strings = append(strings, "") // Append an empty string if Text is null
		}
	}
	return strings
}
