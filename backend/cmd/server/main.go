package main

import (
	// "context"
	// "fmt"
	// "log"

	// db "github.com/Nellak2017/SE2-Semester-Project/backend/db/SQLc"
	// "github.com/Nellak2017/SE2-Semester-Project/backend/scripts"
	"github.com/Nellak2017/SE2-Semester-Project/backend/scripts"
	_ "github.com/lib/pq"
)

func main() {
	// database, connstr := scripts.LoadDB("../../../.env", "DATABASE_URL")
	// defer database.Close() // best practice
	// ctx := context.Background()
	// queries := db.New(database)

	// // Queries
	// err := queries.DeleteUser(ctx, 1)
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// fmt.Println("Deleted user")
	scripts.CreateAndSeedTestDB()
}
