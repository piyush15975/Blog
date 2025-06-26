import { useState, useEffect } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/axios';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/';
    }
  },);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Username and password are required!');
      return;
    }
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-300 mt-2">Log in to your account</p>
        </div>

        {/* Feedback Messages */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-2">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter your username"
              className={`w-full px-4 py-3 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 border transition-all duration-200 outline-none ${
                focusedField === 'username'
                  ? 'border-blue-500 focus:ring-2 focus:ring-blue-500'
                  : 'border-gray-600 hover:border-blue-400'
              }`}
              required
              aria-describedby="username-error"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 pr-12 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 border transition-all duration-200 outline-none ${
                  focusedField === 'password'
                    ? 'border-blue-500 focus:ring-2 focus:ring-blue-500'
                    : 'border-gray-600 hover:border-blue-400'
                }`}
                required
                aria-describedby="password-error"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105"
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Login
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-300">
            Don’t have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-400 font-medium hover:text-blue-300 transition-colors duration-200"
              aria-label="Navigate to register page"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}