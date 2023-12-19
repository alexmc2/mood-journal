const createURL = (path) => window.location.origin + path;

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

export const askQuestion = async (question: string) => {
  try {
    const res = await fetch(
      new Request(createURL(`/api/question`), {
        method: 'POST',
        body: JSON.stringify({ question }),
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
    console.error('Error in askQuestion:', error);
    throw error; // Re-throw the error for the caller to handle
  }
};
