// src/pages/ArticleListPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { artikelApi } from '../../api/artikelApi';
import { toast } from 'react-toastify';
import Pagination from '../../components/Pagination'; // Import the Pagination component

const ArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // ✅ Add pagination parameters
        const response = await artikelApi.getAll({
          page: currentPage,
          per_page: 10 // 15 items per page for admin
        });
        
        setArticles(response.data);
        setTotalPages(response.meta.total_pages);
      } catch (error) {
        toast.error('Failed to load articles');
      }
    };
    
    fetchArticles();
  }, [currentPage]);

  const handleDelete = async (id) => {
    try {
      await artikelApi.delete(id);
      setArticles(articles.filter(article => article.id !== id));
      toast.success('Article deleted');
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Articles</h1>
      
      <button 
        type="button"
        onClick={() => navigate('/admin/artikel/create')}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Create New Article
      </button>
      
      <table className="w-full text-left border-collapse">
        {/* Table headers remain unchanged */}
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Author</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        
        {/* Table body remains unchanged */}
        <tbody>
          {articles.map(article => (
            <tr key={article.id} className="border-b">
              <td className="px-4 py-3">
                <Link 
                  to={`/admin/artikel/${article.id}/edit`} 
                  className="text-blue-600 hover:underline"
                >
                  {article.judul}
                </Link>
              </td>
              <td className="px-4 py-3">{article.penulis}</td>
              <td className="px-4 py-3">
                <span 
                  className={`px-2 py-1 rounded text-sm ${
                    article.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {article.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <button 
                  onClick={() => handleDelete(article.id)}
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

export default ArticleListPage;