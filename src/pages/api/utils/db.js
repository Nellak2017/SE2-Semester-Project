import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config() // Load environment variables from the .env file
export const connectToDatabase = async () => mysql.createPool({ host: '127.0.0.1', port: 3306, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME, waitForConnections: true, connectionLimit: 10, queueLimit: 0, })