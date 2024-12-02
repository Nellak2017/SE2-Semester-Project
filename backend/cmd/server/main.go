package main

import (
	"github.com/Nellak2017/SE2-Semester-Project/backend/api"
	"github.com/Nellak2017/SE2-Semester-Project/backend/scripts"
	_ "github.com/lib/pq"
)

func main() {
	scripts.CreateAndSeedTestDB() // Create and seed the test database (can be used in testing environment)

	database, _ := scripts.LoadDB("../../../.env.test", "TEST_DATABASE_URL")
	defer database.Close()

	api.StartServer(database)
}
