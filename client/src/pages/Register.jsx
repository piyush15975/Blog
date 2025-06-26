import { useState, useEffect } from 'react';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/axios';
import { Loader2 } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.username || !form.password) {
      setError('All fields are required!');
      return;
    }
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await API.post('/auth/register', form);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1000); // redirect to login
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl transition-all duration-300">
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Create Account
          </h1>
          <p className="text-sm text-gray-300 mt-2">Join the blog platform</p>
        </div>

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
          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            focusedField={focusedField}
            setFocusedField={setFocusedField}
          />
          <Input
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Choose a username"
            focusedField={focusedField}
            setFocusedField={setFocusedField}
          />
          <PasswordInput
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a password"
            show={showPassword}
            toggle={() => setShowPassword(!showPassword)}
            focusedField={focusedField}
            setFocusedField={setFocusedField}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105"
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Register
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-400 font-medium hover:text-blue-300 transition-colors duration-200"
            aria-label="Navigate to login page"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, placeholder, focusedField, setFocusedField }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-200 mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocusedField(name)}
        onBlur={() => setFocusedField(null)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 border transition-all duration-200 outline-none ${
          focusedField === name
            ? 'border-blue-500 focus:ring-2 focus:ring-blue-500'
            : 'border-gray-600 hover:border-blue-400'
        }`}
        required
        aria-describedby={`${name}-error`}
      />
    </div>
  );
}

function PasswordInput({ label, name, value, onChange, placeholder, show, toggle, focusedField, setFocusedField }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-200 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocusedField(name)}
          onBlur={() => setFocusedField(null)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 pr-12 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 border transition-all duration-200 outline-none ${
            focusedField === name
              ? 'border-blue-500 focus:ring-2 focus:ring-blue-500'
              : 'border-gray-600 hover:border-blue-400'
          }`}
          required
          aria-describedby={`${name}-error`}
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
