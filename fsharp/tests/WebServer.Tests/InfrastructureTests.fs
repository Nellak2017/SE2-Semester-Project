// Tests for infrastructure code
namespace Tests.InfrastructureTests

open Xunit
open Tests.TestDatabaseHelpers.EnvOps
open Tests.TestDatabaseHelpers.DBOps
open Tests.TestDatabaseHelpers.Setup
open Tests.TestDatabaseHelpers.Teardown
open SE2.Infrastructure.Persistence.SQLc
open Npgsql
open System
open FsToolkit.ErrorHandling

// TODO: Make all namespaces standardized
module GetAllUsers =
    let DEFAULT_DB_CONNECTION = getEnv "DEFAULT_DB_CONNECTION_STRING"
    let DB_CONNECTION = getEnv "DB_CONNECTION_STRING"
    let DB_NAME = getEnv "TEST_DATABASE_NAME"
    let SCHEMA_PATH = schemaPath ()
    let db = DB(DB_CONNECTION)

    [<Fact>]
    let ```Test getAllUsers should retrieve all users`` () =
        let test =
            createTestDB ()
            |> Async.RunSynchronously
            |> (fun value ->
                match value with
                | Ok() -> "Database setup successfully"
                | Error err -> err)

        printfn "%s" test

// seedTestDB "envPath" "DB_ENV" "seedPath" "SEED_SUCCESS"
// try
//     Assert.NotEmpty(db.getAllUsers())
// finally
//     dropTestDatabase "envPath" "POSTGRES_ENV" "DB_NAME_ENV" "DROP_SUCCESS"
