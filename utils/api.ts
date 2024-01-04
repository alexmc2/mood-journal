const createURL = (path) => window.location.origin + path;

export const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const deleteEntry = async (id: any) => {
  const res = await fetch(
    new Request(createURL(`/api/journal/${id}`), {
      method: 'DELETE',
    })
  );

  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Something went wrong on API server!');
  }
};

export const updateEntry = async (id, content) => {
  const res = await fetch(
    new Request(createURL(`/api/journal/${id}`), {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    })
  );

  if (res.ok) {
    const data = await res.json();
    return data.data;
  }
};

export const newEntry = async () => {
  const res = await fetch(
    new Request(createURL(`/api/journal`), {
      method: 'POST',
    })
  );

  if (res.ok) {
    const data = await res.json();
    return data.data;
  }
};

export const fetchEntry = async (id) => {
  const res = await fetch(createURL(`/api/journal/${id}`));
  if (res.ok) {
    const data = await res.json();
    return data.data;
  } else {
    throw new Error('Failed to fetch entry');
  }
};

export const newChat = async (chatId, newMessage) => {
  try {
    const res = await fetch(
      new Request(createURL(`/api/chat/`), {
        method: 'POST',
        body: JSON.stringify({ chatId, newMessage }),
      })
    );

    if (res.ok) {
      const jsonResponse = await res.json();
      if (!jsonResponse.data) {
        throw new Error('Response data is missing');
      }
      return jsonResponse;
    } else {
      throw new Error('API response not OK');
    }
  } catch (error) {
    console.error('Error in newChat:', error);
    throw error; // Re-throw the error for the caller to handle
  }
};

// Function to fetch all chats for the logged-in user
export const fetchAllChats = async () => {
  try {
    const res = await fetch(createURL(`/api/chat`));

    if (res.ok) {
      const jsonResponse = await res.json();
      return jsonResponse.chats;
    } else {
      throw new Error('Failed to fetch chats');
    }
  } catch (error) {
    console.error('Error in fetchAllChats:', error);
    throw error;
  }
};


export const fetchChat = async (chatId) => {
  const res = await fetch(createURL(`/api/chat/${chatId}`));
  if (res.ok) {
    const data = await res.json();
    return data.data;
  } else {
    throw new Error('Failed to fetch chat');
  }
};


// Function to post a new message to a specific chat
export const postMessageToChat = async (chatId, newMessage) => {
  try {
    const res = await fetch(
      new Request(createURL(`/api/chat/${chatId}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newMessage }),
      })
    );

    if (res.ok) {
      const jsonResponse = await res.json();
      return jsonResponse;
    } else {
      throw new Error('Failed to post message to chat');
    }
  } catch (error) {
    console.error('Error in postMessageToChat:', error);
    throw error;
  }
};

// Function to delete a specific chat
export const deleteChat = async (chatId) => {
  try {
    const res = await fetch(
      new Request(createURL(`/api/chat/${chatId}`), {
        method: 'DELETE',
      })
    );

    if (res.ok) {
      return res.json();
    } else {
      throw new Error('Failed to delete chat');
    }
  } catch (error) {
    console.error('Error in deleteChat:', error);
    throw error;
  }
};
