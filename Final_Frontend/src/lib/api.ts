// A simple API client that automatically adds the auth token to requests.
export const apiClient = {
  get: async (url: string) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  post: async (url: string, body: any) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },
  // You can add put, delete, etc. methods here as well
  put: async (url: string, body: any) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  delete: async (url: string) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Network response was not ok');
    // Delete might not return a body, so we just check the status
    return response;
  },
};

