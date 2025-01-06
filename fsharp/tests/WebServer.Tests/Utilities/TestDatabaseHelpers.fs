// Setup, Teardown, other test db operations
namespace Tests.TestDatabaseHelpers

open System
open System.IO
open Npgsql
open FsToolkit.ErrorHandling

// TODO: DbError type instead of non-semantic strings
// TODO: getEnv to option instead
// TODO: use @ and ..\ to make the paths platform independent like @"..\..\..path"

// EnvOps - wrappers for environment variable functions like getting an env or a relative path
module EnvOps =
    let getEnv (environmentVariable: string) =
        Environment.GetEnvironmentVariable(environmentVariable)

    let pathFromRelative (relativePath: string) =
        Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, relativePath))

    let schemaPath () = // convienience function for schema file location
        pathFromRelative "../../../../../src/Infrastructure/WebServer.Infrastructure/Persistence/schema.sql"

    let seedPath () = // convienience function for seed file location
        pathFromRelative "../../../../../src/Infrastructure/WebServer.Infrastructure/Persistence/seeds/seed.sql"

// DBOps - wrappers for basic DB operations like getting data, getting env, executing SQL, and more
module DBOps =
    let querySQL (db: NpgsqlConnection) (sql: string) =
        async {
            try
                use reader = (new NpgsqlCommand(sql, db)).ExecuteReader()

                return
                    seq {
                        while reader.Read() do
                            yield [ for i in 0 .. reader.FieldCount - 1 -> reader.GetValue(i) ]
                    }
                    |> Seq.toList
                    |> Ok
            with ex ->
                return Error $"Error querying SQL: \n{ex.Message}"
        }

    let executeSQL (db: NpgsqlConnection) (sql: string) =
        async {
            try
                (new NpgsqlCommand(sql, db)).ExecuteNonQuery() |> ignore
                return Ok $"Successfully executed SQL: \n{sql}"
            with ex ->
                return Error $"Error executing SQL: \n{ex.Message}"
        }

    let connectToDB (connStr: string) callback =
        async {
            try
                use db = new NpgsqlConnection(connStr)
                db.Open()
                return! callback db
            with ex ->
                return Error $"Error connecting to database: \n{ex.Message}"
        }

    let getFileData (filePath: string) =
        async {
            try
                return File.ReadAllText(filePath) |> Ok
            with ex ->
                return Error $"Error reading file: \n{ex.Message}"
        }

    let executeSQLFromFile (connStr: string) (filePath: string) =
        asyncResult {
            let! sql = getFileData filePath
            return! connectToDB connStr (fun db -> executeSQL db sql)
        }

// Setup - creates a database and may seed it among other things
module Setup =
    type TestDatabaseConfig =
        { DefaultConnStr: string
          ConnStr: string
          DbName: string
          SchemaPath: string
          SeedPath: string }

    let createDBIfNotExists (connStr: string) (dbName: string) =
        async {
            let! dbExistsResult =
                DBOps.connectToDB connStr (fun db ->
                    DBOps.querySQL db $"SELECT 1 FROM pg_database WHERE datname = '{dbName}'")

            match dbExistsResult with
            | Ok rows when rows |> List.isEmpty |> not -> return Ok $"Database already exists: \n{dbName}" // DB exists, no need to create
            | Ok _ -> return! DBOps.connectToDB connStr (fun db -> DBOps.executeSQL db $"CREATE DATABASE {dbName}") // DB doesn't exist, create it
            | Error err -> return Error $"Error checking for database existence: \n{err}" // The query failed
        }

    let addDBSchema connStr schemaPath =
        DBOps.executeSQLFromFile connStr schemaPath

    let seedTestDB connStr seedPath =
        DBOps.executeSQLFromFile connStr seedPath

    let setupDB
        ({ DefaultConnStr = defaultConnStr
           ConnStr = connStr
           DbName = dbName
           SchemaPath = schemaPath
           SeedPath = seedPath }: TestDatabaseConfig)
        =
        asyncResult {
            let! _ = createDBIfNotExists defaultConnStr dbName
            let! _ = addDBSchema connStr schemaPath
            let! _ = seedTestDB connStr seedPath
            return ()
        }

    let createTestDB () =
        setupDB
            { DefaultConnStr = EnvOps.getEnv "DEFAULT_DB_CONNECTION_STRING"
              ConnStr = EnvOps.getEnv "DB_CONNECTION_STRING"
              DbName = EnvOps.getEnv "TEST_DATABASE_NAME"
              SchemaPath = EnvOps.schemaPath ()
              SeedPath = EnvOps.seedPath () }

// Teardown - will destroy the test database
module Teardown =
    let dropDatabase (defaultConnStr: string) (dbName: string) =
        DBOps.connectToDB defaultConnStr (fun db -> 
            async {
                try 
                    let! _ = DBOps.executeSQL db $"""
                            SELECT pg_terminate_backend(pg_stat_activity.pid)
                            FROM pg_stat_activity
                            WHERE pg_stat_activity.datname = '{dbName}' AND pid <> pg_backend_pid()
                            """
                    return! DBOps.executeSQL db $"DROP DATABASE {dbName}"
                with ex -> 
                    return Error $"Error dropping database: \n{ex.Message}"
            }
        )
    let dropTestDatabase () =
        asyncResult {
            let! _ = dropDatabase (EnvOps.getEnv "DEFAULT_DB_CONNECTION_STRING") (EnvOps.getEnv "TEST_DATABASE_NAME")
            return ()
        }