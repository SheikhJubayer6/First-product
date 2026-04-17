
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LogOut,
  ChevronRight,
  Menu,
  X,
  HelpCircle
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { useAdminConfig, getLucideIcon } from './AdminConfigContext';
import { motion, AnimatePresence } from 'motion/react';

export function AdminLayout() {
  const { user, logout, hasPermission } = useAuth();
  const { sections } = useAdminConfig();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  React.useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Group sections by their group property
  const groups = Array.from(new Set(sections.map(s => s.group)));
  const dynamicMenuItems = groups.map(groupName => ({
    group: groupName,
    items: sections
      .filter(s => s.group === groupName)
      .filter(item => hasPermission(item.permission || '*'))
  })).filter(group => group.items.length > 0);

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 0 }}
        className="bg-slate-900 text-slate-400 overflow-hidden flex flex-col sticky top-0 h-screen z-50 shadow-2xl"
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">P</div>
          <span className="text-white font-black text-lg tracking-tight">AdminPanel</span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-hide">
          {dynamicMenuItems.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-3">{group.group}</h3>
              <div className="space-y-1">
                {group.items.map((item, iIdx) => (
                  <NavLink 
                    key={iIdx}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group
                      ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'hover:bg-slate-800 hover:text-slate-200'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {getLucideIcon(item.iconName)}
                      <span className="text-sm font-bold">{item.label}</span>
                    </div>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800">
           <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-danger hover:bg-danger/10 transition-colors font-bold text-sm"
          >
            <LogOut size={20} />
            Logout Account
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-500"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest hidden md:block">System Status: <span className="text-success">Online</span></h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/admin/settings')}>
              <div className="text-right">
                <p className="text-sm font-black text-slate-800 tracking-tight">{user.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{user.role} Access</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden group-hover:border-blue-500 transition-colors">
                 <img src={user.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
