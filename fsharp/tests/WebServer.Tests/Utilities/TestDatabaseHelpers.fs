// Setup, Teardown, other test db operations
namespace Tests.TestDatabaseHelpers

open System
open System.IO
open System.Diagnostics
open Npgsql
open dotenv.net

// EnvOps - wrappers for environment variable functions like getting an env or a relative path
module EnvOps =
    let getEnv (environmentVariable: string) =
        Environment.GetEnvironmentVariable(environmentVariable)

    let pathFromRelative (relativePath: string) =
        Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, relativePath))

    let schemaPath () = // convienience function for schema file location
        pathFromRelative "../../../../../src/Infrastructure/WebServer.Infrastructure/Persistence/schema.sql"

// DBOps - wrappers for basic DB operations like getting data, getting env, executing SQL, and more
module DBOps =
    let executeSQL (db: NpgsqlConnection) (sql: string) =
        try
            use command = new NpgsqlCommand(sql, db)
            command.ExecuteNonQuery() |> ignore
        with ex ->
            printfn "Error executing SQL: %s" ex.Message

    let executeSQLWithLogging (db: NpgsqlConnection) (sql: string) (before: string) (after: string) (error: string) =
        try
            printfn "%s" before
            executeSQL db sql
            printfn "%s" after
        with ex ->
            printfn "%s %s" error ex.Message

    let connectToDB (connStr: string) = // side-effect
        try
            use conn = new NpgsqlConnection(connStr)
            conn.Open()
            conn
        with ex ->
            failwithf "Error connecting to database: %s" ex.Message

    let getFileData (filePath: string) =
        try
            File.ReadAllText(filePath)
        with ex ->
            failwithf "Error reading file: %s" ex.Message

// Setup - creates a database and may seed it among other things
module Setup =
    let createDBIfNotExists (connStr: string) (dbName: string) =
        use db = DBOps.connectToDB connStr // side-effect

        use reader =
            (new NpgsqlCommand(sprintf "SELECT 1 FROM pg_database WHERE datname = '%s'" dbName, db))
                .ExecuteReader()

        if not reader.HasRows then
            DBOps.executeSQLWithLogging
                db
                (sprintf "CREATE DATABASE \"%s\"" dbName)
                "Database does not exist. Creating..."
                "Database created successfully."
                "Eror could not create Database."
        else
            printfn "Database '%s' already exists." dbName

        reader.Close()

    let addDBSchema (connStr: string) (schemaPath: string) =
        use db = DBOps.connectToDB connStr
        let schema = DBOps.getFileData schemaPath

        try
            DBOps.executeSQLWithLogging
                db
                schema
                "Adding Schema to Database..."
                "Added Schema to Database."
                "Could not add schema to database."
        finally
            db.Close()

    let setupDB (connStr: string) (schemaPath: string) (dbName: string) (successString: string) =
        createDBIfNotExists connStr dbName
        addDBSchema connStr schemaPath
        printfn "%s" successString

    let createTestDB () =
        setupDB
            (EnvOps.getEnv "DB_CONNECTION_STRING")
            (EnvOps.schemaPath ())
            (EnvOps.getEnv "TEST_DATABASE_NAME")
            "Database schema created successfully!"

    let seedTestDB dbEnv seedPath (successString: string) =
        let dbConn = Environment.GetEnvironmentVariable(dbEnv)

        if String.IsNullOrWhiteSpace dbConn then
            failwith "Missing database connection environment variable."

        let seedScript = System.IO.File.ReadAllText(seedPath)

        let result =
            use p = new Process()
            p.StartInfo.FileName <- "psql"
            p.StartInfo.Arguments <- $"-c \"{seedScript}\" {dbConn}"
            p.StartInfo.RedirectStandardOutput <- true
            p.StartInfo.RedirectStandardError <- true
            p.Start() |> ignore
            p.WaitForExit()
            p.StandardOutput.ReadToEnd()

        if not (result.Contains(successString)) then
            failwith $"Failed to seed test database: {result}"

        printfn "Test database seeded successfully."

// Teardown - will destroy the test database
module Teardown =
    let dropTestDatabase envPath postgresEnv dbNameEnv (successString: string) =
        let postgresConn = Environment.GetEnvironmentVariable(postgresEnv)
        let dbName = Environment.GetEnvironmentVariable(dbNameEnv)

        if String.IsNullOrWhiteSpace postgresConn || String.IsNullOrWhiteSpace dbName then
            failwith "Missing required environment variables for database deletion."

        let result =
            use p = new Process()
            p.StartInfo.FileName <- "psql"
            p.StartInfo.Arguments <- $"-c \"DROP DATABASE IF EXISTS {dbName}\" {postgresConn}"
            p.StartInfo.RedirectStandardOutput <- true
            p.StartInfo.RedirectStandardError <- true
            p.Start() |> ignore
            p.WaitForExit()
            p.StandardOutput.ReadToEnd()

        if not (result.Contains(successString)) then
            failwith $"Failed to drop test database: {result}"

        printfn "Test database dropped successfully."
