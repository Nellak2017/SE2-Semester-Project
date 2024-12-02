package scripts

import (
	"log"

	_ "github.com/lib/pq" // PostgreSQL driver
)

func CreateDB(env_path string, schema_path string, POSTGRES_ENV string, DB_NAME_ENV string, DB_ENV string, success_string string) {
	schema := GetFileData(schema_path)
	db, _ := LoadDB(env_path, POSTGRES_ENV)
	defer db.Close()

	db_name := GetEnvVariable(DB_NAME_ENV)
	ExecuteSQL(db, []byte("CREATE DATABASE "+db_name))

	db, _ = LoadDB(env_path, DB_ENV)
	ExecuteSQL(db, schema)

	log.Println(success_string)
}

func CreateTestDB() {
	CreateDB("../../../.env.test", "../../db/schema.sql", "POSTGRES_SERVER", "TEST_DATABASE_NAME", "TEST_DATABASE_URL", "Database schema created successfully!")
}
