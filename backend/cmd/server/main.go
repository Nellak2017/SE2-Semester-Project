package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/Nellak2017/SE2-Semester-Project/backend/db"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	loadEnvFile("../../../.env")
	connStr := getDatabaseURL("DATABASE_URL")
	database := connectToDatabase("postgres", connStr)
	defer database.Close() // best practice

	// Initialize the context and queries
	ctx := context.Background()
	queries := db.New(database)

	// Queries
	err := queries.DeleteUser(ctx, 1)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Deleted user")
}

func loadEnvFile(envPath string) { // does a side effect and doesn't return
	err := godotenv.Load(envPath) // relative path approach
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func getDatabaseURL(envName string) string { // does side effect and returns
	connStr := os.Getenv(envName) // os.Getenv always returns a string
	if connStr == "" {
		log.Fatal("DATABASE_URL is not set in the environment")
	}
	return connStr
}

func connectToDatabase(driverName string, connStr string) *sql.DB { // does side effect and returns
	database, err := sql.Open(driverName, connStr)
	if err != nil {
		log.Fatal(err)
	}
	return database
}
