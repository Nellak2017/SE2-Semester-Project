open SE2.Infrastructure.Persistence.SQLc
open System
open dotenv.net

DotEnv.Load(DotEnvOptions(envFilePaths = [| "../../../.env.test" |]))
let db = DB(Environment.GetEnvironmentVariable("DB_CONNECTION_STRING"))

let getUsers () =
    try
        db.getAllUsers ()
        |> List.iter (fun user -> printfn "User ID: %d, Username: %s" user.Userid user.Username)
    with ex ->
        printfn "Error: %s" ex.Message

getUsers ()
