// This file contains all the API functions
// The API functions have a side-effect involving the database and return a value
import axios from 'axios'
import { tryCatchAsync } from './result.js'

// --- API functions all do some side-effect involving talking to an API / DB AND return a result of what happened

// GET Threads - Function to get all the Threads for the user
export const getThreads = async ({ userId }) => {
  const result = await tryCatchAsync(async () => {
    const res = await axios.get('/api/getThreads', { params: { userId } })
    return res?.data
  }, e => e?.response?.data?.error || e?.message)
  return result
}

// GET Messages - Function to get Messages
export const getMessages = async ({ userId, threadId }) => { // min = 0, max = step
  const result = await tryCatchAsync(async () => {
    const res = await axios.get('/api/getMessages', { params: { userId, threadId } })
    return res?.data
  }, e => e?.response?.data?.error || e?.message)
  return result
}

// GET Temperature - Function to get Temperature for a user and thread
export const getTemperature = async ({ userId, threadId }) => {
  const result = await tryCatchAsync(async () => {
    const res = await axios.get('/api/getTemperature', { params: { userId, threadId } })
    return res?.data
  }, e => e?.response?.data?.error || e?.message)
  return result
}

// GET TypingSpeed - Function to get Temperature for a user and thread
export const getTypingSpeed = async ({ userId, threadId }) => {
  const result = await tryCatchAsync(async () => {
    const res = await axios.get('/api/getTypingSpeed', { params: { userId, threadId } })
    return res?.data
  }, e => e?.response?.data?.error || e?.message)
  return result
}

// GET If Thread by Name exists - Function to get if a Thread exists for a given user
export const getThreadNameExists = async ({ userId, threadName }) => {
  const result = await tryCatchAsync(async () => {
    const res = await axios.get('/api/getIsThreadNameExist', { params: { userId, threadName } })
    return res?.data
  }, e => e?.response?.data?.error || e?.message)
  return result
}

// POST Message - Function to post Messsage for the user and thread that is currently active AND return a value
export const addMessage = async ({ text, userId, threadId, sentByUser = 'user' }) => {
  const result = await tryCatchAsync(async () => {
    const res = await axios.post('/api/postMessage', { threadId, userId, text, sentByUser })
    return res?.data
  }, e => e?.response?.data?.error || e?.message)
  return result
}

// POST Messages - Function to post Messsages for the user and AI for the thread that is currently active AND return a value
export const addMessageAndResponse = async ({ userId, threadId, userText, AIText }) => {
  const result = await tryCatchAsync(async () => {
    const res = await axios.post('/api/postMessageAndResponse', { userId, threadId, userText, AIText })
    return res?.data
  }, e => e?.response?.data?.error || e?.message)
  return result
}

// POST Thread - Function to post generated the new thread AND then addMessage following the creation AND returns threadId 
export const postThread = async ({ userId, threadName }) => {
  const result = await tryCatchAsync(async () => {
    const res = await axios.post('/api/postThread', { userId, threadName })
    return res?.data
  }, e => e?.response?.data?.error || e?.message)
  return result
}

// PATCH Temperature - Function to update Temperature for the thread that is currently active AND return a value
export const patchTemperature = async ({ userId, threadId, newTemperature }) => {
  const result = await tryCatchAsync(async () => {
    const res = await axios.patch('/api/patchTemperature', { userId, threadId, newTemperature })
    return res?.data
  }, e => e?.response?.data?.error || e?.message)
  return result
}

// PATCH TypingSpeed - Function to update Typing Speed for the thread that is currently active AND return a value
export const patchTypingSpeed = async ({ userId, threadId, newTypingSpeed }) => {
  const result = await tryCatchAsync(async () => {
    const res = await axios.patch('/api/patchTypingSpeed', { userId, threadId, newTypingSpeed })
    return res?.data
  }, e => e?.response?.data?.error || e?.message)
  return result
}

// DELETE Threads - Function to delete thread and associated messages AND return a value
export const deleteThread = async ({ userId, threadId }) => {
  const result = await tryCatchAsync(async () => {
    const res = await axios.delete('/api/deleteThread', { data: { userId, threadId } })
    return res?.data
  }, e => e?.response?.data?.error || e?.message)
  return result
}