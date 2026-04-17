
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Storefront } from './shop/Storefront';
import { AdminLogin } from './admin/AdminLogin';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { ProductManagement } from './admin/ProductManagement';
import { OrderManagement } from './admin/OrderManagement';
import { CustomerManagement } from './admin/CustomerManagement';
import { RoleManagement } from './admin/RoleManagement';
import { 
  POSManagement, 
  StockManagement, 
  PromotionManagement, 
  NotificationManagement, 
  EmployeeManagement, 
  DriverManagement, 
  ShopManagement, 
  SupplierManagement, 
  ExpenseManagement, 
  SettingsManagement, 
  CMSManagement 
} from './admin/ManagementSystem';
import { AuthProvider } from './admin/AuthContext';
import { UserAuthProvider } from './shop/UserAuthContext';
import { AdminConfigProvider } from './admin/AdminConfigContext';

export default function App() {
  return (
    <BrowserRouter>
      <UserAuthProvider>
        <AdminConfigProvider>
          <AuthProvider>
            <Routes>
          {/* Shop Routes */}
          <Route path="/" element={<Storefront />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="customers" element={<CustomerManagement />} />
            
            <Route path="pos" element={<POSManagement />} />
            <Route path="categories" element={<ProductManagement />} /> {/* Categories can be handled in products for now or add a toggle */}
            <Route path="stock" element={<StockManagement />} />
            <Route path="promotions" element={<PromotionManagement />} />
            <Route path="notifications" element={<NotificationManagement />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="drivers" element={<DriverManagement />} />
            <Route path="shops" element={<ShopManagement />} />
            <Route path="suppliers" element={<SupplierManagement />} />
            <Route path="expenses" element={<ExpenseManagement />} />
            <Route path="settings" element={<SettingsManagement />} />
            <Route path="cms" element={<CMSManagement />} />
            <Route path="roles" element={<RoleManagement />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
      </AdminConfigProvider>
      </UserAuthProvider>
    </BrowserRouter>
  );
}
