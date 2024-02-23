const createURL = (path: string) => `${window.location.origin}${path}`;

// Fetch a journal entry
export const fetchEntry = async (id: string) => {
  try {
    const response = await fetch(createURL(`/api/journal/${id}`));
    if (!response.ok) {
      throw new Error('Failed to fetch journal entry');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error in fetchEntry:', error);
    throw error;
  }
};

// Delete a journal entry
export const deleteEntry = async (id: string) => {
  try {
    const response = await fetch(createURL(`/api/journal/${id}`), {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete journal entry');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in deleteEntry:', error);
    throw error;
  }
};

// Update a journal entry
export const updateEntry = async (id: string, content: string) => {
  try {
    const response = await fetch(createURL(`/api/journal/${id}`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) {
      throw new Error('Failed to update journal entry');
    }
    const data = await response.json();
    return data.data;
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
    const response = await fetch(createURL('/api/journal'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: 'Write about your day...' }),
    });

    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error('Error in newEntry:', error);
    throw error;
  }
};

// Fetch all chats
export const fetchAllChats = async () => {
  try {
    const response = await fetch(createURL('/api/chat'));
    if (!response.ok) {
      throw new Error('Failed to fetch all chats');
    }
    const data = await response.json();
    return data.chats;
  } catch (error) {
    console.error('Error in fetchAllChats:', error);
    throw error;
  }
};

// Fetch a specific chat by ID
export const fetchChat = async (chatId: any) => {
  try {
    const response = await fetch(createURL(`/api/chat/${chatId}`));
    if (!response.ok) {
      throw new Error('Failed to fetch chat');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error in fetchChat:', error);
    throw error;
  }
};

// Post a new message to a specific chat
export const postMessageToChat = async (chatId: any, newMessage: any) => {
  try {
    const response = await fetch(createURL(`/api/chat/${chatId}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newMessage }),
    });
    if (!response.ok) {
      throw new Error('Failed to post message to chat');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in postMessageToChat:', error);
    throw error;
  }
};

// Create a new chat
export const newChat = async (chatId: any, newMessage: any) => {
  try {
    const response = await fetch(createURL('/api/chat'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatId, newMessage }),
    });
    if (!response.ok) {
      throw new Error('Failed to create new chat');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in newChat:', error);
    throw error;
  }
};
// Delete a specific chat
export const deleteChat = async (chatId: string) => {
  try {
    const response = await fetch(createURL(`/api/chat/${chatId}`), {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete chat');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in deleteChat:', error);
    throw error;
  }
};
