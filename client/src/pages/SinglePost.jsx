import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { Trash, Edit, Loader2 } from 'lucide-react';

export default function SinglePost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await API.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        setError(err.response?.data?.status || 'Failed to load post. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await API.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Post deleted successfully! Redirecting...');
      setTimeout(() => navigate('/', { replace: true }), 1500);
    } catch (err) {
      setError(err.response?.data?.msg || 'Delete failed. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-2 animate-pulse">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          <span>Loading post...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-white p-4">
        <div className="max-w-md bg-red-500/20 text-red-300 p-4 rounded-lg text-center animate-fade-in">
          {error}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-white p-4">
        <div className="max-w-md bg-gray-700/20 text-gray-300 p-4 rounded-lg text-center animate-fade-in">
          Post not found.
        </div>
      </div>
    );
  }

  const isAuthor = token && post.author?._id === JSON.parse(atob(token.split('.')[1])).id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl space-y-6 animate-fade-in">
        {/* Feedback Messages */}
        {success && (
          <div className="bg-green-500/20 text-green-300 p-3 rounded-lg text-center animate-fade-in">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-center animate-fade-in">
            {error}
          </div>
        )}

        {/* Post Content */}
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
            loading="lazy"
          />
        )}
        <h1 className="text-4xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          {post.title}
        </h1>
        <p className="text-sm text-gray-300">
          By{' '}
          <span className="font-medium">{post.author?.username || 'Unknown'}</span>
        </p>
        <p className="mt-4 text-gray-200 whitespace-pre-line leading-relaxed">
          {post.content}
        </p>

        {/* Author Actions */}
        {isAuthor && (
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate(`/edit/${post._id}`)}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
              aria-label="Edit post"
            >
              <Edit className="w-5 h-5" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
              aria-label="Delete post"
            >
              <Trash className="w-5 h-5" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}