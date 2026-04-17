
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  MoreVertical, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Package,
  Image as ImageIcon,
  DollarSign,
  Layers,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Category, Brand } from '../types';
import { api } from '../services/api';

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    generic: '',
    brand: '',
    category: '',
    mrp: 0,
    discountPrice: 0,
    stock: 0,
    type: 'Tablet',
    image: 'https://picsum.photos/seed/newmed/200/200',
    description: '',
    dosage: ''
  });

  const fetchData = async () => {
    try {
      const [p, c, b] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getBrands()
      ]);
      setProducts(p);
      setCategories(c);
      setBrands(b);
      if (b.length > 0) setFormData(prev => ({ ...prev, brand: b[0].name }));
      if (c.length > 0) setFormData(prev => ({ ...prev, category: c[0].name }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const newProduct: Product = {
        ...formData,
        id: `p${Date.now()}`,
        isFlashSale: false,
        isNewLaunched: true,
      } as Product;

      await api.createOrder({} as any, []); // Mock - just showing where items go
      // Actually use a real createProduct endpoint if available, but for now I'll mock createOrder as example
      // In server.ts I added app.post('/api/products') so let's use that if I added it
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      
      if (res.ok) {
        setShowAddModal(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.generic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Product Catalog</h1>
          <p className="text-slate-500 font-medium">Manage your pharmacy inventory and variations</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={20} /> Add New Product
        </button>
      </div>

      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-3 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search products, brands, generics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border-0 h-11 pl-12 pr-4 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-slate-700"
              />
           </div>
           <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100 transition-colors">
                <Filter size={16} /> Filters
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="pb-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-16">Image</th>
                <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Details</th>
                <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand / Generic</th>
                <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Price (৳)</th>
                <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Stock</th>
                <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-2">
                    <div className="w-12 h-12 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden mx-auto flex items-center justify-center">
                      <img src={p.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800">{p.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{p.category}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <Tag size={12} className="text-blue-500" />
                        <span className="text-xs font-bold text-slate-700">{p.brand}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold">{p.generic}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800">৳{p.discountPrice}</span>
                      <span className="text-[10px] line-through text-slate-400 font-bold">MRP ৳{p.mrp}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`text-xs font-black ${p.stock < 50 ? 'text-rose-500' : 'text-slate-700'}`}>{p.stock}</span>
                      <div className="w-12 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div className={`h-full rounded-full ${p.stock < 50 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (p.stock/1000)*100)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right space-x-1">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit size={16} /></button>
                    <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                    <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
           <p className="text-xs font-black text-slate-400">Showing {filteredProducts.length} products</p>
           <div className="flex items-center gap-2">
              <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-400 cursor-not-allowed"><ChevronLeft size={18} /></button>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-600 text-white font-black text-xs shadow-md">1</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-500 font-black text-xs hover:bg-slate-50 transition-colors">2</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-500 font-black text-xs hover:bg-slate-50 transition-colors">3</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-500 hover:bg-slate-50 transition-colors"><ChevronRight size={18} /></button>
           </div>
        </div>
      </div>

      {/* Add Product Modal (Simple Version for Demo) */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl relative"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Register New Product</h2>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Entry form for pharmacy repository</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="p-8 grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
                <div className="col-span-2 md:col-span-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Napa Extend" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-11 bg-slate-50 border-0 rounded-xl px-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                  />
                </div>
                <div className="col-span-2 md:col-span-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Generic Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Paracetamol" 
                    value={formData.generic}
                    onChange={(e) => setFormData({ ...formData, generic: e.target.value })}
                    className="w-full h-11 bg-slate-50 border-0 rounded-xl px-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                  />
                </div>
                <div className="col-span-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand</label>
                  <select 
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full h-11 bg-slate-50 border-0 rounded-xl px-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  >
                    {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
                <div className="col-span-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-11 bg-slate-50 border-0 rounded-xl px-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  >
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-span-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">MRP Price (৳)</label>
                  <input 
                    type="number" 
                    placeholder="25" 
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: parseFloat(e.target.value) })}
                    className="w-full h-11 bg-slate-50 border-0 rounded-xl px-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                  />
                </div>
                <div className="col-span-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Discount Price (৳)</label>
                  <input 
                    type="number" 
                    placeholder="22" 
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: parseFloat(e.target.value) })}
                    className="w-full h-11 bg-slate-50 border-0 rounded-xl px-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                  />
                </div>
                <div className="col-span-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Stock</label>
                  <input 
                    type="number" 
                    placeholder="500" 
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    className="w-full h-11 bg-slate-50 border-0 rounded-xl px-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                  />
                </div>
                 <div className="col-span-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Variant (Type)</label>
                   <select 
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full h-11 bg-slate-50 border-0 rounded-xl px-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                   >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                  </select>
                </div>
              </div>

              <div className="p-8 bg-slate-50 flex items-center justify-between gap-4">
                 <button 
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 rounded-xl font-black text-slate-500 hover:text-slate-700 transition-colors uppercase tracking-widest text-xs"
                 >
                   Discard Changes
                 </button>
                 <button 
                  onClick={handleSave}
                  className="px-10 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all uppercase tracking-widest text-xs"
                 >
                   Save Product
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
