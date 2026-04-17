
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Artificial delay for better UX
    await new Promise(r => setTimeout(r, 800));
    
    if (login(email, password)) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 mb-4">
            <span className="text-3xl font-black">P</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800">Admin Central</h2>
          <p className="text-slate-500 font-medium">Pharmacy Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pharmaquick.com"
                className="w-full bg-slate-50 border-0 h-12 pl-12 pr-4 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border-0 h-12 pl-12 pr-4 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-slate-700"
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-xs font-bold text-center"
            >
              {error}
            </motion.p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white h-12 rounded-xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Login to Dashboard'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
           <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Notice</p>
              <p className="text-xs text-blue-800 font-semibold leading-relaxed">
                This is a secure area. All actions are logged. Unauthorized access is strictly prohibited.
              </p>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
