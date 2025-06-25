import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/axios';
import { Loader2, Edit } from 'lucide-react';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await API.get(`/posts/${id}`);
        setForm({
          title: res.data.title,
          content: res.data.content,
        });
      } catch (err) {
        console.log(err)
        setError('Post not found');
        setTimeout(() => navigate('/'), 1500);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      setError('Title and content are required!');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await API.put(`/posts/${id}`, form); // Send JSON payload
      setSuccess('Post updated successfully!');
      setTimeout(() => navigate(`/posts/${id}`), 1500);
    } catch (err) {
      setError(err.response?.data?.msg || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-3xl bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl transition-all duration-300">
        <h2 className="text-3xl font-bold text-white mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Edit Post
        </h2>
        {error && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-6 text-center animate-fade-in">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 text-green-300 p-3 rounded-lg mb-6 text-center animate-fade-in">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-2">
              Post Title
            </label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Update your post title"
              className="w-full px-4 py-3 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
              required
              aria-describedby="title-error"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-200 mb-2">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Update your thoughts here..."
              rows={8}
              className="w-full px-4 py-3 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400 resize-none"
              required
              aria-describedby="content-error"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Edit className="w-5 h-5" />
                Update Post
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}