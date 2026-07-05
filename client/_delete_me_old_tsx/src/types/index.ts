export type Role = 'farmer' | 'buyer' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface Product {
  _id: string;
  seller: { _id: string; name: string; location?: string; phone?: string } | string;
  name: string;
  variety?: string;
  category: 'Crops' | 'Seeds' | 'Organic' | 'Tools';
  pricePerKg: number;
  availableQty: number;
  unit: string;
  location?: string;
  imageUrl?: string;
  listingType: 'retail' | 'bulk';
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderCode: string;
  buyer: { _id: string; name: string; location?: string; phone?: string } | string;
  seller: { _id: string; name: string; location?: string; phone?: string } | string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  deliveryAddress: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export interface CropRecord {
  _id: string;
  crop: string;
  variety?: string;
  areaRopani: number;
  productionKg: number;
  avgPrice: number;
  trend: 'up' | 'down' | 'flat';
  season?: string;
}

export interface Advisory {
  _id: string;
  type: 'weather' | 'pest' | 'fertilizer' | 'subsidy' | 'general';
  icon: string;
  message: string;
  region?: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface Service {
  _id: string;
  name: string;
  category: string;
  provider: string;
  location: string;
  contact: string;
}

export interface Shop {
  _id: string;
  name: string;
  tags: string[];
  location: string;
  distanceKm: number;
}

export interface AdminOverview {
  totalUsers: number;
  totalSellers: number;
  totalBuyers: number;
  totalOrders: number;
  totalProducts: number;
  ordersLast30Days: { date: string; count: number }[];
}
