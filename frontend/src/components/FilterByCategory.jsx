// src/components/FilterByCategory.jsx
import { useState } from 'react';

export default function FilterByCategory({ categories = [], activeCategory, onSelectCategory }) {
  const handleChange = (e) => {
    const categoryId = e.target.value === "" ? "" : Number(e.target.value);
    onSelectCategory(categoryId);
  };

  return (
    <select
      value={activeCategory || ""}
      onChange={handleChange}
      className="w-full p-2 border border-gray-300 rounded-md"
    >
      <option value="">All Categories</option>
      {categories.map(category => (  // ✅ Safe to map
        <option key={category.id} value={category.id}>
          {category.nama}
        </option>
      ))}
    </select>
  );
}