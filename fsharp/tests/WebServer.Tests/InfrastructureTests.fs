// Tests for infrastructure code
namespace Tests.InfrastructureTests
open FsCheck
open Xunit
open Tests.TestDatabaseHelpers.EnvOps
open Tests.TestDatabaseHelpers.DBOps
open Tests.TestDatabaseHelpers.Setup
open Tests.TestDatabaseHelpers.Teardown
open SE2.Infrastructure.Persistence.SQLc
open Npgsql
open System

// TODO: Make all namespaces standardized
module GetAllUsers =    
    let DB_CONNECTION = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING")
    let db = DB(DB_CONNECTION)

    [<Fact>]
    let ```Test getAllUsers should retrieve all users`` () =
        printfn "Connection String: '%s'" DB_CONNECTION
        printfn "\n"
        printfn "Current working directory: %s" (Environment.CurrentDirectory)
        printfn "Going up: %s" (schemaPath())
        printfn "\n"
        printfn "%s"(getFileData (schemaPath()))
        //createTestDB ()
        // seedTestDB "envPath" "DB_ENV" "seedPath" "SEED_SUCCESS"
        // try
        //     Assert.NotEmpty(db.getAllUsers())
        // finally
        //     dropTestDatabase "envPath" "POSTGRES_ENV" "DB_NAME_ENV" "DROP_SUCCESS"