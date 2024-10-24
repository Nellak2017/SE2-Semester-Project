// This file contains all the API functions
// The API functions have a side-effect involving the database and return a value
import axios from 'axios'
import { tryCatchAsync } from './result.js'

// --- API functions all do some side-effect involving talking to an API / DB AND return a result of what happened

// GET Threads - Function to get all the Threads for the user
export const getThreads = async ({ userID }) => {
  const result = await tryCatchAsync(async () => {
    const res = await axios.get('/api/getThreads', { params: { userID } })
    return res?.data
  }, e => e?.response?.data?.error || e?.message)
  return result
}

// GET Messages - Function to get Messages
export const getMessages = async ({ userID, threadID }) => { // min = 0, max = step
  const result = await tryCatchAsync(async () => {
    const res = await axios.get('/api/getMessages', { params: { userID, threadID } })
    return res?.data
  }, e => e?.response?.data?.error || e?.message)
  return result
}

// GET Temperature - Function to get Temperature for a user and thread
export const getTemperature = async ({ userID, threadID }) => {
  const result = await tryCatchAsync(async () => {
    const res = await axios.get('/api/getTemperature', { params: { userID, threadID } })
    return res?.data
  }, e => e?.response?.data?.error || e?.message)
  return result
}

// GET TypingSpeed - Function to get Temperature for a user and thread
export const getTypingSpeed = async ({ userID, threadID }) => {
  const result = await tryCatchAsync(async () => {
    const res = await axios.get('/api/getTypingSpeed', { params: { userID, threadID } })
    return res?.data
  }, e => e?.response?.data?.error || e?.message)
  return result
}

// GET If Thread by Name exists - Function to get if a Thread exists for a given user
export const getThreadNameExists = async ({ userID, threadName }) => {
  const result = await tryCatchAsync(async () => {
    const res = await axios.get('/api/getIsThreadNameExist', { params: { userID, threadName } })
    return res?.data
  }, e => e?.response?.data?.error || e?.message)
  return result
}

// POST Message - Function to post Messsage for the user and thread that is currently active AND return a value
export const addMessage = async ({ text, userID, threadID, sentByUser = 'user' }) => {
  const result = await tryCatchAsync(async () => {
    const res = await axios.post('/api/postMessage', { threadID, userID, text, sentByUser })
    return res?.data
  }, e => e?.response?.data?.error || e?.message)
  return result
}

// POST Messages - Function to post Messsages for the user and AI for the thread that is currently active AND return a value
export const addMessageAndResponse = async ({ userID, threadID, userText, AIText }) => {
  const result = await tryCatchAsync(async () => {
    const res = await axios.post('/api/postMessageAndResponse', { userID, threadID, userText, AIText })
    return res?.data
  }, e => e?.response?.data?.error || e?.message)
  return result
}

// POST Thread - Function to post generated the new thread AND then addMessage following the creation AND returns ThreadID 
export const postThread = async ({ userID, threadName }) => {
  const result = await tryCatchAsync(async () => {
    const res = await axios.post('/api/postThread', { userID, threadName })
    return res?.data
  }, e => e?.response?.data?.error || e?.message)
  return result
}

// PATCH Temperature - Function to update Temperature for the thread that is currently active AND return a value
export const patchTemperature = async ({ userID, threadID, newTemperature }) => {
  const result = await tryCatchAsync(async () => {
    const res = await axios.patch('/api/patchTemperature', { userID, threadID, newTemperature })
    return res?.data
  }, e => e?.response?.data?.error || e?.message)
  return result
}

// PATCH TypingSpeed - Function to update Typing Speed for the thread that is currently active AND return a value
export const patchTypingSpeed = async ({ userID, threadID, newTypingSpeed }) => {
  const result = await tryCatchAsync(async () => {
    const res = await axios.patch('/api/patchTypingSpeed', { userID, threadID, newTypingSpeed })
    return res?.data
  }, e => e?.response?.data?.error || e?.message)
  return result
}

// DELETE Threads - Function to delete thread and associated messages AND return a value
export const deleteThread = async ({ userID, threadID }) => {
  const result = await tryCatchAsync(async () => {
    const res = await axios.delete('/api/deleteThread', { data: { userID, threadID } })
    return res?.data
  }, e => e?.response?.data?.error || e?.message)
  return result
}