
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
  Calendar,
  Zap,
  Bell,
  Briefcase,
  Store,
  Wallet,
  Settings,
  Globe,
  ShieldCheck,
  ShoppingCart
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { api } from '../services/api';

const SALES_DATA = [
  { name: 'Mon', sales: 4000, orders: 24 },
  { name: 'Tue', sales: 3000, orders: 13 },
  { name: 'Wed', sales: 2000, orders: 98 },
  { name: 'Thu', sales: 2780, orders: 39 },
  { name: 'Fri', sales: 1890, orders: 48 },
  { name: 'Sat', sales: 2390, orders: 38 },
  { name: 'Sun', sales: 3490, orders: 43 },
];

export function AdminDashboard() {
  const [filter, setFilter] = useState('Monthly');
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.getStats().then(setData).catch(console.error);
  }, []);

  const stats = [
    { label: 'Total Products', val: data?.totalProducts || '0', change: '+12%', icon: <Package size={24} />, color: 'blue' },
    { label: 'Total Orders', val: data?.totalOrders || '0', change: '+24%', icon: <ShoppingBag size={24} />, color: 'emerald' },
    { label: 'Total Customers', val: data?.totalCustomers || '0', change: '+8%', icon: <Users size={24} />, color: 'violet' },
    { label: 'Pending Orders', val: data?.pendingOrders || '0', change: '-5%', icon: <Clock size={24} />, color: 'amber' },
  ];

  const quickControls = [
    { label: 'POS Terminal', path: '/admin/pos', icon: <ShoppingCart size={20} />, color: 'bg-indigo-50 text-indigo-600' },
    { key: 'stock', label: 'Inventory', path: '/admin/stock', icon: <BarChart data={[]}><Bar dataKey="val"/></BarChart>, color: 'bg-emerald-50 text-emerald-600' }, // Wait, using Package instead
    { label: 'Promotions', path: '/admin/promotions', icon: <Zap size={20} />, color: 'bg-rose-50 text-rose-600' },
    { label: 'Logistics', path: '/admin/drivers', icon: <Truck size={20} />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Accounting', path: '/admin/expenses', icon: <Wallet size={20} />, color: 'bg-amber-50 text-amber-600' },
    { label: 'CMS', path: '/admin/cms', icon: <Globe size={20} />, color: 'bg-purple-50 text-purple-600' },
  ];
  // Fixing the icons list
  const controls = [
    { label: 'Launch POS', path: '/admin/pos', icon: <ShoppingCart size={20} />, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Stock Audit', path: '/admin/stock', icon: <Package size={20} />, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Active Promos', path: '/admin/promotions', icon: <Zap size={20} />, color: 'bg-rose-50 text-rose-600' },
    { label: 'Fleets', path: '/admin/drivers', icon: <Truck size={20} />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Expenses', path: '/admin/expenses', icon: <Wallet size={20} />, color: 'bg-amber-50 text-amber-600' },
    { label: 'Site CMS', path: '/admin/cms', icon: <Globe size={20} />, color: 'bg-purple-50 text-purple-600' },
  ];

  const orderStatuses = [
    { label: 'Confirmed', val: data?.confirmedOrders || '0', icon: <CheckCircle2 className="text-blue-500" /> },
    { label: 'Processing', val: data?.processingOrders || '0', icon: <TrendingUp className="text-indigo-500" /> },
    { label: 'Delivered', val: data?.deliveredOrders || '0', icon: <Truck className="text-emerald-500" /> },
    { label: 'Cancelled', val: data?.cancelledOrders || '0', icon: <XCircle className="text-rose-500" /> },
  ];

  const orderDistribution = [
    { name: 'Pending', value: data?.pendingOrders || 0, fill: '#64748B' },
    { name: 'Confirmed', value: data?.confirmedOrders || 0, fill: '#3B82F6' },
    { name: 'Delivered', value: data?.deliveredOrders || 0, fill: '#10B981' },
    { name: 'Cancelled', value: data?.cancelledOrders || 0, fill: '#EF4444' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Executive Overview</h1>
          <p className="text-slate-500 font-medium">Real-time pharmacy performance tracking</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
          {['Daily', 'Monthly', 'Yearly'].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${filter === f ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {f}
            </button>
          ))}
          <button className="p-2 text-slate-400 hover:text-slate-600">
            <Calendar size={18} />
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-default group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-black ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.change} 
                {stat.change.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</h3>
            <p className="text-2xl font-black text-slate-800 tracking-tight">{stat.val}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Universal Control Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Universal Control Grid</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {controls.map((control, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(control.path)}
              className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-3 group transition-all hover:border-blue-500"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${control.color}`}>
                {control.icon}
              </div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{control.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Revenue Insights</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                 <div className="w-3 h-3 rounded-full bg-blue-500" /> Sales (৳)
              </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_DATA}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    padding: '12px 16px'
                  }} 
                  itemStyle={{ fontWeight: 800, fontSize: '14px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3B82F6" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Cards */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 h-full">
            <h3 className="text-lg font-black text-slate-800 tracking-tight mb-8">Order Flow</h3>
            <div className="grid grid-cols-1 gap-4">
              {orderStatuses.map((os, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                      {os.icon}
                    </div>
                    <span className="text-sm font-black text-slate-600">{os.label}</span>
                  </div>
                  <span className="text-lg font-black text-slate-800 tracking-tight">{os.val}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
               <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Growth Rate</h4>
                  <span className="text-emerald-500 font-black text-xs">+32.4%</span>
               </div>
               <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    className="h-full bg-blue-500 rounded-full"
                  />
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
         <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 tracking-tight mb-6">Order Distribution</h3>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderDistribution}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }} />
                    <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '15px' }} />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Recent Activity</h3>
              <button className="text-xs font-black text-blue-600 uppercase tracking-widest">View System Log</button>
            </div>
            <div className="space-y-6">
              {[
                { user: 'Admin', act: 'Added a new product "Napa Extra"', time: '2 mins ago', icon: <TrendingUp className="text-success" /> },
                { user: 'Order #921', act: 'Status updated to "Delivered"', time: '15 mins ago', icon: <Truck className="text-primary" /> },
                { user: 'Sheikh', act: 'Logged in to dashboard', time: '1 hour ago', icon: <Users className="text-blue-500" /> },
                { user: 'Stock', act: 'Alert: Ceevit 250 is low (12 remaining)', time: '3 hours ago', icon: <TrendingDown className="text-danger" /> },
              ].map((log, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    {log.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 tracking-tight">{log.user}</h4>
                    <p className="text-xs font-semibold text-slate-500">{log.act}</p>
                    <p className="text-[10px] font-black text-slate-400 mt-1">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
}
