# PaLM to Gemini updates

This document summarizes how to migrate from __PaLM__ _(deprecated)_ to __Gemini__. 
Before making any API requests, you must obtain a valid API Key from [AIstudio](https://aistudio.google.com/app/apikey).

## Table of Contents

- [PaLM to Gemini updates](#palm-to-gemini-updates)
  * [TL;DR](#tl-dr)
    + [POST Request Contents](#post-request-contents)
      - [Example using Curl](#example-using-curl)
    + [How to use this with Axios](#how-to-use-this-with-axios)
    + [New Messages Schema](#new-messages-schema)
      - [Old Messages Schema from PaLM API](#old-messages-schema-from-palm-api)
      - [New Messages Schema from Gemini API](#new-messages-schema-from-gemini-api)
      - [Commands to update existing database in-place (without backing up table)](#commands-to-update-existing-database-in-place--without-backing-up-table-)
  * [POST Request URL](#post-request-url)
    + [Old URL in PaLM](#old-url-in-palm)
    + [New URL in Gemini](#new-url-in-gemini)
  * [Messages](#messages)
    + [Old Messages in PaLM](#old-messages-in-palm)
    + [New Messages in Gemini](#new-messages-in-gemini)
  * [Request Data](#request-data)
    + [Old Request Data in PaLM](#old-request-data-in-palm)
    + [New Request Data in Gemini](#new-request-data-in-gemini)

## TL;DR

### POST Request Contents
The __POST request to get AI responses__ will have:

1. __Proper Request URL :__ 

	__https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}__ 

2. __Proper Request Headers :__ 

	__{ 'Content-Type': 'application/json' }__

3. __Proper Request Data :__

```javascript
const requestData = {
		"contents": [
			{
				"role": "user",
				"parts": [
					{
						"text": "Enter text here for user."
					}
				]
			},
			{
				"role": "assistant", 
				"parts": [
					{
						"text": "The response from the LLM here." 
					}
				]
			}
		],
		"generationConfig": {
			"temperature", // number
			"candidateCount", // int
			"topK", // int
			"topP" // number
		}
	}
```

#### Example using Curl

[see also](https://aistudio.google.com/app/apikey)

```bash
curl \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Explain how AI works"}]}]}' \
  -X POST 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=YOUR_API_KEY'
```

### How to use this with Axios

The previous section shows how to do it as a raw POST request, but the following will show how to make it using axios.

```javascript
import axios from 'axios'
import dotenv from 'dotenv'
import { tryCatchAsync } from '../utils/result.js'

dotenv.config()

const API_KEY = process.env.NEXT_PUBLIC_PALM_API_KEY
const headers = { 'Content-Type': 'application/json' }
const apiURL = `https://generativelanguage.googleapis.com/v1beta3/models/gemini-1.5-flash:generateMessage?key=${API_KEY}` 

export async function generatePalmMessage({
	contents = [], temperature = .5, candidateCount = 1, topK = 40, topP = .95
}) {
	const requestData = {
		contents,
		generationConfig: { temperature, candidateCount, topK, topP }
	}
	const result = tryCatchAsync(
		async () => axios.post(apiURL, requestData, headers), 
		e => e?.response?.data?.error || e?.message)
	return result
}
```

### New Messages Schema

We must migrate the SQL Messages schema and update the existing table data to fit the new API.
_Note: User = 0 is 'user' and User = 1 is 'model'_

#### Old Messages Schema from PaLM API

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

#### New Messages Schema from Gemini API

```sql
CREATE TABLE `Messages` (
  `MessageID` int NOT NULL AUTO_INCREMENT,
  `ThreadID` int DEFAULT NULL,
  `Text` text,
  `Timestamp` timestamp NULL DEFAULT NULL,
  `SentByUser` ENUM('user', 'model') DEFAULT NULL,
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
| SentByUser | ENUM		  | YES  |     | NULL    |                |
| UserID     | int        | YES  | MUL | NULL    |                |

#### Commands to update existing database in-place (without backing up table)

This assumes you don't back up the data in the table first, which is typically recommended.
However, we don't do it here since it is just test data. 

__Warning: In real world settings you should always backup data before altering or dropping tables.__

```sql
-- Step 1: Change the column type
ALTER TABLE `Messages`
CHANGE `SentByUser` `SentByUser` ENUM('user', 'model') DEFAULT NULL;

-- Step 2: Update existing data
UPDATE `Messages`
SET `SentByUser` = CASE 
    WHEN `SentByUser` = 0 THEN 'user'
    WHEN `SentByUser` = 1 THEN 'model'
    ELSE NULL
END;

-- Step 3: Verify the migration
SELECT * FROM `Messages` WHERE `SentByUser` IS NULL; -- Optional check
```


## POST Request URL

This is the URL you will use in the Request to the API.

### Old URL in PaLM

https://generativelanguage.googleapis.com/v1beta3/models/chat-bison-001:generateMessage?key=${API_KEY}

### New URL in Gemini

https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}

## Messages 

Messages is now history with a more nested structure.

### Old Messages in PaLM

- __Migration guide__: https://ai.google.dev/docs/migration_guide

```javascript
chat.messages = [
	{'author': '0', 'content': 'Hello'},
	{'author': '1', 'content': 'Hello! How can I help you today?'},
	{'author': '0', 'content': "Just chillin'"},
	{'author': '1','content': "That's great! I'm glad you're able to relax and take some time for yourself. What are you up to today?"}
]
```

### New Messages in Gemini
- __Migration guide:__ https://ai.google.dev/docs/migration_guide)

```javascript
chat.history = [
	{
		role: "user", 
		parts: [{
				text: "Hello." 
			}]
	},
	{
		role: "assistant", 
		parts: [{ 
				text: "Greetings! How may I assist you today?" 
			}]
	},
	{
		role: "user", 
		parts: [{ 
			text: "Just chillin" 
			}]
	},
	{
		role: "assistant", 
		parts: [{ 
			text: "That's great! I'm glad you're able to relax and take some time for yourself. What are you up to today?" 
			}]
	},
]
```

## Request Data

GenerationConfig is used instead of having the data at the top of the response body.

### Old Request Data in PaLM

- __Decomissioned docs:__ https://ai.google.dev/api/palm#v1beta.models.generateMessage

```javascript
const requestData = {
		model: MODEL_NAME,
		temperature,
		candidateCount,
		topK,
		topP,
		prompt: {
			context,
			examples,
			messages,
		},
	}
```
### New Request Data in Gemini

- __Example:__ https://ai.google.dev/gemini-api/docs/text-generation?lang=rest

```javascript
const requestData = {
		"contents": [
			{
				"role": "user",
				"parts": [
					{
						"text": "Enter text here for user."
					}
				]
			},
			{
				"role": "assistant", 
				"parts": [
					{
						"text": "The response from the LLM here." 
					}
				]
			}
		],
		"generationConfig": {
			"temperature", // number
			"candidateCount", // int
			"topK", // int
			"topP" // number
		}
	}
```