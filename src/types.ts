
export interface Product {
  id: string;
  name: string;
  brand: string;
  generic: string;
  mrp: number;
  discountPrice: number;
  image: string;
  isFlashSale?: boolean;
  isNewLaunched?: boolean;
  category: string;
  description: string;
  dosage: string;
  type: 'Tablet' | 'Syrup' | 'Capsule' | 'Injection';
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subCategories?: string[];
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  trackingId?: string;
}

export type CustomerStatus = 'Pending' | 'Approved' | 'Rejected' | 'Blocked';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinedDate: string;
  totalOrders: number;
  status: CustomerStatus;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'Bills' | 'Salary' | 'Rent' | 'Other';
  date: string;
}

export type AdminRole = 'Root' | 'Admin' | 'Employee' | 'Supplier' | 'Visitor';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  permissions: string[];
}
