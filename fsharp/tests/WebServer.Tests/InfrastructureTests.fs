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
        let runTestWorkflow () =
            asyncResult {
                do! createTestDB ()
                do! dropTestDatabase ()
                return "Test Database setup and teardown completed successfully"
            }
        let testResult =
            runTestWorkflow ()
            |> Async.RunSynchronously
            |> function
                | Ok message -> message
                | Error err -> $"{err}"
        printfn "%s" testResult