
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

export interface AdminSection {
  id: string;
  iconName: string;
  label: string;
  path: string;
  permission: string;
  group: string;
}

interface AdminConfigContextType {
  sections: AdminSection[];
  addSection: (section: Omit<AdminSection, 'id'>) => void;
  updateSection: (id: string, section: Partial<AdminSection>) => void;
  removeSection: (id: string) => void;
  resetSections: () => void;
}

const DEFAULT_SECTIONS: AdminSection[] = [
  { id: '1', iconName: 'LayoutDashboard', label: 'Dashboard', path: '/admin/dashboard', permission: 'view_dashboard', group: 'MAIN' },
  { id: '2', iconName: 'ShoppingBag', label: 'Orders', path: '/admin/orders', permission: 'manage_orders', group: 'MAIN' },
  { id: '3', iconName: 'ShoppingCart', label: 'POS', path: '/admin/pos', permission: 'use_pos', group: 'MAIN' },
  { id: '4', iconName: 'Package', label: 'Products', path: '/admin/products', permission: 'view_products', group: 'CATALOG' },
  { id: '5', iconName: 'Layers', label: 'Categories', path: '/admin/categories', permission: 'manage_catalog', group: 'CATALOG' },
  { id: '6', iconName: 'BarChart3', label: 'Stock', path: '/admin/stock', permission: 'view_stock', group: 'CATALOG' },
  { id: '7', iconName: 'Zap', label: 'Promotions', path: '/admin/promotions', permission: 'manage_promotions', group: 'MARKETING' },
  { id: '8', iconName: 'Bell', label: 'Notifications', path: '/admin/notifications', permission: 'manage_notifications', group: 'MARKETING' },
  { id: '9', iconName: 'Users', label: 'Customers', path: '/admin/customers', permission: 'manage_customers', group: 'USER MANAGEMENT' },
  { id: '10', iconName: 'Briefcase', label: 'Employees', path: '/admin/employees', permission: 'manage_users', group: 'USER MANAGEMENT' },
  { id: '11', iconName: 'Truck', label: 'Drivers', path: '/admin/drivers', permission: 'manage_users', group: 'USER MANAGEMENT' },
  { id: '12', iconName: 'Store', label: 'Shops', path: '/admin/shops', permission: 'view_operations', group: 'OPERATIONS' },
  { id: '13', iconName: 'Truck', label: 'Suppliers', path: '/admin/suppliers', permission: 'view_suppliers', group: 'OPERATIONS' },
  { id: '14', iconName: 'Wallet', label: 'Expenses', path: '/admin/expenses', permission: 'view_operations', group: 'OPERATIONS' },
  { id: '15', iconName: 'Settings', label: 'Settings', path: '/admin/settings', permission: 'system_access', group: 'SYSTEM' },
  { id: '16', iconName: 'Globe', label: 'CMS', path: '/admin/cms', permission: 'system_access', group: 'SYSTEM' },
  { id: '17', iconName: 'ShieldCheck', label: 'Roles', path: '/admin/roles', permission: 'system_access', group: 'SYSTEM' },
];

const AdminConfigContext = createContext<AdminConfigContextType | undefined>(undefined);

export function AdminConfigProvider({ children }: { children: React.ReactNode }) {
  const [sections, setSections] = useState<AdminSection[]>(() => {
    const saved = localStorage.getItem('admin_sections');
    return saved ? JSON.parse(saved) : DEFAULT_SECTIONS;
  });

  useEffect(() => {
    localStorage.setItem('admin_sections', JSON.stringify(sections));
  }, [sections]);

  const addSection = (section: Omit<AdminSection, 'id'>) => {
    const newSection = { ...section, id: Math.random().toString(36).substr(2, 9) };
    setSections([...sections, newSection]);
  };

  const updateSection = (id: string, updated: Partial<AdminSection>) => {
    setSections(sections.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const resetSections = () => {
    setSections(DEFAULT_SECTIONS);
  };

  return (
    <AdminConfigContext.Provider value={{ sections, addSection, updateSection, removeSection, resetSections }}>
      {children}
    </AdminConfigContext.Provider>
  );
}

export function useAdminConfig() {
  const context = useContext(AdminConfigContext);
  if (context === undefined) {
    throw new Error('useAdminConfig must be used within an AdminConfigProvider');
  }
  return context;
}

// Utility to get icon component by name
export function getLucideIcon(name: string, size = 20) {
  const Icon = (Icons as any)[name] || Icons.HelpCircle;
  return <Icon size={size} />;
}
