
import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  MessageSquare, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { MOCK_CUSTOMERS } from '../data';
import { Customer, CustomerStatus } from '../types';

export function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<CustomerStatus | 'All'>('All');

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = (id: string, newStatus: CustomerStatus) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const getStatusColor = (status: CustomerStatus) => {
    switch(status) {
      case 'Approved': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Pending': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Rejected': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'Blocked': return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Customer Registry</h1>
          <p className="text-slate-500 font-medium">Manage user profiles and medical history access</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
          <UserPlus size={20} /> Add New Profile
        </button>
      </div>

      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-3 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border-0 h-11 pl-12 pr-4 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-slate-700"
              />
           </div>
           <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {['All', 'Approved', 'Pending', 'Rejected'].map((status) => (
                <button 
                 key={status}
                 onClick={() => setFilterStatus(status as any)}
                 className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                   filterStatus === status ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                 }`}
                >
                  {status}
                </button>
              ))}
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile</th>
                <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Totals</th>
                <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs uppercase shadow-sm">
                          {c.name.split(' ').map(n => n[0]).join('')}
                       </div>
                       <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800">{c.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID: {c.id}</span>
                       </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                        <Mail size={12} className="text-slate-400" /> {c.email}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                        <MessageSquare size={12} className="text-slate-400" /> {c.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border leading-none ${getStatusColor(c.status)}`}>{c.status}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-700">
                      {c.totalOrders} <span className="text-slate-400">Orders</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {c.status === 'Pending' && (
                        <>
                          <button 
                           onClick={() => handleStatusChange(c.id, 'Approved')}
                           className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all" title="Approve"
                          >
                           <CheckCircle2 size={16} />
                          </button>
                          <button 
                           onClick={() => handleStatusChange(c.id, 'Rejected')}
                           className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="Reject"
                          >
                           <XCircle size={16} />
                          </button>
                        </>
                      )}
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
           <p className="text-xs font-black text-slate-400">A total of {filteredCustomers.length} registered customers</p>
           <div className="flex items-center gap-2">
              <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-400 cursor-not-allowed"><ChevronLeft size={18} /></button>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-600 text-white font-black text-xs shadow-md">1</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-500 font-black text-xs hover:bg-slate-50 transition-colors">2</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-500 hover:bg-slate-50 transition-colors"><ChevronRight size={18} /></button>
           </div>
        </div>
      </div>
    </div>
  );
}
