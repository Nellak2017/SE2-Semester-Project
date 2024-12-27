// core business rules (use cases). Aka Type definitions and constructors
namespace WebServer.Domain

// --- Anemic types
type ThreadId = ThreadId of System.Guid
type MessageId = MessageId of System.Guid
type User = User of int

// --- Value objects
type Temperature = private Temperature of int
module Temperature = 
    let create value = 
        if value >= 0 && value <= 100 then Some (Temperature value)
        else None
    let value (Temperature t) = t

type TypingSpeed = private TypingSpeed of int
module TypingSpeed =
    let create value =
        if value >= 0 && value <= 100 then Some (TypingSpeed value)
        else None
    let value (TypingSpeed s) = s

type Title = private Title of string
module Title =
    let create (value:string) = 
        if value.Length <= 50 then Some (Title value)
        else None
    let value (Title n) = n 

type Name = private Name of string
module Name =
    let create (value:string) =
        if value.Length <= 50 then Some (Name value)
        else None
    let value (Name n) = n

type Text = private Text of string
module Text =
    let create (value:string) = 
        if value.Length <= 1000 then Some (Text value)
        else None
    let value (Text t) = t

type Error = private Error of string
module Error = 
    let create (value:string) = 
        if value.Length <= 100 then Some (Error value)
        else None
    let value (Error e) = e

// --- Entities
type Message = {
    MessageId: MessageId
    User: User
    Text: Text
    Error: Error option
}
type ChatHistory = Message list

type Thread = {
    ThreadId: ThreadId
    Temperature: Temperature
    TypingSpeed: TypingSpeed
    Title: Title
    Highlighted: bool // TODO: Code Smell
    Name: Name
}
type Threads = Thread list