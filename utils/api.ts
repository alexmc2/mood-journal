

import axios from 'axios';

const createURL = (path: string) => `${window.location.origin}${path}`;

// Fetch a journal entry
export const fetchEntry = async (id: string) => {
  try {
    const response = await axios.get(createURL(`/api/journal/${id}`));
    return response.data.data;
  } catch (error) {
    console.error('Error in fetchEntry:', error);
    throw error;
  }
};

// Delete a journal entry
export const deleteEntry = async (id: string) => {
  try {
    const response = await axios.delete(createURL(`/api/journal/${id}`));
    return response.data;
  } catch (error) {
    console.error('Error in deleteEntry:', error);
    throw error;
  }
};

// Update a journal entry
export const updateEntry = async (id: string, content: string) => {
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

// // Update a journal entry
// export const updateAutosaveEntry = async (id: any, content: any) => {
//   try {
//     const response = await axios.patch(createURL(`/api/journal/${id}`), {
//       content,
//     });
//     return response.data.data;
//   } catch (error) {
//     console.error('Error in updateEntry:', error);
//     throw error;
//   }
// };

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
export const fetchChat = async (chatId: any) => {
  try {
    const response = await axios.get(createURL(`/api/chat/${chatId}`));
    return response.data.data;
  } catch (error) {
    console.error('Error in fetchChat:', error);
    throw error;
  }
};

// Post a new message to a specific chat
export const postMessageToChat = async (chatId: any, newMessage: any) => {
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
export const newChat = async (chatId: any, newMessage: any) => {
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
export const deleteChat = async (chatId: string) => {
  try {
    const response = await axios.delete(createURL(`/api/chat/${chatId}`));
    return response.data;
  } catch (error) {
    console.error('Error in deleteChat:', error);
    throw error;
  }
};
