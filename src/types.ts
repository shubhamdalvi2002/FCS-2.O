export interface Product {
  id: string;
  name: string;
  category: 'Chicken' | 'Eggs';
  price: number;
  unit: string;
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
  cutType?: string;
  totalPrice: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  deliveryType: 'Delivery' | 'Pickup';
  paymentMethod: 'UPI' | 'Card' | 'COD';
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: 'Order Received' | 'Preparing' | 'Out for Delivery' | 'Delivered';
  createdAt: string;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  productsSoldToday: number;
}
