import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, LogOut, LogIn, UserPlus, Plus } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await API.get('/posts', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setPosts(res.data || []);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, [token, location.key]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-4 sm:px-6 lg:px-10">
      <header className="flex flex-col sm:flex-row items-center justify-between mb-10 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4 sm:mb-0">
          Latest Posts
        </h1>
        <nav className="flex flex-col sm:flex-row gap-3">
          {token ? (
            <>
              <button
                onClick={() => navigate('/create')}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
                aria-label="Create a new post"
              >
                <Plus className="w-5 h-5" />
                Create Post
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
                aria-label="Login"
              >
                <LogIn className="w-5 h-5" />
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-5 py-2.5 bg-gray-700 text-white border border-gray-500 rounded-lg hover:bg-gray-600 hover:border-gray-400 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
                aria-label="Sign up"
              >
                <UserPlus className="w-5 h-5" />
                Signup
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            <p className="text-gray-400 mt-2">Loading posts...</p>
          </div>
        ) : error ? (
          <p className="col-span-full text-center text-red-400 bg-red-500/20 p-4 rounded-lg animate-fade-in">
            {error}
          </p>
        ) : posts.length === 0 ? (
          <p className="col-span-full text-center text-gray-400 bg-gray-700/20 p-4 rounded-lg animate-fade-in">
            No posts yet. Be the first to share!
          </p>
        ) : (
          posts.map((post, index) => (
            <Link
              to={`/posts/${post._id}`}
              key={post._id}
              className="bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              aria-label={`View post: ${post.title}`}
            >
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-5">
                <h2 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-300 mb-3 line-clamp-3">
                  {post.content}
                </p>
                <p className="text-xs text-gray-500">
                  By {post.author?.username || 'Unknown'}
                </p>
              </div>
            </Link>
          ))
        )}
      </main>
    </div>
  );
}