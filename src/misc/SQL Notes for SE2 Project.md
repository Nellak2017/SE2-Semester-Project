SQL Notes for SE2 Semester Project. This serves as a simple documentation of what I did to get the Database aspect of our Application set up and running. The general process was this:

1. Set up the Initial DB in Google Cloud
2. Give the Initial DB with a Schema
3. Populate the Initial DB with Dummy Data
4. Define the Operations for the API Endpoints
5. Write the Code for the Operations
6. Setting up the Proxy so that the Client can make DB requests

For the purposes of this documentation, step 1 was skipped over. I do go into further detail about the rest of the process and how to replicate what I did on your local machine.

# Table of Contents (Github)

- [Table of Contents (Obsidian)](#table-of-contents-obsidian)
- [Database Schema](#database-schema)
   * [Messages Table](#messages-table)
   * [Threads Table](#threads-table)
   * [Users Table](#users-table)
- [Dummy Data](#dummy-data)
   * [Dummy Users](#dummy-users)
   * [Dummy Threads](#dummy-threads)
   * [Dummy Messages](#dummy-messages)
- [Setting Up (Assuming our Google Cloud DB is set up w/ dummy data)](#setting-up-assuming-our-google-cloud-db-is-set-up-w-dummy-data)
   * [Service Account](#service-account)
   * [Proxy](#proxy)
   * [Parameterized Queries](#parameterized-queries)
      + [What is an API Endpoint?](#what-is-an-api-endpoint)
      + [How to parameterize the queries](#how-to-parameterize-the-queries)
         - [Defining the endpoint, getMessages.js](#defining-the-endpoint-getmessagesjs)
         - [Client using the endpoint](#client-using-the-endpoint)
- [API Reference](#api-reference)
   * [GET All messages for a given user and thread id](#get-all-messages-for-a-given-user-and-thread-id)
      + [What you need for GET All messsages](#what-you-need-for-get-all-messsages)
      + [Code for getMessages](#code-for-getmessages)
   * [POST Add message](#post-add-message)
      + [What you need for Add message](#what-you-need-for-add-message)

# Table of Contents (Obsidian)

- [[#Database Schema]]
	- [[#Messages Table]]
	- [[#Threads Table]]
	- [[#Users Table]]
- [[#Dummy Data]]
	- [[#Dummy Users|Dummy Users]]
	- [[#Dummy Threads|Dummy Threads]]
	- [[#Dummy Messages|Dummy Messages]]
- [[#Setting Up (Assuming our Google Cloud DB is set up w/ dummy data)]]
	- [[#Service Account|Service Account]]
	- [[#Proxy|Proxy]]
	- [[#Parameterized Queries|Parameterized Queries]]
		- [[#What is an API Endpoint?]]
		- [[#How to parameterize the queries]]
			- [[#Defining the endpoint, getMessages.js]]
			- [[#Client using the endpoint]]
- [[#API Reference]]
	- [[#GET All messages for a given user and thread id|GET All messages for a given user and thread id]]
		- [[#What you need for GET All messsages|What you need for GET All messsages]]
      - [[#Code for getMessages|Code for getMessages]
	- [[#POST Add message|POST Add message]]
		- [[#What you need for Add message|What you need for Add message]]


# Database Schema

Each of the following tables has the command used to make the Table with a detailed schema, along with a table of the simplified schema.

## Messages Table

```sql
CREATE TABLE `Messages` (
  `MessageID` int NOT NULL AUTO_INCREMENT,
  `ThreadID` int DEFAULT NULL,
  `Text` text,
  `Timestamp` timestamp NULL DEFAULT NULL,
  `SentByUser` tinyint(1) DEFAULT NULL,
  `UserID` int DEFAULT NULL,
  PRIMARY KEY (`MessageID`),
  KEY `ThreadID` (`ThreadID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `Messages_ibfk_1` FOREIGN KEY (`ThreadID`) REFERENCES `Threads` (`ThreadID`),
  CONSTRAINT `Messages_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`)
)
```

| Field      | Type       | Null | Key | Default | Extra          |
|------------|------------|------|-----|---------|----------------|
| MessageID  | int        | NO   | PRI | NULL    | auto_increment |
| ThreadID   | int        | YES  | MUL | NULL    |                |
| Text       | text       | YES  |     | NULL    |                |
| Timestamp  | timestamp  | YES  |     | NULL    |                |
| SentByUser | tinyint(1) | YES  |     | NULL    |                |
| UserID     | int        | YES  | MUL | NULL    |                |

## Threads Table

```sql
CREATE TABLE `Threads` (
  `ThreadID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Temperature` int DEFAULT '50',
  `TypingSpeed` int DEFAULT '50',
  `UserID` int NOT NULL,
  PRIMARY KEY (`ThreadID`),
  UNIQUE KEY `unique_name_per_user` (`Name`,`UserID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `Threads_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`),
  CONSTRAINT `Threads_chk_1` CHECK (((`Temperature` >= 0) and (`Temperature` <= 100))),
  CONSTRAINT `Threads_chk_2` CHECK (((`TypingSpeed` >= 0) and (`TypingSpeed` <= 100)))
)
```

| Field       | Type         | Null | Key | Default | Extra          |
|-------------|--------------|------|-----|---------|----------------|
| ThreadID    | int          | NO   | PRI | NULL    | auto_increment |
| Name        | varchar(100) | NO   | MUL | NULL    |                |
| Temperature | int          | YES  |     | 50      |                |
| TypingSpeed | int          | YES  |     | 50      |                |
| UserID      | int          | NO   | MUL | NULL    |                |

## Users Table

```sql
CREATE TABLE `Users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `UserName` varchar(50) NOT NULL,
  PRIMARY KEY (`UserID`)
)
```

| Field    | Type        | Null | Key | Default | Extra          |
|----------|-------------|------|-----|---------|----------------|
| UserID   | int         | NO   | PRI | NULL    | auto_increment |
| UserName | varchar(50) | NO   |     | NULL    |                |

# Dummy Data

This documents how I generated the dummy data for the database.

## Dummy Users
```sql
INSERT INTO Users (UserName) VALUES ('UserA');
INSERT INTO Users (UserName) VALUES ('UserB');
```

## Dummy Threads

```sql
-- Inserting Threads for UserA
INSERT INTO Threads (Name, UserID) VALUES ('Thread1_UserA', 1);
INSERT INTO Threads (Name, UserID) VALUES ('Thread2_UserA', 1);

-- Inserting Threads for UserB
INSERT INTO Threads (Name, UserID) VALUES ('Thread1_UserB', 2);
INSERT INTO Threads (Name, UserID) VALUES ('Thread2_UserB', 2);
```

## Dummy Messages

```sql
-- Inserting Messages for Thread1_UserA
INSERT INTO Messages (ThreadID, UserID, Text, Timestamp, SentByUser) VALUES (1, 1, 'Message1_Thread1_UserA', CURRENT_TIMESTAMP, 1);
INSERT INTO Messages (ThreadID, UserID, Text, Timestamp, SentByUser) VALUES (1, 1, 'Message2_Thread1_UserA', CURRENT_TIMESTAMP, 0);
INSERT INTO Messages (ThreadID, UserID, Text, Timestamp, SentByUser) VALUES (1, 1, 'Message3_Thread1_UserA', CURRENT_TIMESTAMP, 1);

-- Inserting Messages for Thread2_UserA
INSERT INTO Messages (ThreadID, UserID, Text, Timestamp, SentByUser) VALUES (2, 1, 'Message1_Thread2_UserA', CURRENT_TIMESTAMP, 1);
INSERT INTO Messages (ThreadID, UserID, Text, Timestamp, SentByUser) VALUES (2, 1, 'Message2_Thread2_UserA', CURRENT_TIMESTAMP, 0);
INSERT INTO Messages (ThreadID, UserID, Text, Timestamp, SentByUser) VALUES (2, 1, 'Message3_Thread2_UserA', CURRENT_TIMESTAMP, 1);

-- Inserting Messages for Thread1_UserB
INSERT INTO Messages (ThreadID, UserID, Text, Timestamp, SentByUser) VALUES (3, 2, 'Message1_Thread1_UserB', CURRENT_TIMESTAMP, 1);
INSERT INTO Messages (ThreadID, UserID, Text, Timestamp, SentByUser) VALUES (3, 2, 'Message2_Thread1_UserB', CURRENT_TIMESTAMP, 0);
INSERT INTO Messages (ThreadID, UserID, Text, Timestamp, SentByUser) VALUES (3, 2, 'Message3_Thread1_UserB', CURRENT_TIMESTAMP, 1);

-- Inserting Messages for Thread2_UserB
INSERT INTO Messages (ThreadID, UserID, Text, Timestamp, SentByUser) VALUES (4, 2, 'Message1_Thread2_UserB', CURRENT_TIMESTAMP, 1);
INSERT INTO Messages (ThreadID, UserID, Text, Timestamp, SentByUser) VALUES (4, 2, 'Message2_Thread2_UserB', CURRENT_TIMESTAMP, 0);
INSERT INTO Messages (ThreadID, UserID, Text, Timestamp, SentByUser) VALUES (4, 2, 'Message3_Thread2_UserB', CURRENT_TIMESTAMP, 1);
```

# Setting Up (Assuming our Google Cloud DB is set up w/ dummy data)

All the steps for set up are assuming you already have your Google Cloud DB set up with dummy data and that the default service account is still active. 

## Service Account

If your default service account is not active and you have adequate permissions, you should go to your Google Cloud IAM and add the proper roles for the service account that accesses the Database. Please see the google docs on how to do this.

[Google Docs for Standard way to set up service account](https://cloud.google.com/sql/docs/mysql/connect-app-engine-standard#node.js "https://cloud.google.com/sql/docs/mysql/connect-app-engine-standard#node.js")

Once you have a service account, you will need to generate a __credentials file__ that contains a private key. To do this, you will simply go to your Google Cloud Service Account and click on the link that tells you to generate a new key. You should pick the _JSON format_, and it will download to your PC. Once you have it, you put it into a folder that you remember. 

If your absolute path has spaces in it, you will have to run a command prompt program to find the short name of it.

```bash
for %I in ("C:\path\to\your\file.json") do @echo %~nxI
```

This short name will be later used in the environment variable for the Proxy server.

If the above program does not work for you, then a work-around that I found that definitely works is to create a __shortNamePath.cmd__ file in a known folder such as Desktop, then use that to get the shortName of the file.

__shortNamePath.cmd__
```cmd
@ECHO OFF
echo %~s1
```

Be sure to save the file with that name and _.cmd_ and save as __all files__. To use this cmd program open up command prompt at that folder where the program is saved and do this:

__Usage__
```cmd
shortNamePath "C:\path\to\your\file.json"
```

This will return the short file name to be used.

## Proxy

Once you have your [[#Service Account | service account]], you will need to download the Proxy server for accessing Google Cloud SQL. Unless you are on the Google Cloud platform in the cloud shell, you will need a proxy for access. See this link below for the download.

[cloud-sql-proxy releases on GitHub](https://github.com/GoogleCloudPlatform/cloud-sql-proxy/releases "https://github.com/GoogleCloudPlatform/cloud-sql-proxy/releases")

After downloading the proxy, you will have to move the proxy to a folder you know about, then cd into it in your terminal. 

```bash
cd \location\of\cloud-sql-proxy.exe
```

Once you are in the same directory as the _cloud-sql-proxy_ you will be able to run the command line program that will allow you to start it running on your Local Host. Before you run it however, you will have to set up the environment variables in the terminal session. The important one is the __GOOGLE_APPLICATION_CREDENTIALS__. This environment variable gives access to the [[#Service Account | service account]] that you set up previously, by using the __credentials file__.

To set up the environment variable and start the proxy server, using the most up-to-date syntax:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="C:/...short name for absolute path"
./cloud-sql-proxy.x64.exe --credentials-file="$GOOGLE_APPLICATION_CREDENTIALS" extended-ward-405700:us-central1:one
```

Take note that the specific __./cloud-sql-proxy__ may be different depending on the file name. Mine was for Windows 64 bit, so mine was this: __./cloud-sql-proxy.x64.exe__. Also, the syntax is not constant, so in the future it may be different. See the most up to date syntax for this following the official Google Docs.

[Google Docs for Using the Start Proxy Command](https://cloud.google.com/sql/docs/sqlserver/connect-auth-proxy#start-proxy "https://cloud.google.com/sql/docs/sqlserver/connect-auth-proxy#start-proxy")

Once you have the proxy going, you will have to set up your __connectToDatabase__ function, I stored mine in a file called, __"db.js"__.  Before you write this code, you will have to install the proper dependencies first. After the dependencies are installed, you will then want to set up your environment variables in a __.env.local__ file. The user and password are what you use to log in to your Google Cloud DB, the database is the database you use for production, such as _test_. 

_dependencies_
```node
npm install mysql2
npm install dotenv
```

_db.js_
```javascript
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

// Load environment variables from the .env file
dotenv.config()

export async function connectToDatabase() {

    const pool = mysql.createPool({
        host: '127.0.0.1', // or 'localhost'
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    })

    return pool
}
```

Anytime an API endpoint wants to connect to the database, it will use the __connectToDatabase function__ using the __environment variables__ you set up to connect to the database through the running __proxy server__.

## Parameterized Queries

Parameterized Queries are how you make queries to the database from your API endpoint. In Next.js, if you use the built-in api directory, you can simply go to the route for it to see its payload without using Postman. This is good for testing, but in production it may be a _security vulnerability_. To understand how to construct a parameterized query, you have to understand how the endpoint works and how it gets its' parameters.

### What is an API Endpoint?

If you are using the route based endpoint, you will store them in the API folder under pages. If you have endpoints you don't want to be accessed in this way, you will have to store them elsewhere.

```text
src
|__ pages
   |__ api
      |__ endpoint.js
```

To access this endpoint, you would have to go to the route and use __URL arguments__ to define the Query.

Example
```text
http://localhost:3000/api/getMessages?userID=UserA&threadID=1
```

```json
[{"MessageID":14,"ThreadID":1,"Text":"Message1_Thread1_UserA","Timestamp":"2023-11-26T10:47:48.000Z","SentByUser":1,"UserID":1},{"MessageID":15,"ThreadID":1,"Text":"Message2_Thread1_UserA","Timestamp":"2023-11-26T10:47:54.000Z","SentByUser":0,"UserID":1},{"MessageID":16,"ThreadID":1,"Text":"Message3_Thread1_UserA","Timestamp":"2023-11-26T10:48:01.000Z","SentByUser":1,"UserID":1}]
```

### How to parameterize the queries

So we saw that you visit the endpoint using the _URL_, only if you are using the route based API and to parametrize it you use the __URL Arguments__. Below is example code that will parse out the URL Arguments and make the query to the Proxy DB.

#### Defining the endpoint, getMessages.js
```javascript
export const handler = async (req, res) => {
    try {
        // Connect to db
        const db = await connectToDatabase()

        // Extract parameters from the request query
        const { userID, threadID } = req.query

        // GET messages operation
        const query = `
            SELECT Messages.* 
            FROM Messages 
            JOIN Users ON Messages.UserID = Users.UserID 
            JOIN Threads ON Messages.ThreadID = Threads.ThreadID 
            WHERE Users.UserName = ? 
              AND Threads.Name = ?;
            `
        
        const result = await db.query(query, [userID, threadID])
        
        // Send the result as a JSON response
        res.status(200).json(result[0]) //result.rows
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}
```

#### Client using the endpoint
```javascript
// this is contained inside a component
// the component would pass in the userID and threadName it wants
const [messages, setMessages] = useState([])
useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/getMessages', { 
          params: { userID: 'UserA', threadName: 'My-First-Thread' }, 
          // hardcoded for testing and demonstration only
        })
        setMessages(response.data.map(e => { 
        return { 
	        'user': booleanToString(e?.SentByUser), 
	        'text': e?.Text, 
	        'messageId':e?.MessageID 
        }})) 
      } catch (e) {
        console.error('Error fetching messages:', e)
      }
    })()
  }, [])
```

As you can see in the [[#Defining the endpoint, getMessages.js|endpoint itself]], question marks are used to parameterize positionally based on the _position in the array_ below. I am not sure if you can do named parameterization using this driver, so for now we will stick to positional based paramterization.

# API Reference

These are all the supported API endpoints for the SE2 application.

## GET All messages for a given user and thread id

```sql
SELECT Messages.* 
FROM Messages 
JOIN Users ON Messages.UserID = Users.UserID 
JOIN Threads ON Messages.ThreadID = Threads.ThreadID 
WHERE Users.UserName = ? 
 AND Threads.Name = ?;
```

### What you need for GET All messsages

- UserName : string
- Name : string // Name of the thread

### Code for getMessages

__getMessages.js__
```javascript
import { connectToDatabase } from "./utils/db"

// Serverless function handler
export const handler = async (req, res) => {
    try {
        // Connect to db
        const db = await connectToDatabase()
        
        // Extract parameters from the request query
        const { userID, threadID } = req.query

        // Check if both userID and threadID are provided
        if (!userID || !threadID) {
            return res.status(400).json({ error: 'Both userID and threadID are required parameters.' })
        }

        // GET messages operation
        const query = `
            SELECT Messages.* 
            FROM Messages 
            JOIN Users ON Messages.UserID = Users.UserID 
            JOIN Threads ON Messages.ThreadID = Threads.ThreadID 
            WHERE Users.UserName = ? 
              AND Threads.Name = ?;
            `

        const result = await db.query(query, [userID, threadID])

        // Send the result as a JSON response
        res.status(200).json(result[0]) //result.rows
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

export default handler
```

## POST Add message

```sql
INSERT INTO Messages (ThreadID, UserID, Text, Timestamp, SentByUser) VALUES (2, 1, 'Message1_Thread2_UserA', CURRENT_TIMESTAMP, 1);
```

### What you need for Add message

- ThreadID : number
- UserID : number
- Text : string
- Timestamp : Timestamp
- SentByUser : 0 | 1 to represent boolean