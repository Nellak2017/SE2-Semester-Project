// Setup, Teardown, other test db operations
namespace Tests.TestDatabaseHelpers

open System
open System.IO
open System.Diagnostics
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
                use command = new NpgsqlCommand(sql, db)
                use reader = command.ExecuteReader()

                let results =
                    seq {
                        while reader.Read() do
                            yield [ for i in 0 .. reader.FieldCount - 1 -> reader.GetValue(i) ]
                    }
                    |> Seq.toList

                return Ok results
            with ex ->
                return Error $"Error querying SQL: \n{ex.Message}"
        }

    let executeSQL (db: NpgsqlConnection) (sql: string) =
        async {
            try
                use command = new NpgsqlCommand(sql, db)
                command.ExecuteNonQuery() |> ignore
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
                let data = File.ReadAllText(filePath)
                return Ok data
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

    let addDBSchema connStr schemaPath = DBOps.executeSQLFromFile connStr schemaPath
    let seedTestDB connStr seedPath = DBOps.executeSQLFromFile connStr seedPath

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
