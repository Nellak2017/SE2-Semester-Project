package scripts

import (
	"log"

	_ "github.com/lib/pq" // PostgreSQL driver
)

func DropDB(env_path string, POSTGRES_ENV string, DB_NAME_ENV string, success_string string) {
	db, _ := LoadDB(env_path, POSTGRES_ENV)
	defer db.Close()
	dbName := GetEnvVariable(DB_NAME_ENV)
	ExecuteSQL(db, []byte("SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid();"), dbName)
	ExecuteSQL(db, []byte("DROP DATABASE IF EXISTS $1"), dbName)
	log.Println(success_string)
}

func DropTestDB() {
	DropDB("../../../.env.test", "POSTGRES_SERVER", "TEST_DATABASE_NAME", "Test database dropped successfully!")
}
