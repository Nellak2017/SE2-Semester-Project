package scripts

import (
	"log"

	_ "github.com/lib/pq"
)

func Seed(env_path string, DB_ENV string, seed_path string, success_string string) {
	db, _ := LoadDB(env_path, DB_ENV)
	defer db.Close()
	seed := GetFileData(seed_path)
	ExecuteSQL(db, seed)
	log.Println(success_string)
}

func TestSeed() {
	Seed("../../../.env.test", "TEST_DATABASE_URL", "../../db/seeds/seed.sql", "Database seeded successfully!")
}
