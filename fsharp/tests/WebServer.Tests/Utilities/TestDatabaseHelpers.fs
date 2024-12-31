// Setup, Teardown, other test db operations
namespace Tests.TestDatabaseHelpers

open System
open System.IO
open System.Diagnostics
open Npgsql
open dotenv.net

// DBOps - wrappers for basic DB operations like getting data, getting env, executing SQL, and more 
module DBOps =
    // Loads the environment variables to be accessible within a given scope, When give an envPath
    let loadEnvFile (envPath: string) =
        try
            DotEnv.Load(DotEnvOptions(envFilePaths = [| envPath |]))
        with
        | ex -> failwithf "Error loading .env file: %s" ex.Message

    // Assumes that env are loaded, if not it will fail
    let getEnvVariable (envName: string) =
        Environment.GetEnvironmentVariable(envName)

    let connectToDatabase (connStr: string) =
        try 
            let db = new NpgsqlConnection(connStr)
            db
        with
        | ex -> failwithf "Error connecting to database: %s" ex.Message

    // TODO: fix this one
    let loadDB (envPath: string) (dbUrlEnv: string) =
        loadEnvFile envPath // side-effect. May failwith 
        connectToDatabase (getEnvVariable dbUrlEnv) // side-effect + return connection. May failwith

    let getFileData (filePath: string) =
        try
            File.ReadAllBytes(filePath)
        with
        | ex -> failwithf "Error reading file: %s" ex.Message

    let executeSQL (db: NpgsqlConnection) (sql: byte[]) =
        try
            use command = new NpgsqlCommand(System.Text.Encoding.UTF8.GetString(sql), db)
            command.ExecuteNonQuery() |> ignore
        with
        | ex -> printfn "Error executing SQL: %s" ex.Message

// Setup - creates a database and may seed it among other things
module Setup =
    let createDB (envPath: string) (schemaPath: string) (postgresEnv: string) (dbNameEnv: string) (dbEnv: string) (successString: string) =
        let schema = DBOps.getFileData schemaPath
        let db = DBOps.loadDB envPath postgresEnv
        try
            let dbName = DBOps.getEnvVariable dbNameEnv
            DBOps.executeSQL db (System.Text.Encoding.UTF8.GetBytes("CREATE DATABASE " + dbName))
            let db = DBOps.loadDB envPath dbEnv
            DBOps.executeSQL db schema
            printfn "%s" successString
        finally
            db.Close()

    let createTestDB () =
        createDB "../../../.env.test" "../../db/schema.sql" "POSTGRES_SERVER" "TEST_DATABASE_NAME" "TEST_DATABASE_URL" "Database schema created successfully!"

    let seedTestDB envPath dbEnv seedPath (successString: string) =
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
