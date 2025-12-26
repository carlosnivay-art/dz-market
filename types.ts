
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  image: string; // Keep for compatibility or as featured image
  images: string[]; // Array for gallery
  rating: number;
  reviewsCount: number;
  sellerId: string;
  sellerName: string;
  wilaya: string;
  isVerified: boolean;
  hasStudentDiscount: boolean;
  isFastDelivery: boolean;
  description: string;
  comments: Comment[];
}

export interface User {
  id: string;
  name: string;
  email?: string;
  role: 'buyer' | 'seller';
  phone: string;
  avatar: string;
  isStudent?: boolean;
}

export interface SalesData {
  month: string;
  sales: number;
  orders: number;
}
