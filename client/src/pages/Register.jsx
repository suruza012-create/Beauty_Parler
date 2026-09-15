import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <form 
        onSubmit={(e) => { 
          e.preventDefault();
          setError('');
          setLoading(true);
          register(form)
            .then(() => navigate('/dashboard'))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
        }} 
        className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full space-y-4 border border-purple-100"
      >
        <h2 className="text-2xl font-black text-slate-900 text-center">Register Account</h2>
        <input 
          type="text" 
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-3 bg-slate-50 border rounded-2xl text-xs font-bold focus:outline-none focus:border-purple-600" 
          required 
        />
        <input 
          type="email" 
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-3 bg-slate-50 border rounded-2xl text-xs font-bold focus:outline-none focus:border-purple-600" 
          required 
        />
        <input 
          type="password" 
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-3 bg-slate-50 border rounded-2xl text-xs font-bold focus:outline-none focus:border-purple-600" 
          required 
        />
        <button 
          type="submit" 
          className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer"
        >
          {loading ? 'Creating...' : 'Create Account'}
        </button>
        {error && <p className="text-xs text-center text-rose-600 font-bold">{error}</p>}
        <p className="text-[11px] text-center text-slate-500">
          Already registered? <Link to="/login" className="text-purple-700 font-bold hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;