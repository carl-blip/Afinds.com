export interface Product {
  id: number;
  name: string;
  price: number;
  category: 'men' | 'women';
  badge: 'Bestseller' | 'New' | 'Sale' | 'Only 3 left!' | 'Sold Out' | '';
  rating: number;
  reviews: number;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface Review {
  id: number;
  initials: string;
  name: string;
  rating: number;
  text: string;
  verified: boolean;
  date: string;
  fit?: 'small' | 'true' | 'large';
}

export interface Order {
  id: string; // Order Number like #AF-1094
  customerName: string;
  customerEmail: string;
  address: string;
  phone: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  date: string; // ISO date string
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
}
