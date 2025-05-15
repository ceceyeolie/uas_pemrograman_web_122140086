export const validateArticle = (data) => {
  const errors = {};
  
  if (!data.judul) errors.judul = 'Title is required';
  if (data.judul.length < 2) errors.judul = 'Title must be at least 2 characters';
  
  if (!data.konten) errors.konten = 'Content is required';
  if (data.konten.length < 100) errors.konten = 'Content must be at least 100 characters';
  
  if (!data.kategori_id) errors.kategori_id = 'Category is required';
  
  return errors;
};