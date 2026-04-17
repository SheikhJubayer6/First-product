
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Shield, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  X,
  Lock,
  Eye,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Role {
  id: string;
  name: string;
  description: string;
  level: 'Root' | 'High' | 'Medium' | 'Low';
  userCount: number;
  permissions: string[];
}

const INITIAL_ROLES: Role[] = [
  { 
    id: 'r1', 
    name: 'Root Access', 
    description: 'Full system control and user management', 
    level: 'Root',
    userCount: 1,
    permissions: ['*']
  },
  { 
    id: 'r2', 
    name: 'Admin', 
    description: 'Full catalog and order management', 
    level: 'High',
    userCount: 2,
    permissions: ['view_dashboard', 'manage_orders', 'manage_products', 'manage_catalog', 'manage_promotions', 'manage_customers']
  },
  { 
    id: 'r3', 
    name: 'Employee', 
    description: 'Order fulfillment and stock viewing', 
    level: 'Medium',
    userCount: 5,
    permissions: ['view_dashboard', 'manage_orders', 'view_products', 'view_stock']
  },
  { 
    id: 'r4', 
    name: 'Supplier', 
    description: 'Stock management for specific brands', 
    level: 'Low',
    userCount: 12,
    permissions: ['manage_own_products', 'view_stock']
  }
];

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const getLevelColor = (level: Role['level']) => {
    switch(level) {
      case 'Root': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'High': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Low': return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Security & Roles</h1>
          <p className="text-slate-500 font-medium">Define access levels and fine-grained permissions</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={20} /> Create New Role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Role List */}
        <div className="lg:col-span-2 space-y-4">
          {roles.map((role) => (
            <motion.div 
              key={role.id}
              layoutId={role.id}
              onClick={() => setSelectedRole(role)}
              className={`
                bg-white p-6 rounded-[32px] shadow-sm border transition-all cursor-pointer group
                ${selectedRole?.id === role.id ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-100 hover:border-slate-200'}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getLevelColor(role.level)} border shadow-sm`}>
                    {role.level === 'Root' ? <ShieldAlert size={24} /> : <ShieldCheck size={24} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                      {role.name}
                      {role.level === 'Root' && <span className="text-[10px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">System</span>}
                    </h3>
                    <p className="text-sm font-semibold text-slate-500 leading-relaxed max-w-sm">{role.description}</p>
                    <div className="mt-4 flex items-center gap-6">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                         <Lock size={12} /> {role.permissions.length === 1 && role.permissions[0] === '*' ? 'Full System' : `${role.permissions.length} Permissions`}
                       </p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                         <Settings size={12} /> {role.userCount} Active Users
                       </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit size={16} /></button>
                  <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Permission Details */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedRole ? (
              <motion.div 
                key={selectedRole.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 sticky top-28"
              >
                <h3 className="text-xl font-black text-slate-800 tracking-tight mb-6">Permissions Overview</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Core Access</h4>
                    <div className="space-y-2">
                       {['view_dashboard', 'manage_orders', 'manage_products', 'manage_catalog', 'manage_promotions', 'manage_customers', 'manage_users', 'system_access'].map(p => {
                         const has = selectedRole.permissions.includes('*') || selectedRole.permissions.includes(p);
                         return (
                           <div key={p} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${has ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-slate-50 border-slate-100 text-slate-400 opacity-50'}`}>
                              <span className="text-xs font-black capitalize">{p.replace('_', ' ')}</span>
                              {has ? <Check size={14} strokeWidth={3} /> : <X size={14} />}
                           </div>
                         );
                       })}
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative group">
                     <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Lock size={60} />
                     </div>
                     <h5 className="text-sm font-black mb-2 relative z-10">Security Note</h5>
                     <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4 relative z-10">
                       Any changes to system-level permissions will be audited and logged immediately.
                     </p>
                     <button className="w-full bg-white text-slate-900 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all relative z-10">
                       Apply Security Patch
                     </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center p-8 text-center">
                <Shield size={64} className="text-slate-300 mb-4" />
                <h3 className="text-lg font-black text-slate-400">Select a role to view detailed permissions</h3>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
