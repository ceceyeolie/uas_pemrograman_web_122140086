// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import ArticleCard from '../components/ArticleCard';
import SearchBar from '../components/SearchBar';
import FilterByCategory from '../components/FilterByCategory';
import Pagination from '../components/Pagination';
import { artikelApi } from '../api/artikelApi';
import { kategoriApi } from '../api/kategoriApi';

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // ✅ Correctly declared

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    const params = {
      status: 'published',
      page: currentPage,       
      per_page: 8             
    };
    
    if (activeCategory) params.kategori_id = activeCategory;
    if (searchQuery) params.q = searchQuery;

    try {
      const [articlesData, categoriesData] = await Promise.all([
        artikelApi.getAll(params),
        kategoriApi.getAll()
      ]);

      setArticles(articlesData.data || []);
      setCategories(categoriesData.data || []);
      setTotalPages(articlesData.meta?.total_pages || 1); // ✅ Get total_pages from backend
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [activeCategory, searchQuery, currentPage]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* SearchBar and FilterByCategory side by side */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <FilterByCategory
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>
        <div className="flex-5">
          <SearchBar onSearch={setSearchQuery} />
        </div>
      </div>

      {/* Latest News heading */}
      <h1 className="text-2xl font-bold mb-6">Latest News</h1>

      {/* Article cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            {searchQuery ? 'No articles found' : 'No articles available'}
          </div>
        ) : (
          articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;