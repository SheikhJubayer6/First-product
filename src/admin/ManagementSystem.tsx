
import React, { useState } from 'react';
import { 
  Plus, Search, Edit, Trash2, Filter, MoreVertical,
  ChevronLeft, ChevronRight, Package, Users, Truck,
  Store, Briefcase, Wallet, Bell, Zap, Globe, Settings,
  DollarSign, MapPin, Calendar, Clock, CheckCircle2,
  X, Power, ShieldCheck, Mail, Phone, Info, ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types for Management ---
interface GenericItem {
  id: string;
  [key: string]: any;
}

interface Column {
  key: string;
  label: string;
  render?: (val: any, item: any) => React.ReactNode;
}

// --- Reusable Universal Management Component ---
export function UniversalManagement({ 
  title, 
  subtitle, 
  icon: Icon,
  columns, 
  initialData,
  onAdd,
  onEdit,
  onDelete 
}: {
  title: string;
  subtitle: string;
  icon: any;
  columns: Column[];
  initialData: GenericItem[];
  onAdd?: () => void;
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => void;
}) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState('');

  const filteredData = data.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <Icon size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{title}</h1>
            <p className="text-slate-500 font-medium">{subtitle}</p>
          </div>
        </div>
        <button 
          onClick={onAdd}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={20} /> Add New Entry
        </button>
      </div>

      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-3 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder={`Search ${title.toLowerCase()}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border-0 h-11 pl-12 pr-4 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-slate-700"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                {columns.map(col => (
                  <th key={col.key} className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{col.label}</th>
                ))}
                <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((item) => (
                <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className="py-4 px-4">
                      {col.render ? col.render(item[col.key], item) : <span className="text-sm font-bold text-slate-700">{item[col.key]}</span>}
                    </td>
                  ))}
                  <td className="py-4 px-4 text-right space-x-1">
                    <button onClick={() => onEdit?.(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit size={16} /></button>
                    <button onClick={() => onDelete?.(item.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Specific Advanced Modules ---

export function POSManagement() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-160px)]">
      {/* Product Selection */}
      <div className="lg:col-span-2 space-y-6 flex flex-col">
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Scan Barcode or Type Product Name..." 
              className="w-full h-14 bg-slate-50 rounded-2xl pl-12 pr-4 font-black text-lg focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
          {[1,2,3,4,5,6,7,8].map(i => (
            <button key={i} className="bg-white p-4 rounded-[28px] border border-slate-100 shadow-sm hover:border-blue-500 transition-all group text-left">
              <div className="aspect-square bg-slate-50 rounded-2xl mb-3 overflow-hidden">
                <img src={`https://picsum.photos/seed/${i*5}/200/200`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-xs font-black text-slate-800 line-clamp-2 mb-1">Advanced Medicine {i}</p>
              <p className="text-[10px] font-bold text-slate-400 mb-2 underline">Stock: 450</p>
              <p className="text-sm font-black text-blue-600">৳245.00</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart & Billing */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-black text-slate-800 tracking-tight">Active Cart</h3>
          <button className="text-rose-500 text-xs font-black uppercase tracking-widest">Clear All</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 bg-white rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-800">Napa Extend (Strip)</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-bold text-blue-600">৳18.00 x 2</span>
                <div className="flex items-center gap-2">
                  <button className="w-5 h-5 bg-white rounded border border-slate-200 flex items-center justify-center text-[10px]">-</button>
                  <span className="text-[10px] font-black">2</span>
                  <button className="w-5 h-5 bg-white rounded border border-slate-200 flex items-center justify-center text-[10px]">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 space-y-3">
          <div className="flex justify-between text-xs font-bold text-slate-500">
            <span>Subtotal</span>
            <span>৳36.00</span>
          </div>
          <div className="flex justify-between text-xs font-bold text-slate-500">
            <span>Tax (5%)</span>
            <span>৳1.80</span>
          </div>
          <div className="h-px bg-slate-200 my-2" />
          <div className="flex justify-between text-xl font-black text-slate-800">
            <span>Total</span>
            <span>৳37.80</span>
          </div>
          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-blue-200 active:scale-95 transition-all mt-4">
            Complete Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export function StockManagement() {
  const stockLevels = [
    { id: '1', name: 'Napa Extend', stock: 45, threshold: 50, status: 'Low' },
    { id: '2', name: 'Ace Plus', stock: 12, threshold: 30, status: 'Critical' },
    { id: '3', name: 'Ceevit', stock: 450, threshold: 100, status: 'Good' },
  ];

  return (
    <UniversalManagement 
      title="Stock Control"
      subtitle="Monitor and adjust inventory thresholds"
      icon={BarChart3}
      columns={[
        { key: 'name', label: 'Product' },
        { key: 'stock', label: 'Current Quantity' },
        { key: 'threshold', label: 'Threshold' },
        { key: 'status', label: 'Status', render: (val) => (
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
            val === 'Critical' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
            val === 'Low' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
            'bg-emerald-50 text-emerald-600 border border-emerald-100'
          }`}>{val}</span>
        )}
      ]}
      initialData={stockLevels}
    />
  );
}

export function PromotionManagement() {
  const data = [
    { id: '1', title: 'Summer Sale', code: 'SUMMER20', discount: '20%', status: 'Active' },
    { id: '2', title: 'First Order', code: 'HELLO50', discount: '৳50', status: 'Active' },
  ];
  return (
    <UniversalManagement 
      title="Promotions"
      subtitle="Manage discounts and coupons"
      icon={Zap}
      columns={[
        { key: 'title', label: 'Promotion Title' },
        { key: 'code', label: 'Promo Code' },
        { key: 'discount', label: 'Discount' },
        { key: 'status', label: 'Status' }
      ]}
      initialData={data}
    />
  );
}

export function NotificationManagement() {
  const data = [
    { id: '1', type: 'Marketing', target: 'All Customers', content: 'New Stock Alert!', date: '2026-04-10' },
    { id: '2', type: 'System', target: 'Verified Only', content: 'Scheduled Maintenance', date: '2026-04-12' },
  ];
  return (
    <UniversalManagement 
      title="Notifications"
      subtitle="Push alerts to your user base"
      icon={Bell}
      columns={[
        { key: 'type', label: 'Alert Type' },
        { key: 'target', label: 'Audience' },
        { key: 'content', label: 'Message' },
        { key: 'date', label: 'Scheduled' }
      ]}
      initialData={data}
    />
  );
}

export function EmployeeManagement() {
  const data = [
    { id: '1', name: 'Zakir Hossain', role: 'Pharmacist', email: 'zakir@pharma.com', status: 'Active' },
    { id: '2', name: 'Anisur Rahman', role: 'Manager', email: 'anis@pharma.com', status: 'On Leave' },
  ];
  return (
    <UniversalManagement 
      title="Employee Directory"
      subtitle="Manage your internal team and access"
      icon={Briefcase}
      columns={[
        { key: 'name', label: 'Employee Name' },
        { key: 'role', label: 'Position' },
        { key: 'email', label: 'Contact' },
        { key: 'status', label: 'Work Status' }
      ]}
      initialData={data}
    />
  );
}

export function DriverManagement() {
  const data = [
    { id: '1', name: 'Raju Ahmed', vehicle: 'Motorcycle', phone: '019111-2222', area: 'Uttara' },
    { id: '2', name: 'Sumon Khan', vehicle: 'Bicycle', phone: '017333-4444', area: 'Banani' },
  ];
  return (
    <UniversalManagement 
      title="Delivery Fleet"
      subtitle="Control your logistic handlers"
      icon={Truck}
      columns={[
        { key: 'name', label: 'Driver' },
        { key: 'phone', label: 'Contact' },
        { key: 'vehicle', label: 'Vehicle Type' },
        { key: 'area', label: 'Assigned Area' }
      ]}
      initialData={data}
    />
  );
}

export function ShopManagement() {
  const data = [
    { id: '1', name: 'Main Branch - Uttara', address: 'Sector 7, Uttara', manager: 'Sheikh Jubayer', status: 'Open' },
    { id: '2', name: 'Banani Hub', address: 'Block C, Banani', manager: 'Anisur Rahman', status: 'Closed' },
  ];
  return (
    <UniversalManagement 
      title="Pharmacy Branches"
      subtitle="Manage physical store locations"
      icon={Store}
      columns={[
        { key: 'name', label: 'Branch Name' },
        { key: 'address', label: 'Location' },
        { key: 'manager', label: 'Store Manager' },
        { key: 'status', label: 'Operational Status' }
      ]}
      initialData={data}
    />
  );
}

export function SupplierManagement() {
  const data = [
    { id: '1', name: 'Square Pharmaceutica', contact: '02-887654', type: 'Manufacturer', rating: '5.0' },
    { id: '2', name: 'Beximco Pharma', contact: '02-556677', type: 'Distributor', rating: '4.8' },
  ];
  return (
    <UniversalManagement 
      title="Suppliers & Vendors"
      subtitle="Control your supply chain partners"
      icon={Truck}
      columns={[
        { key: 'name', label: 'Company' },
        { key: 'type', label: 'Relationship' },
        { key: 'contact', label: 'Phone' },
        { key: 'rating', label: 'Performance' }
      ]}
      initialData={data}
    />
  );
}

export function ExpenseManagement() {
  const data = [
    { id: '1', title: 'Monthly Rent', amount: '৳45,000', category: 'Rent', date: '2026-04-01' },
    { id: '2', title: 'Electricity Bill', amount: '৳8,200', category: 'Utilities', date: '2026-04-05' },
  ];
  return (
    <UniversalManagement 
      title="Expenses & Billing"
      subtitle="Track your operation costs"
      icon={Wallet}
      columns={[
        { key: 'title', label: 'Description' },
        { key: 'category', label: 'Fund' },
        { key: 'amount', label: 'Value' },
        { key: 'date', label: 'Recorded' }
      ]}
      initialData={data}
    />
  );
}

export function SettingsManagement() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Settings</h1>
        <p className="text-slate-500 font-medium">Global configuration for the pharmacy engine</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-4">Store Profile</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Store Name</label>
              <input type="text" className="w-full h-11 bg-slate-50 rounded-xl px-4 font-bold border-0 outline-none focus:ring-2 focus:ring-blue-600" defaultValue="Advanced Pharma Dhaka" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Contact Email</label>
                <input type="text" className="w-full h-11 bg-slate-50 rounded-xl px-4 font-bold border-0 outline-none focus:ring-2 focus:ring-blue-600" defaultValue="support@pharma.com" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Contact Phone</label>
                <input type="text" className="w-full h-11 bg-slate-50 rounded-xl px-4 font-bold border-0 outline-none focus:ring-2 focus:ring-blue-600" defaultValue="+88017..." />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-4">System Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <div>
                <p className="text-sm font-black text-slate-800">Auto Stock Warning</p>
                <p className="text-[10px] font-bold text-slate-400">Notify when stock is below 10%</p>
              </div>
              <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useAdminConfig, getLucideIcon } from './AdminConfigContext';

export function CMSManagement() {
  const { sections, addSection, removeSection, updateSection, resetSections } = useAdminConfig();
  const [activeTab, setActiveTab] = useState<'Pages' | 'Menu'>('Pages');
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [menuForm, setMenuForm] = useState({
    label: '',
    group: 'MAIN',
    path: '/admin/',
    iconName: 'Package',
    permission: '*'
  });

  const pageData = [
    { id: '1', page: 'About Us', slug: '/about', status: 'Published', lastUpdate: '2026-03-15' },
    { id: '2', page: 'Terms of Service', slug: '/terms', status: 'Draft', lastUpdate: '2026-04-01' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Content Management</h1>
          <p className="text-slate-500 font-medium tracking-tight">Manage application pages and admin panel sections</p>
        </div>
        
        <div className="flex gap-2 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          {['Pages', 'Menu'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Pages' ? (
        <UniversalManagement 
          title="Dynamic Pages"
          subtitle="Informational sections for the storefront"
          icon={Globe}
          columns={[
            { key: 'page', label: 'Page Title' },
            { key: 'slug', label: 'Route Path' },
            { key: 'status', label: 'Visibility' },
            { key: 'lastUpdate', label: 'Modified' }
          ]}
          initialData={pageData}
        />
      ) : (
        <div className="space-y-6">
          <UniversalManagement 
            title="Menu Sections"
            subtitle="Change, add, or remove admin panel sidebar items"
            icon={Settings}
            onAdd={() => { setEditingItem(null); setMenuForm({ label: '', group: 'MAIN', path: '/admin/', iconName: 'Package', permission: '*' }); setShowAddMenuModal(true); }}
            onEdit={(item) => { setEditingItem(item); setMenuForm(item); setShowAddMenuModal(true); }}
            onDelete={(id) => removeSection(id)}
            columns={[
              { key: 'iconName', label: 'Icon', render: (val) => <div className="text-blue-600">{getLucideIcon(val, 18)}</div> },
              { key: 'label', label: 'Label' },
              { key: 'group', label: 'Group' },
              { key: 'path', label: 'Path' },
              { key: 'permission', label: 'Required Permission' },
            ]}
            initialData={sections}
          />
          <div className="flex justify-end">
            <button 
              onClick={resetSections}
              className="text-xs font-black text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest"
            >
              Reset to System Defaults
            </button>
          </div>
        </div>
      )}

      {/* Menu Edit Modal */}
      <AnimatePresence>
        {showAddMenuModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-8 space-y-6"
            >
               <h2 className="text-xl font-black text-slate-800">{editingItem ? 'Edit Section' : 'Add New Section'}</h2>
               <div className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section Label</label>
                   <input 
                    type="text" 
                    value={menuForm.label}
                    onChange={(e) => setMenuForm({...menuForm, label: e.target.value})}
                    className="w-full h-12 bg-slate-50 rounded-2xl px-4 font-bold border-0 focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="e.g. Inventory"
                   />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Group</label>
                     <select 
                      value={menuForm.group}
                      onChange={(e) => setMenuForm({...menuForm, group: e.target.value})}
                      className="w-full h-12 bg-slate-50 rounded-2xl px-4 font-bold border-0 focus:ring-2 focus:ring-blue-600 outline-none"
                     >
                        {['MAIN', 'CATALOG', 'MARKETING', 'USER MANAGEMENT', 'OPERATIONS', 'SYSTEM'].map(g => <option key={g} value={g}>{g}</option>)}
                     </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Icon Name</label>
                     <input 
                      type="text" 
                      value={menuForm.iconName}
                      onChange={(e) => setMenuForm({...menuForm, iconName: e.target.value})}
                      className="w-full h-12 bg-slate-50 rounded-2xl px-4 font-bold border-0 focus:ring-2 focus:ring-blue-600 outline-none"
                      placeholder="e.g. Package"
                     />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route Path</label>
                   <input 
                    type="text" 
                    value={menuForm.path}
                    onChange={(e) => setMenuForm({...menuForm, path: e.target.value})}
                    className="w-full h-12 bg-slate-50 rounded-2xl px-4 font-bold border-0 focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="/admin/stock"
                   />
                 </div>
               </div>
               <div className="flex gap-3 pt-4">
                 <button onClick={() => setShowAddMenuModal(false)} className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-sm">Cancel</button>
                 <button 
                  onClick={() => {
                    if (editingItem) {
                      updateSection(editingItem.id, menuForm);
                    } else {
                      addSection(menuForm);
                    }
                    setShowAddMenuModal(false);
                  }}
                  className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-100"
                 >Post Changes 🚀</button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { BarChart3 } from 'lucide-react';
