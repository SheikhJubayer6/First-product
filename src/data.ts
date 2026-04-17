
import { Product, Category, Brand, Order, Customer, Expense } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Fever', icon: '🌡️', subCategories: ['Paracetamol', 'Syrup'] },
  { id: '2', name: 'Pain Relief', icon: '💊', subCategories: ['Headache', 'Muscle Pain'] },
  { id: '3', name: 'Antibiotics', icon: '🧬', subCategories: ['Amoxicillin', 'Azithromycin'] },
  { id: '4', name: 'Eye Care', icon: '👁️', subCategories: ['Drops', 'Ointment'] },
  { id: '5', name: 'Digestion', icon: '🤢', subCategories: ['Antacid', 'Stomach Relief'] },
  { id: '6', name: 'Vitamins', icon: '🍎', subCategories: ['Multi-vitamin', 'Supplements'] },
];

export const BRANDS: Brand[] = [
  { id: 'b1', name: 'Beximco', logo: 'B' },
  { id: 'b2', name: 'Square', logo: 'S' },
  { id: 'b3', name: 'Incepta', logo: 'I' },
  { id: 'b4', name: 'Renata', logo: 'R' },
  { id: 'b5', name: 'ACME', logo: 'A' },
  { id: 'b6', name: 'Aristopharma', logo: 'Ar' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Napa Extend',
    brand: 'Beximco',
    generic: 'Paracetamol',
    mrp: 20,
    discountPrice: 18,
    image: 'https://picsum.photos/seed/napa/200/200',
    isFlashSale: true,
    category: 'Fever',
    description: 'Napa Extend is a paracetamol formulation for long-lasting relief from pain and fever.',
    dosage: '1 tablet every 8 hours after meal.',
    type: 'Tablet',
    stock: 500
  },
  {
    id: 'p2',
    name: 'Ace Plus',
    brand: 'Square',
    generic: 'Paracetamol + Caffeine',
    mrp: 25,
    discountPrice: 22,
    image: 'https://picsum.photos/seed/ace/200/200',
    category: 'Pain Relief',
    description: 'Ace Plus provides fast relief from headache and body pain.',
    dosage: '1-2 tablets as needed, max 8 per day.',
    type: 'Tablet',
    stock: 350
  },
  {
    id: 'p3',
    name: 'Ceevit 250',
    brand: 'Square',
    generic: 'Vitamin C',
    mrp: 15,
    discountPrice: 13,
    image: 'https://picsum.photos/seed/ceevit/200/200',
    isFlashSale: true,
    category: 'Vitamins',
    description: 'Essential Vitamin C supplement for immunity.',
    dosage: '1 chewable tablet daily.',
    type: 'Tablet',
    stock: 1200
  },
  {
    id: 'p4',
    name: 'Fexo 120',
    brand: 'Incepta',
    generic: 'Fexofenadine',
    mrp: 30,
    discountPrice: 27,
    image: 'https://picsum.photos/seed/fexo/200/200',
    category: 'Pain Relief',
    description: 'Effective antihistamine for allergy relief.',
    dosage: '1 tablet once daily before bed.',
    type: 'Tablet',
    stock: 800
  },
  {
    id: 'p5',
    name: 'Antacid Max',
    brand: 'ACME',
    generic: 'Alu + Mag',
    mrp: 12,
    discountPrice: 10,
    image: 'https://picsum.photos/seed/antacid/200/200',
    category: 'Digestion',
    description: 'Relief from heartburn and acidity.',
    dosage: '1-2 tablets after meals.',
    type: 'Tablet',
    stock: 450
  },
  {
    id: 'p6',
    name: 'Vit-B Complex',
    brand: 'Aristopharma',
    generic: 'Vitamin B1, B6, B12',
    mrp: 50,
    discountPrice: 45,
    image: 'https://picsum.photos/seed/vitaminb/200/200',
    isNewLaunched: true,
    category: 'Vitamins',
    description: 'Nerve health and energy booster.',
    dosage: '1 tablet daily after meal.',
    type: 'Tablet',
    stock: 300
  },
  {
    id: 'p7',
    name: 'Gavis-Cool',
    brand: 'Incepta',
    generic: 'Sodium Alginate',
    mrp: 180,
    discountPrice: 165,
    image: 'https://picsum.photos/seed/gavis/200/200',
    isNewLaunched: true,
    category: 'Digestion',
    description: 'Instant relief from acidity and heartbeat.',
    dosage: '10ml after meals and at bedtime.',
    type: 'Syrup',
    stock: 200
  },
  {
    id: 'p8',
    name: 'Hylo-Eye Drop',
    brand: 'Renata',
    generic: 'Sodium Hyaluronate',
    mrp: 450,
    discountPrice: 420,
    image: 'https://picsum.photos/seed/eyedrop/200/200',
    isNewLaunched: true,
    category: 'Eye Care',
    description: 'Lubricating eye drops for dry eyes.',
    dosage: '1 drop in each eye 3 times daily.',
    type: 'Syrup',
    stock: 150
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    customerName: 'Sheikh Jubayer',
    customerEmail: 'jubayerskh@gmail.com',
    items: [],
    total: 450,
    status: 'Delivered',
    date: '2026-04-15 10:30 AM',
    trackingId: 'TRK992102'
  },
  {
    id: 'ORD-1002',
    customerName: 'Anisur Rahman',
    customerEmail: 'anis@example.com',
    items: [],
    total: 220,
    status: 'Pending',
    date: '2026-04-17 09:15 AM'
  },
  {
    id: 'ORD-1003',
    customerName: 'Zakir Hossain',
    customerEmail: 'zakir@example.com',
    items: [],
    total: 1200,
    status: 'Processing',
    date: '2026-04-17 08:00 AM'
  },
  {
    id: 'ORD-1004',
    customerName: 'Maruf Ahmed',
    customerEmail: 'maruf@example.com',
    items: [],
    total: 55,
    status: 'Confirmed',
    date: '2026-04-16 02:45 PM'
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Sheikh Jubayer',
    email: 'jubayerskh@gmail.com',
    phone: '01712345678',
    address: 'Dhaka, Bangladesh',
    joinedDate: '2026-01-10',
    totalOrders: 15,
    status: 'Approved'
  },
  {
    id: 'cust-2',
    name: 'Anisur Rahman',
    email: 'anis@example.com',
    phone: '01887654321',
    address: 'Sylhet, Bangladesh',
    joinedDate: '2026-02-15',
    totalOrders: 4,
    status: 'Pending'
  }
];

export const BANNERS = [
  { id: 1, color: 'from-blue-600 to-blue-400', text: 'Flat 20% OFF on First Order!', code: 'PHARMA20' },
  { id: 2, color: 'from-indigo-600 to-indigo-400', text: 'Upload Prescription for Easy Refill', action: 'Upload Now' },
  { id: 3, color: 'from-blue-800 to-blue-600', text: 'Free Delivery on Orders Over ৳500', note: 'Limited Time Offer' },
];

export const PAYMENT_METHODS = [
  { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
  { id: 'bkash', name: 'bkash', icon: '📱' },
  { id: 'nagad', name: 'Nagad', icon: '📱' },
  { id: 'rocket', name: 'Rocket', icon: '📱' },
  { id: 'bank', name: 'Bank Transfer', icon: '🏦' },
];
