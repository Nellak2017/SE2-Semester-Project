// This file contains all the API functions
// The API functions have a side-effect involving the database and return a value

import axios from 'axios'

// GET Threads - Function to get all the Threads for the user
export async function getThreads(userID) {
  try {
    const response = await axios.get('/api/getThreads', { params: { userID } })
    return response.data
  } catch (e) {
    console.error('Error fetching threads:', e)
    throw e
  }
}

// GET Messages - Function to get Messages
export async function getMessages(userID, threadID) { // min = 0, max = step
  try {
    const response = await axios.get('/api/getMessages', { params: { userID: userID, threadID: threadID } })
    return response.data
  } catch (e) {
    console.error('Error fetching messages:', e)
    throw e
  }
}

// POST Message - Function to post Messsage for the user and thread that is currently active AND return a value
export async function addMessage(text, userID, threadID, sentByUser = 0) {
  try {
    const response = await axios.post('/api/postMessage', {
      threadID: threadID,
      userID: userID,
      text: text,
      sentByUser: sentByUser
    })
    return response.data
  } catch (e) {
    console.error('Error adding message:', e)
    throw e
  }
}

// POST Thread - Function to post generated the new thread AND then addMessage following the creation AND returns ThreadID 
export async function postThread(userID, threadName) {
  try {
    const response = await axios.post('/api/postThread', {
      userID: userID,
      threadName: threadName,
    })
    return response.data.newThreadID
  } catch (e) {
    console.error('Error adding message:', e)
    throw e
  }
}

// PATCH Temperature - Function to update Temperature for the thread that is currently active AND return a value
export async function patchTemperature(userID, threadID, newTemperature) {
  try {
    const response = await axios.patch('/api/patchTemperature', {
      userID: userID,
      threadID: threadID,
      newTemperature: newTemperature,
    })
    return response.data
  } catch (e) {
    console.error('Error updating temperature:', e)
    throw e
  }
}

// PATCH TypingSpeed - Function to update Typing Speed for the thread that is currently active AND return a value
export async function patchTypingSpeed(userID, threadID, newTypingSpeed) {
  try {
    const response = await axios.patch('/api/patchTypingSpeed', {
      userID: userID,
      threadID: threadID,
      newTypingSpeed: newTypingSpeed,
    })
    return response.data
  } catch (e) {
    console.error('Error updating typing speed:', e)
    throw e
  }
}

// DELETE Threads - Function to delete thread and associated messages AND return a value
export async function deleteThread(userID, threadID) {
  try {
    const response = await axios.delete('/api/deleteThread', {
      data: {
        userID: userID,
        threadID: threadID,
      },
    })
    return response.data
  } catch (e) {
    console.error('Error deleting thread: ', e)
    throw e
  }
}