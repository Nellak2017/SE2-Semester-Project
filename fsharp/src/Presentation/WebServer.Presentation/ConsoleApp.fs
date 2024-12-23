open System
open SE2.Infrastructure.Persistence.SQLc  // Make sure to adjust the namespace accordingly

let connectionString = "Host=localhost;Username=nellak;Password=Keenum2012;Database=chatgpt_clone_test"
let db = DB(connectionString)

[<EntryPoint>]
let main argv =
    try
        let users = db.getAllUsers()
        printfn "Users: %A" users
        0 // Return an integer exit code (0 means success)
    with
    | ex -> 
        printfn "An error occurred: %s" ex.Message
        1 // Return a non-zero exit code on error