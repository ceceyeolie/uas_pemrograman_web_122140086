
const API_BASE_URL = 'http://localhost:6543/api/v1';

export const artikelApi = {
  async getAll(params = {}) {
    const url = new URL(`${API_BASE_URL}/artikel`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const response = await fetch(url.toString(), {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to fetch articles');
    return response.json();
  },
  
  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/artikel/${id}`);
    if (!response.ok) throw new Error('Article not found');
    return response.json();
  },

  async create(data) {
    const response = await fetch(`${API_BASE_URL}/artikel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Failed to create article');
    return response.json();
  },

  async update(id, data) {
    const response = await fetch(`${API_BASE_URL}/artikel/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Failed to update article');
    return response.json();
  },

async delete(id) {
    const response = await fetch(`${API_BASE_URL}/artikel/${id}`, {
      method: 'DELETE'
    });
    if (response.status === 204) return; // Handle 204 No Content
    if (!response.ok) throw new Error('Failed to delete article');
    return response.json();
  },

  async search(query) {
    const url = new URL(`${API_BASE_URL}/artikel`);
    if (query) url.searchParams.append('q', query);
    
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to search articles');
    return response.json();
  }
};