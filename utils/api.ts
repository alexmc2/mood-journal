

import axios from 'axios';

const createURL = (path) => `${window.location.origin}${path}`;

// Fetch a journal entry
export const fetchEntry = async (id) => {
  try {
    const response = await axios.get(createURL(`/api/journal/${id}`));
    return response.data.data;
  } catch (error) {
    console.error('Error in fetchEntry:', error);
    throw error;
  }
};

// Delete a journal entry
export const deleteEntry = async (id) => {
  try {
    const response = await axios.delete(createURL(`/api/journal/${id}`));
    return response.data;
  } catch (error) {
    console.error('Error in deleteEntry:', error);
    throw error;
  }
};

// Update a journal entry
export const updateEntry = async (id, content) => {
  try {
    const response = await axios.patch(createURL(`/api/journal/${id}`), {
      content,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error in updateEntry:', error);
    throw error;
  }
};

// Update a journal entry
export const updateAutosaveEntry = async (id, content) => {
  try {
    const response = await axios.patch(createURL(`/api/journal/${id}`), {
      content,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error in updateEntry:', error);
    throw error;
  }
};

// Create a new journal entry
export const newEntry = async () => {
  try {
    const response = await axios.post(createURL('/api/journal'));
    return response.data.data;
  } catch (error) {
    console.error('Error in newEntry:', error);
    throw error;
  }
};

// Fetch all chats
export const fetchAllChats = async () => {
  try {
    const response = await axios.get(createURL('/api/chat'));
    return response.data.chats;
  } catch (error) {
    console.error('Error in fetchAllChats:', error);
    throw error;
  }
};

// Fetch a specific chat by ID
export const fetchChat = async (chatId) => {
  try {
    const response = await axios.get(createURL(`/api/chat/${chatId}`));
    return response.data.data;
  } catch (error) {
    console.error('Error in fetchChat:', error);
    throw error;
  }
};

// Post a new message to a specific chat
export const postMessageToChat = async (chatId, newMessage) => {
  try {
    const response = await axios.post(createURL(`/api/chat/${chatId}`), {
      newMessage,
    });
    return response.data;
  } catch (error) {
    console.error('Error in postMessageToChat:', error);
    throw error;
  }
};

// Create a new chat
export const newChat = async (chatId, newMessage) => {
  try {
    const response = await axios.post(createURL('/api/chat/'), {
      chatId,
      newMessage,
    });
    return response.data;
  } catch (error) {
    console.error('Error in newChat:', error);
    throw error;
  }
};

// Delete a specific chat
export const deleteChat = async (chatId) => {
  try {
    const response = await axios.delete(createURL(`/api/chat/${chatId}`));
    return response.data;
  } catch (error) {
    console.error('Error in deleteChat:', error);
    throw error;
  }
};
