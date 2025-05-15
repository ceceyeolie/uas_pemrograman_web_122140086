import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { artikelApi } from '../../api/artikelApi';
import { kategoriApi } from '../../api/kategoriApi';

export default function ArticleFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    judul: '',
    konten: '',
    penulis: '', 
    kategori_id: '',
    status: 'draft',
    tanggal_publikasi: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const isEdit = Boolean(id);
  
useEffect(() => {
  const fetchData = async () => {
    if (id) {
      const article = await artikelApi.getById(id);
      setFormData(article);
    }
    
    // ✅ Extract data from API response
    const kategoriList = await kategoriApi.getAll();
    setCategories(kategoriList.data || []); // Safeguard with fallback
  };
  
  fetchData();
}, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setSubmitting(true); // Mulai proses submit
    const dataToSend = {
      judul: formData.judul,
      konten: formData.konten,
      penulis: formData.penulis,
      kategori_id: formData.kategori_id,
      status: formData.status,
      tanggal_publikasi: formData.tanggal_publikasi,
    };

    if (id) {
      await artikelApi.update(id, dataToSend);
    } else {
      await artikelApi.create(dataToSend);
    }
    navigate('/admin/artikel');
  } catch (error) {
    setErrors({ form: error.message });
  } finally {
    setSubmitting(false); // Proses submit selesai
  }
};

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {id ? 'Edit' : 'Create'} Article
      </h1>
      
      {errors.form && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
          {errors.form}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-6 rounded-lg shadow-md">
        {/* Form fields */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="judul">Title*</label>
          <input
            type="text"
            id="judul"
            name="judul"
            value={formData.judul}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="konten">Content*</label>
          <textarea
            id="konten"
            name="konten"
            value={formData.konten}
            onChange={handleChange}
            rows={6}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="penulis">Penulis*</label>
          <input
            type="text"
            id="penulis"
            name="penulis"
            value={formData.penulis}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="kategori_id">Category*</label>
          <select
            id="kategori_id"
            name="kategori_id"
            value={formData.kategori_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.nama}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="tanggal_publikasi">Publication Date</label>
          <input
            type="date"
            id="tanggal_publikasi"
            name="tanggal_publikasi"
            value={formData.tanggal_publikasi}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
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
              onClick={() => navigate('/admin/artikel')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
      </form>
    </div>
  );
}