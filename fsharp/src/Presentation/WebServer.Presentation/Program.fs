open SE2.Infrastructure.Persistence.SQLc

let connectionString =
    "use env variables!"

let db = DB(connectionString)

let getUsers () =
    try
        db.getAllUsers ()
        |> List.iter (fun user -> printfn "User ID: %d, Username: %s" user.Userid user.Username)
    with ex ->
        printfn "Error: %s" ex.Message

getUsers ()
