// src/pages/CategoryListPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { kategoriApi } from '../../api/kategoriApi';
import { toast } from 'react-toastify';
import Pagination from '../../components/Pagination';

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await kategoriApi.getAll({
          page: currentPage,
          per_page: 15
        });
        
        // ✅ Extract data from paginated response
        setCategories(response.data || []); 
        setTotalPages(response.meta?.total_pages || 1);
      } catch (error) {
        toast.error('Failed to load categories');
        setCategories([]); // ✅ Fallback to empty array
      }
    };
    
    fetchCategories();
  }, [currentPage]);

  const handleDelete = async (id) => {
    try {
      await kategoriApi.delete(id);
      setCategories(categories.filter(cat => cat.id !== id));
      toast.success('Category deleted');
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>
      
      <button 
        type="button"
        onClick={() => navigate('/admin/kategori/create')}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Create New Category
      </button>
      
      <table className="w-full text-left border-collapse">
        {/* Table headers remain unchanged */}
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        
        {/* Table body remains unchanged */}
        <tbody>
          {categories.map(category => (
            <tr key={category.id} className="border-b">
              <td className="px-4 py-3">
                <Link 
                  to={`/admin/kategori/${category.id}/edit`} 
                  className="text-blue-600 hover:underline"
                >
                  {category.nama}
                </Link>
              </td>
               <td className="px-4 py-3">{category.deskripsi}</td>
              <td className="px-4 py-3">
                <button 
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default CategoryListPage;