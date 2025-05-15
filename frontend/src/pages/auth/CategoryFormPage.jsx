// src/pages/CategoryFormPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { kategoriApi } from '../../api/kategoriApi';

const CategoryFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: ''
  });
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await kategoriApi.getById(id);
        setFormData(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    
    if (isEdit) fetchCategory();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation errors on edit
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const validationErrors = {};
    
    if (!formData.nama) {
      validationErrors.nama = 'Category name is required';
    } else if (formData.nama.length < 2) {
      validationErrors.nama = 'Name must be at least 2 characters';
    } else if (formData.nama.length > 100) {
      validationErrors.nama = 'Name must be at most 100 characters';
    }
    
    if (formData.deskripsi && formData.deskripsi.length > 500) {
      validationErrors.deskripsi = 'Description must be at most 500 characters';
    }
    
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form
      if (!validate()) return;

      const dataToSend = {
        nama: formData.nama,
        deskripsi: formData.deskripsi,
      };

      setSubmitting(true);
      if (id) {
        await kategoriApi.update(id, dataToSend);
      } else {
        await kategoriApi.create(dataToSend);
      }
      navigate("/admin/kategori");
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? 'Edit' : 'Create'} Category
      </h1>
      
      {errors.form && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {errors.form}
        </div>
      )}
      
      <div className="max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nama">
              Category Name*
            </label>
            <input
              id="nama"
              name="nama"
              type="text"
              value={formData.nama}
              onChange={handleChange}
              className={`w-full p-3 border rounded ${errors.nama ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.nama && (
              <p className="text-red-500 text-sm mt-1">{errors.nama}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deskripsi">
              Description
            </label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded"
            />
            {errors.deskripsi && (
              <p className="text-red-500 text-sm mt-1">{errors.deskripsi}</p>
            )}
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={submitting}
              className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${
                submitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Saving...' : isEdit ? 'Save' : 'Create'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/admin/kategori')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormPage;