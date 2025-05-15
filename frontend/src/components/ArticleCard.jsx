import { Link } from 'react-router-dom';

export default function ArticleCard({ article }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <span className="text-sm text-gray-500">{article.penulis}</span>
        <h3 className="font-bold text-lg mt-1">{article.judul}</h3>
        <p className="text-gray-600 mt-2 line-clamp-3">
          {article.konten}
        </p>
        <div className="mt-3 flex justify-between items-center">
          <Link to={`/artikel/${article.id}`} className="text-blue-600 hover:underline">
            Read more
          </Link>
          <span className={`text-xs px-2 py-1 rounded ${
            article.status === 'published' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {article.status}
          </span>
        </div>
      </div>
    </div>
  );
}