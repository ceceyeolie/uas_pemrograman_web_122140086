import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { artikelApi } from '../api/artikelApi';
import { useSelector } from 'react-redux';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await artikelApi.getById(id);
        setArticle(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load article');
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  // Hide drafts for non-admin users
  useEffect(() => {
    if (article && article.status === 'draft' && !isAuthenticated) {
      navigate('/');
      setError('Article not found');
    }
  }, [article, isAuthenticated, navigate]);

  // Function to format content with proper paragraph breaks
  const formatContent = (content) => {
    if (!content) return '';
    
    // Split by paragraphs and render them properly
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4">
        {paragraph.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < paragraph.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    ));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!article) return <div>Article not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{article.judul}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <span>{article.penulis}</span>
            <span className="mx-2">•</span>
            <span>{new Date(article.tanggal_publikasi).toLocaleDateString()}</span>
          </div>
          
          <div className="prose max-w-none mb-6 leading-relaxed">
            {formatContent(article.konten)}
          </div>
          
          <div className="flex justify-between items-center">
            <Link 
              to="/" 
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Home
            </Link>
            <div className={`px-4 py-1 rounded-full text-sm ${
              article.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {article.status}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;