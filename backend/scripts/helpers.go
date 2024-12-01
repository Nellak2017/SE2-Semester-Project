package scripts

import (
	"database/sql"
	"log"
	"os"

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
