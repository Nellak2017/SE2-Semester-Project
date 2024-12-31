// Tests for infrastructure code
namespace Tests.InfrastructureTests
open FsCheck
open Xunit
open Tests.TestDatabaseHelpers.DBOps
open Tests.TestDatabaseHelpers.Setup
open Tests.TestDatabaseHelpers.Teardown
open SE2.Infrastructure.Persistence.SQLc
open Npgsql

// TODO: Make all namespaces standardized
module GetAllUsers =    
    let DB_CONNECTION = getEnvVariable "DB_CONNECTION_STRING"
    let db = DB(DB_CONNECTION)

    [<Fact>]
    let ```Test getAllUsers should retrieve all users`` () =
        printfn "Connection String: '%s'" DB_CONNECTION
        createDB "" "../../db/schema.sql" "POSTGRES_SERVER" "TEST_DATABASE_NAME" "TEST_DATABASE_URL" "Database schema created successfully!"
        // createTestDB ()
        // seedTestDB "envPath" "DB_ENV" "seedPath" "SEED_SUCCESS"
        // try
        //     Assert.NotEmpty(db.getAllUsers())
        // finally
        //     dropTestDatabase "envPath" "POSTGRES_ENV" "DB_NAME_ENV" "DROP_SUCCESS"