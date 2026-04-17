
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Truck, 
  CheckCircle2, 
  X,
  Clock,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Mail,
  Phone,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_ORDERS } from '../data';
import { Order, OrderStatus } from '../types';

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statusColors: Record<OrderStatus, string> = {
    'Pending': 'bg-slate-100 text-slate-600',
    'Confirmed': 'bg-blue-50 text-blue-600',
    'Processing': 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    'Delivered': 'bg-emerald-50 text-emerald-600',
    'Cancelled': 'bg-rose-50 text-rose-600',
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Order Logs</h1>
          <p className="text-slate-500 font-medium">Track delivery status and manage order fulfillment</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="bg-white text-slate-700 px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-sm border border-slate-100 hover:bg-slate-50 transition-all">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-3 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by Order ID or Customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border-0 h-11 pl-12 pr-4 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-slate-700"
              />
           </div>
           <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100 transition-colors">
                <Filter size={16} /> Advanced Filter
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Date</th>
                <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Amount</th>
                <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="text-sm font-black text-blue-600">{o.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800">{o.customerName}</span>
                      <span className="text-[10px] font-semibold text-slate-500">{o.customerEmail}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-xs font-bold text-slate-600">{o.date}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm font-black text-slate-800">৳{o.total}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full ${statusColors[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right space-x-1">
                    <button 
                      onClick={() => setSelectedOrder(o)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Eye size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"><Download size={16} /></button>
                    <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
           <p className="text-xs font-black text-slate-400">Total {filteredOrders.length} orders recorded</p>
           <div className="flex items-center gap-2">
              <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-400 cursor-not-allowed"><ChevronLeft size={18} /></button>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-600 text-white font-black text-xs shadow-md">1</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-500 font-black text-xs hover:bg-slate-50 transition-colors">2</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-500 hover:bg-slate-50 transition-colors"><ChevronRight size={18} /></button>
           </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="bg-white w-full max-w-xl h-full relative shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Order {selectedOrder.id}</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Registry Details</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                {/* Status Update */}
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Current Status</p>
                    <span className={`text-xs font-black px-4 py-1.5 rounded-full ${statusColors[selectedOrder.status]}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['Confirmed', 'Processing', 'Delivered', 'Cancelled'].map(s => (
                      <button 
                        key={s}
                        className="p-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-all text-center"
                      >
                        Set to {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">Customer Profile</h3>
                  <div className="flex items-center gap-4 bg-white border border-slate-100 p-6 rounded-3xl">
                     <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">
                       {selectedOrder.customerName[0]}
                     </div>
                     <div className="flex-1">
                        <h4 className="font-black text-slate-800">{selectedOrder.customerName}</h4>
                        <div className="flex items-center gap-4 mt-1">
                           <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                             <Mail size={12} /> {selectedOrder.customerEmail}
                           </div>
                           <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                             <Phone size={12} /> +880 1712-345678
                           </div>
                        </div>
                     </div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">Order Items</h3>
                  <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden divide-y divide-slate-50">
                     {[1, 2].map(i => (
                        <div key={i} className="p-4 flex items-center gap-4">
                           <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden">
                              <img src={`https://picsum.photos/seed/${i*33}/100/100`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                           </div>
                           <div className="flex-1">
                              <h4 className="text-xs font-black text-slate-800">Paracetamol BP 500mg</h4>
                              <p className="text-[10px] font-bold text-slate-400">10 Tablets • Strips</p>
                           </div>
                           <div className="text-right">
                              <p className="text-xs font-black text-slate-800">৳45.00</p>
                              <p className="text-[10px] font-bold text-slate-400">Qty: 2</p>
                           </div>
                        </div>
                     ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-slate-900 p-8 rounded-[40px] text-white space-y-4">
                   <div className="flex justify-between text-slate-400 font-bold text-xs uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span>৳{selectedOrder.total - 40}</span>
                   </div>
                   <div className="flex justify-between text-slate-400 font-bold text-xs uppercase tracking-widest">
                      <span>Shipping Fee</span>
                      <span>৳40.00</span>
                   </div>
                   <div className="h-px bg-slate-800" />
                   <div className="flex justify-between text-white font-black text-xl tracking-tight">
                      <span>Grand Total</span>
                      <span>৳{selectedOrder.total}</span>
                   </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 flex items-center gap-4">
                 <button className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                   <Truck size={20} /> Initiate Dispatch
                 </button>
                 <button className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors">
                   <Download size={22} />
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
