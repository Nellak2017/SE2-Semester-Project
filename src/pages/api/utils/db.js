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
        //socketPath: '/cloudsql/extended-ward-405700:us-central1:one',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
	})

	return pool
}