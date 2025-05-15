// src/api/authApi.js
const API_BASE_URL = 'http://localhost:6543/api/v1';

export const authApi = {
  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials),
      credentials: 'include' // ✅ Add this
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Invalid email or password. Please try again.');
    }
    const data = await response.json();
    return data;
  }
};