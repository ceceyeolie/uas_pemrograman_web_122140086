import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/3">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Articles</h2>
            <div className="space-y-2">
              <Link to="/admin/artikel" className="block text-blue-600">
                Manage Articles
              </Link>
              <Link to="/admin/artikel/create" className="block text-blue-600">
                Create New Article
              </Link>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/3">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            <div className="space-y-2">
              <Link to="/admin/kategori" className="block text-blue-600">
                Manage Categories
              </Link>
              <Link to="/admin/kategori/create" className="block text-blue-600">
                Create New Category
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}