// src/api/kategoriApi.js
const API_BASE_URL = 'http://localhost:6543/api/v1';

export const kategoriApi = {
  async getAll(params = {}) {
    const url = new URL(`${API_BASE_URL}/kategori`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json(); // ✅ Returns { data, meta }
  },
    
  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/kategori/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch category ${id}`);
    return response.json();
  },
  
  async create(category) {
    const response = await fetch(`${API_BASE_URL}/kategori`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors || 'Failed to create category');
    }
    
    return response.json();
  },
  
  async update(id, categoryUpdate) {
    const response = await fetch(`${API_BASE_URL}/kategori/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryUpdate)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors || `Failed to update category ${id}`);
    }
    
    return response.json();
  },
  
  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/kategori/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors || `Failed to delete category ${id}`);
    }
  }
};