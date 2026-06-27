
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date | string;
}

export type ReturnPolicyType = 'none' | '7days' | '14days';

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
  returnPolicy: ReturnPolicyType; // Return policy choice
}

export interface User {
  id: string;
  name: string;
  email?: string;
  role: 'buyer' | 'seller' | 'admin' | 'delivery_office' | 'partner_store'; // added 'delivery_office' and 'partner_store'
  phone: string;
  avatar: string;
  isStudent?: boolean;
  wilaya?: string;
  bio?: string;
  gender?: 'male' | 'female';
  address?: string;
  joinedDate: string; // date joined
  isVerified: boolean; // Seller verification status or Delivery Office approval status
  lastActive: string; // last active timestamp
  
  // Delivery Office specific optional fields
  coveredWilayas?: string[];
  deliveryPrices?: string; // Text description of prices or per-wilaya list
  wilayaPrices?: Record<string, number>; // Dictionary of prices per wilaya
  ordersCount?: number;
  rating?: number;
  reviewsCount?: number;
  subscriptionPlan?: 'free' | 'premium';
  isRecommended?: boolean; // recommendation badge for premium plans
  approvalStatus?: 'pending' | 'approved' | 'rejected'; // admin approval status for delivery office

  // Official Store (Partner Store) specific optional fields
  isOfficialStore?: boolean;
  followersCount?: number;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  storeApprovalStatus?: 'pending' | 'approved' | 'rejected';
  partnerSubscription?: 'free' | 'pro' | 'enterprise';
}

export interface Review {
  id: string;
  sellerId: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  rating: number; // 1 to 5
  comment: string;
  timestamp: string;
}

export interface VerificationRequest {
  id: string;
  sellerId: string;
  sellerName: string;
  phone: string;
  businessName: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

export interface Report {
  id: string;
  productId: string;
  productName: string;
  reporterId: string;
  reporterName: string;
  reason: 'fake_product' | 'inappropriate' | 'scam' | 'other';
  reasonText: string;
  status: 'pending' | 'resolved' | 'dismissed';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  chatId: string; // combination of participant IDs: "id1_id2"
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatThread {
  chatId: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface SalesData {
  month: string;
  sales: number;
  orders: number;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerWilaya: string;
  buyerAddress?: string;
  sellerId: string;
  status: 'pending' | 'shipping' | 'delivered' | 'cancelled';
  timestamp: string;
  paymentMethod: string;
  deliveryCompany?: string;
  deliveryPrice?: number;
  driverName?: string;
  driverPhone?: string;
  trackingHistory?: string; // JSON or comma-separated tracking stages
}

