import { Product, User, Review, VerificationRequest, Report, ChatMessage, ChatThread, Order } from '../types';

// Helper to load from localStorage
const loadData = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);
  if (!item) return defaultValue;
  try {
    return JSON.parse(item) as T;
  } catch (e) {
    console.error(`Error parsing localStorage key ${key}`, e);
    return defaultValue;
  }
};

// Helper to save to localStorage
const saveData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- INITIAL DATA ---
const INITIAL_USERS: User[] = [
  {
    id: 'admin_id',
    name: 'أدمن ديزاد ماركت',
    email: 'admin@dz-market.com',
    role: 'admin',
    phone: '0550112233',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin',
    wilaya: 'الجزائر',
    bio: 'لوحة التحكم وإدارة سوق ديزاد ماركت الآمن 🇩🇿',
    joinedDate: '2024-01-01',
    isVerified: true,
    lastActive: new Date().toISOString()
  },
  {
    id: 'u2',
    name: 'محمد بلقاسم',
    email: 'mohamed@gmail.com',
    role: 'buyer',
    phone: '0661998877',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Mohamed',
    wilaya: 'وهران',
    bio: 'محب للتسوق والسلع الفريدة 🛍️',
    joinedDate: '2025-03-12',
    isVerified: false,
    lastActive: new Date().toISOString()
  },
  {
    id: 's1',
    name: 'متجر النخلة',
    email: 'nakhla@store.dz',
    role: 'seller',
    phone: '0770454545',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Nakhla',
    wilaya: 'غرداية',
    bio: 'نوفر لكم أفضل التمور والمنتجات التقليدية الجزائرية بجودة ممتازة 🌴',
    joinedDate: '2024-10-15',
    isVerified: true,
    lastActive: new Date().toISOString()
  },
  {
    id: 's2',
    name: 'DZ Tech',
    email: 'tech@dz-market.dz',
    role: 'seller',
    phone: '0555334411',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Tech',
    wilaya: 'الجزائر',
    bio: 'مستلزمات الحواسيب، الهواتف، والأجهزة الإلكترونية مع توصيل سريع 🔌📱',
    joinedDate: '2025-01-20',
    isVerified: true,
    lastActive: new Date().toISOString()
  },
  {
    id: 'do1',
    name: 'سريع ديزاد للتوصيل',
    email: 'sariaa@dz-delivery.dz',
    role: 'delivery_office',
    phone: '0560123456',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sariaa',
    wilaya: 'وهران',
    bio: 'أفضل خدمة توصيل سريع وموثوق في الغرب والوسط الجزائري مع تتبع كامل للطلبات والموثوقية التامة 📦🇩🇿',
    joinedDate: '2025-02-10',
    isVerified: true,
    lastActive: new Date().toISOString(),
    coveredWilayas: ['الجزائر', 'وهران', 'قسنطينة', 'سيدي بلعباس', 'تلمسان'],
    deliveryPrices: 'توصيل للمنزل: 600 دج | توصيل للمكتب: 400 دج | الولايات البعيدة: 800 دج',
    ordersCount: 142,
    rating: 4.8,
    reviewsCount: 2,
    subscriptionPlan: 'premium',
    isRecommended: true,
    approvalStatus: 'approved'
  },
  {
    id: 'do2',
    name: 'الفنك السريع للتوصيل والخدمات',
    email: 'fenek@dz-express.dz',
    role: 'delivery_office',
    phone: '0552789456',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Fenek',
    wilaya: 'الجزائر',
    bio: 'توصيل طرود التجارة الإلكترونية للمنزل خلال 24 ساعة فقط في العاصمة والولايات المجاورة 🦊💨',
    joinedDate: '2025-04-18',
    isVerified: true,
    lastActive: new Date().toISOString(),
    coveredWilayas: ['الجزائر', 'البليدة', 'تيبازة', 'بومرداس'],
    deliveryPrices: 'سعر موحد: 450 دج لجميع ولايات العاصمة والبليدة المجاورة',
    ordersCount: 64,
    rating: 4.2,
    reviewsCount: 1,
    subscriptionPlan: 'free',
    isRecommended: false,
    approvalStatus: 'approved'
  },
  {
    id: 'do3',
    name: 'البرق الجزائر للتوصيل والطرود',
    email: 'barq@delivery.dz',
    role: 'delivery_office',
    phone: '0773556677',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Barq',
    wilaya: 'سطيف',
    bio: 'مكتب توصيل ناشئ مخصص لتوصيل الطرود والأمانات للولايات الشرقية بجودة ممتازة وسعر تنافسي ⚡',
    joinedDate: '2026-06-20',
    isVerified: false,
    lastActive: new Date().toISOString(),
    coveredWilayas: ['سطيف', 'باتنة', 'قسنطينة', 'جيجل'],
    deliveryPrices: 'توصيل للمنزل: 550 دج | توصيل للمكتب: 350 دج',
    ordersCount: 12,
    rating: 5.0,
    reviewsCount: 0,
    subscriptionPlan: 'free',
    isRecommended: false,
    approvalStatus: 'pending'
  },
  {
    id: 'ps1',
    name: 'كـونـدور الـجزائر - Condor',
    email: 'contact@condor.dz',
    role: 'partner_store',
    phone: '035001122',
    avatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&q=80',
    wilaya: 'برج بوعريريج',
    bio: 'الحساب الرسمي المعتمد لشركة كوندور اليكترونيكس الجزائر. رائد الصناعات الإلكترونية والكهرومنزلية في شمال إفريقيا 🇩🇿🔋',
    joinedDate: '2024-05-12',
    isVerified: true,
    isOfficialStore: true,
    followersCount: 1420,
    socialLinks: {
      facebook: 'https://facebook.com/condor',
      instagram: 'https://instagram.com/condor',
      website: 'https://www.condor.dz'
    },
    storeApprovalStatus: 'approved',
    partnerSubscription: 'enterprise',
    ordersCount: 520,
    rating: 4.9,
    reviewsCount: 42,
    lastActive: new Date().toISOString()
  },
  {
    id: 'ps2',
    name: 'ديزاد تيك المعتمد - DZ Tech Pro',
    email: 'store@dztechpro.com',
    role: 'partner_store',
    phone: '021002233',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
    wilaya: 'الجزائر',
    bio: 'متجرنا الرسمي يقدم أفضل عروض الهواتف الذكية والحواسيب المحمولة وقطع الغيار الأصلية مع ضمان الوكيل المعتمد 💻📱',
    joinedDate: '2025-01-05',
    isVerified: true,
    isOfficialStore: true,
    followersCount: 890,
    socialLinks: {
      facebook: 'https://facebook.com/dztechpro',
      instagram: 'https://instagram.com/dztechpro',
      website: 'https://www.dztechpro.com'
    },
    storeApprovalStatus: 'approved',
    partnerSubscription: 'pro',
    ordersCount: 280,
    rating: 4.7,
    reviewsCount: 19,
    lastActive: new Date().toISOString()
  },
  {
    id: 'ps3',
    name: 'مجوهرات النخبة الجزائرية',
    email: 'elite.jewels@outlook.com',
    role: 'partner_store',
    phone: '0555667788',
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=150&q=80',
    wilaya: 'قسنطينة',
    bio: 'صناعة يدوية وتصميم أرقى المجوهرات والذهب الجزائري التقليدي والعصري لجميع المناسبات ✨💍',
    joinedDate: '2026-06-25',
    isVerified: false,
    isOfficialStore: false,
    followersCount: 120,
    socialLinks: {
      instagram: 'https://instagram.com/elite_gold'
    },
    storeApprovalStatus: 'pending',
    partnerSubscription: 'free',
    ordersCount: 0,
    rating: 5.0,
    reviewsCount: 0,
    lastActive: new Date().toISOString()
  }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p_condor_1',
    name: 'شاشة كوندور الذكية 43" Ultra HD Smart TV',
    price: 48000,
    oldPrice: 55000,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80',
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&q=80'
    ],
    rating: 4.9,
    reviewsCount: 1,
    sellerId: 'ps1',
    sellerName: 'كـونـدور الـجزائر - Condor',
    wilaya: 'برج بوعريريج',
    isVerified: true,
    hasStudentDiscount: true,
    isFastDelivery: true,
    description: 'تلفزيون كوندور الذكي بجودة رائعة 4K Ultra HD، يدعم تطبيقات نتفليكس ويوتيوب وشاهد مع جودة صوت محيطي Dolby وضمان عامين من كوندور.',
    comments: [],
    returnPolicy: '14days'
  },
  {
    id: 'p_condor_2',
    name: 'مكيف هواء كوندور إنفرتر 12000 وحدة',
    price: 68000,
    oldPrice: 72000,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=800&q=80'
    ],
    rating: 4.5,
    reviewsCount: 0,
    sellerId: 'ps1',
    sellerName: 'كـونـدور الـجزائر - Condor',
    wilaya: 'برج بوعريريج',
    isVerified: true,
    hasStudentDiscount: false,
    isFastDelivery: true,
    description: 'مكيف هواء إنفرتر اقتصادي يوفر حتى 60% من الطاقة الكهربائية، هادئ تماماً ومثالي لغرف النوم والمعيشة وله ضمان ممتد.',
    comments: [],
    returnPolicy: '14days'
  },
  {
    id: 'p_ouedkniss_1',
    name: 'حاسوب Asus ROG Gaming المحمول',
    price: 145000,
    oldPrice: 160000,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80'
    ],
    rating: 4.7,
    reviewsCount: 1,
    sellerId: 'ps2',
    sellerName: 'ديزاد تيك المعتمد - DZ Tech Pro',
    wilaya: 'الجزائر',
    isVerified: true,
    hasStudentDiscount: true,
    isFastDelivery: false,
    description: 'حاسوب ألعاب وتصميم خارق بمعالج Intel Core i7 وبطاقة رسوميات RTX 4060 لضمان أفضل أداء للألعاب الثقيلة والبرامج الهندسية.',
    comments: [],
    returnPolicy: '7days'
  },
  {
    id: '1',
    name: 'سماعات DZ MARKET برو اللاسلكية',
    price: 8500,
    oldPrice: 12000,
    category: 'phones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80'
    ],
    rating: 4.8,
    reviewsCount: 4,
    sellerId: 's2',
    sellerName: 'DZ Tech',
    wilaya: 'الجزائر',
    isVerified: true,
    hasStudentDiscount: true,
    isFastDelivery: true,
    description: 'أفضل تجربة صوتية في الجزائر مع ميزة إلغاء الضوضاء وتصميم حصري لمنصة DZ MARKET.',
    comments: [],
    returnPolicy: '14days'
  },
  {
    id: '2',
    name: 'حذاء رياضي عصري سنيكرز',
    price: 4500,
    oldPrice: 6000,
    category: 'shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80'
    ],
    rating: 4.5,
    reviewsCount: 2,
    sellerId: 's1',
    sellerName: 'متجر النخلة',
    wilaya: 'وهران',
    isVerified: true,
    hasStudentDiscount: false,
    isFastDelivery: true,
    description: 'حذاء رياضي يجمع بين الراحة والأناقة الجزائرية. مثالي للاستخدام اليومي والرياضي ومصنوع من خامات مرنة.',
    comments: [],
    returnPolicy: '7days'
  },
  {
    id: '3',
    name: 'هاتف ذكي DZ Note 10 Pro',
    price: 35000,
    oldPrice: 38000,
    category: 'phones',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'
    ],
    rating: 4.2,
    reviewsCount: 1,
    sellerId: 's2',
    sellerName: 'DZ Tech',
    wilaya: 'الجزائر',
    isVerified: true,
    hasStudentDiscount: true,
    isFastDelivery: false,
    description: 'شاشة AMOLED خارقة بتردد 120Hz وبطارية عملاقة تدوم يومين كاملين مع شاحن فائق السرعة 67 واط.',
    comments: [],
    returnPolicy: 'none'
  }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    sellerId: 's2',
    buyerId: 'u2',
    buyerName: 'محمد بلقاسم',
    buyerAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Mohamed',
    rating: 5,
    comment: 'تعامل راقي جداً والسلعة أصلية وجديدة. أنصح بالتعامل معه!',
    timestamp: '2026-06-25T14:30:00.000Z'
  },
  {
    id: 'r2',
    sellerId: 's2',
    buyerId: 'u2',
    buyerName: 'ياسين الجزائري',
    buyerAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Yacine',
    rating: 4,
    comment: 'التوصيل سريع والعلبة سليمة. السماعات جودتها ممتازة مقارنة بالسعر.',
    timestamp: '2026-06-26T09:15:00.000Z'
  },
  {
    id: 'r3',
    sellerId: 's1',
    buyerId: 'u2',
    buyerName: 'محمد بلقاسم',
    buyerAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Mohamed',
    rating: 5,
    comment: 'أفضل حذاء شريته في الجزائر مريح للغاية وخفيف.',
    timestamp: '2026-06-24T18:20:00.000Z'
  },
  {
    id: 'r_do1_1',
    sellerId: 'do1',
    buyerId: 'u2',
    buyerName: 'محمد بلقاسم',
    buyerAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Mohamed',
    rating: 5,
    comment: 'تعاملت مع هذا المكتب عدة مرات، سرعة في تسليم المبالغ والتوصيل ممتاز للمنزل في وهران.',
    timestamp: '2026-06-25T11:00:00.000Z'
  },
  {
    id: 'r_do1_2',
    sellerId: 'do1',
    buyerId: 'buyer_yacine',
    buyerName: 'ياسين الجزائري',
    buyerAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Yacine',
    rating: 5,
    comment: 'التوصيل سريع ومعاملة محترمة جداً، شكراً جزيلاً لكم.',
    timestamp: '2026-06-26T14:20:00.000Z'
  },
  {
    id: 'r_do2_1',
    sellerId: 'do2',
    buyerId: 'u2',
    buyerName: 'محمد بلقاسم',
    buyerAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Mohamed',
    rating: 4,
    comment: 'توصيل سريع في الجزائر العاصمة وضواحيها. الأسعار ممتازة والتوقيت دقيق.',
    timestamp: '2026-06-26T15:30:00.000Z'
  }
];

const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep1',
    productId: '3',
    productName: 'هاتف ذكي DZ Note 10 Pro',
    reporterId: 'u2',
    reporterName: 'محمد بلقاسم',
    reason: 'fake_product',
    reasonText: 'السعر المسجل مرتفع ومواصفات الكاميرا غير مطابقة للواقع.',
    status: 'pending',
    timestamp: '2026-06-26T21:40:00.000Z'
  }
];

const INITIAL_VERIFICATION_REQUESTS: VerificationRequest[] = [
  {
    id: 'vreq1',
    sellerId: 's1',
    sellerName: 'متجر النخلة',
    phone: '0770454545',
    businessName: 'النخلة للتمور والصناعات التقليدية',
    status: 'approved',
    timestamp: '2026-06-20T11:00:00.000Z'
  },
  {
    id: 'vreq2',
    sellerId: 's2',
    sellerName: 'DZ Tech',
    phone: '0555334411',
    businessName: 'ديزاد تيك للأجهزة الإلكترونية',
    status: 'approved',
    timestamp: '2026-06-21T15:30:00.000Z'
  }
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    chatId: 'u2_s1',
    senderId: 'u2',
    receiverId: 's1',
    text: 'السلام عليكم أخي، هل الحذاء الرياضي متوفر بمقاس 42؟',
    timestamp: '2026-06-26T10:00:00.000Z',
    isRead: true
  },
  {
    id: 'm2',
    chatId: 'u2_s1',
    senderId: 's1',
    receiverId: 'u2',
    text: 'وعليكم السلام ورحمة الله وبركاته يا فندم! نعم متوفر مقاس 42 باللونين الأسود والأحمر 🌴',
    timestamp: '2026-06-26T10:15:00.000Z',
    isRead: true
  },
  {
    id: 'm3',
    chatId: 'u2_s1',
    senderId: 'u2',
    receiverId: 's1',
    text: 'رائع، كم يستغرق التوصيل لوهران؟',
    timestamp: '2026-06-26T10:20:00.000Z',
    isRead: false
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord1',
    productId: 'p_condor_1',
    productName: 'شاشة كوندور الذكية 43" Ultra HD Smart TV',
    productPrice: 48000,
    productImage: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80',
    buyerId: 'u2',
    buyerName: 'محمد بلقاسم',
    buyerPhone: '0661998877',
    buyerWilaya: 'وهران',
    buyerAddress: 'حي الياسمين، عمارة ب، شقة 5',
    sellerId: 'ps1',
    status: 'pending',
    timestamp: '2026-06-26T18:00:00.000Z',
    paymentMethod: 'cod'
  },
  {
    id: 'ord2',
    productId: 'p_ouedkniss_1',
    productName: 'حاسوب Asus ROG Gaming المحمول',
    productPrice: 145000,
    productImage: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',
    buyerId: 'u2',
    buyerName: 'محمد بلقاسم',
    buyerPhone: '0661998877',
    buyerWilaya: 'وهران',
    buyerAddress: 'حي الياسمين، عمارة ب، شقة 5',
    sellerId: 'ps2',
    status: 'delivered',
    timestamp: '2026-06-25T10:00:00.000Z',
    paymentMethod: 'baridimob'
  }
];

// --- DB CLASS LAYER ---
class DZDatabase {
  private users: User[] = [];
  private products: Product[] = [];
  private reviews: Review[] = [];
  private reports: Report[] = [];
  private verifications: VerificationRequest[] = [];
  private messages: ChatMessage[] = [];
  private orders: Order[] = [];

  constructor() {
    this.init();
  }

  private init() {
    this.users = loadData<User[]>('dz_users', INITIAL_USERS);
    this.products = loadData<Product[]>('dz_products', INITIAL_PRODUCTS);
    this.reviews = loadData<Review[]>('dz_reviews', INITIAL_REVIEWS);
    this.reports = loadData<Report[]>('dz_reports', INITIAL_REPORTS);
    this.verifications = loadData<VerificationRequest[]>('dz_verifications', INITIAL_VERIFICATION_REQUESTS);
    this.messages = loadData<ChatMessage[]>('dz_messages', INITIAL_MESSAGES);
    this.orders = loadData<Order[]>('dz_orders', INITIAL_ORDERS);

    // Save back to ensure keys are populated in localstorage
    this.saveAll();
  }

  private saveAll() {
    saveData('dz_users', this.users);
    saveData('dz_products', this.products);
    saveData('dz_reviews', this.reviews);
    saveData('dz_reports', this.reports);
    saveData('dz_verifications', this.verifications);
    saveData('dz_messages', this.messages);
    saveData('dz_orders', this.orders);
  }

  // --- USER METHODS ---
  getUsers(): User[] {
    return this.users;
  }

  getUser(id: string): User | undefined {
    const user = this.users.find(u => u.id === id);
    if (user) {
      // Update lastActive timestamp on lookup
      user.lastActive = new Date().toISOString();
      this.saveAll();
    }
    return user;
  }

  createUser(user: Omit<User, 'joinedDate' | 'isVerified' | 'lastActive'>): User {
    const newUser: User = {
      ...user,
      joinedDate: new Date().toISOString().split('T')[0],
      isVerified: false,
      lastActive: new Date().toISOString()
    };
    this.users.push(newUser);
    this.saveAll();
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...updates };
    this.saveAll();
    return this.users[index];
  }

  deleteUser(id: string): boolean {
    const initialLen = this.users.length;
    this.users = this.users.filter(u => u.id !== id);
    // Also cleanup products of this seller
    this.products = this.products.filter(p => p.sellerId !== id);
    this.saveAll();
    return this.users.length < initialLen;
  }

  // --- PRODUCT METHODS ---
  getProducts(): Product[] {
    return this.products;
  }

  getProduct(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  createProduct(product: Omit<Product, 'id' | 'rating' | 'reviewsCount' | 'comments'>): Product {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substring(2, 9),
      rating: 5.0,
      reviewsCount: 0,
      comments: []
    };
    this.products.push(newProduct);
    this.saveAll();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...updates };
    this.saveAll();
    return this.products[index];
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    this.saveAll();
    return this.products.length < initialLen;
  }

  // --- SELLER REVIEW METHODS ---
  getReviewsForSeller(sellerId: string): Review[] {
    return this.reviews.filter(r => r.sellerId === sellerId);
  }

  addReview(review: Omit<Review, 'id' | 'timestamp'>): Review {
    const newReview: Review = {
      ...review,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString()
    };
    this.reviews.push(newReview);

    // Update the seller rating in all their products
    this.updateSellerRatingCache(review.sellerId);
    this.saveAll();
    return newReview;
  }

  private updateSellerRatingCache(sellerId: string) {
    const sellerReviews = this.reviews.filter(r => r.sellerId === sellerId);
    if (sellerReviews.length === 0) return;

    const totalStars = sellerReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = parseFloat((totalStars / sellerReviews.length).toFixed(1));

    // Update in products table
    this.products = this.products.map(p => {
      if (p.sellerId === sellerId) {
        return {
          ...p,
          rating: avgRating,
          reviewsCount: sellerReviews.length
        };
      }
      return p;
    });

    // Update in users table (e.g. delivery offices)
    this.users = this.users.map(u => {
      if (u.id === sellerId) {
        return {
          ...u,
          rating: avgRating,
          reviewsCount: sellerReviews.length
        };
      }
      return u;
    });
  }

  // --- TRUSTED SELLER VERIFICATION REQUESTS ---
  getVerificationRequests(): VerificationRequest[] {
    return this.verifications;
  }

  createVerificationRequest(sellerId: string, businessName: string, phone: string): VerificationRequest {
    const seller = this.getUser(sellerId);
    const newReq: VerificationRequest = {
      id: Math.random().toString(36).substring(2, 9),
      sellerId,
      sellerName: seller?.name || 'بائع مجهول',
      phone,
      businessName,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    // Check if request already exists, if so overwrite pending
    this.verifications = this.verifications.filter(v => v.sellerId !== sellerId);
    this.verifications.push(newReq);
    this.saveAll();
    return newReq;
  }

  updateVerificationStatus(reqId: string, status: 'approved' | 'rejected'): boolean {
    const req = this.verifications.find(v => v.id === reqId);
    if (!req) return false;

    req.status = status;
    if (status === 'approved') {
      // Set user/seller verified flag
      this.updateUser(req.sellerId, { isVerified: true });
      // Update all their products verification badge
      this.products = this.products.map(p => {
        if (p.sellerId === req.sellerId) {
          return { ...p, isVerified: true };
        }
        return p;
      });
    } else {
      // Set user/seller verified flag to false
      this.updateUser(req.sellerId, { isVerified: false });
      this.products = this.products.map(p => {
        if (p.sellerId === req.sellerId) {
          return { ...p, isVerified: false };
        }
        return p;
      });
    }

    this.saveAll();
    return true;
  }

  // --- REPORT SYSTEM METHODS ---
  getReports(): Report[] {
    return this.reports;
  }

  createReport(productId: string, reporterId: string, reason: Report['reason'], reasonText: string): Report {
    const product = this.getProduct(productId);
    const reporter = this.getUser(reporterId);

    const newReport: Report = {
      id: Math.random().toString(36).substring(2, 9),
      productId,
      productName: product?.name || 'منتج محذوف',
      reporterId,
      reporterName: reporter?.name || 'مشتري مجهول',
      reason,
      reasonText,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    this.reports.push(newReport);
    this.saveAll();
    return newReport;
  }

  updateReportStatus(reportId: string, status: 'resolved' | 'dismissed'): boolean {
    const report = this.reports.find(r => r.id === reportId);
    if (!report) return false;

    report.status = status;
    this.saveAll();
    return true;
  }

  // --- CHAT SYSTEM METHODS ---
  getMessages(): ChatMessage[] {
    return this.messages;
  }

  // Get combination ID for direct chat participants
  private getChatId(id1: string, id2: string): string {
    return [id1, id2].sort().join('_');
  }

  getChatHistory(id1: string, id2: string): ChatMessage[] {
    const cid = this.getChatId(id1, id2);
    // Mark as read for current active receiver
    this.messages = this.messages.map(m => {
      if (m.chatId === cid && m.receiverId === id1) {
        return { ...m, isRead: true };
      }
      return m;
    });
    this.saveAll();
    return this.messages.filter(m => m.chatId === cid);
  }

  sendMessage(senderId: string, receiverId: string, text: string): ChatMessage {
    const cid = this.getChatId(senderId, receiverId);
    const newMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      chatId: cid,
      senderId,
      receiverId,
      text,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    this.messages.push(newMsg);
    this.saveAll();
    return newMsg;
  }

  // Load user threads for Message list screen
  getChatThreads(userId: string): ChatThread[] {
    const userMsg = this.messages.filter(m => m.senderId === userId || m.receiverId === userId);
    const threadsMap = new Map<string, ChatMessage[]>();

    userMsg.forEach(m => {
      const partnerId = m.senderId === userId ? m.receiverId : m.senderId;
      if (!threadsMap.has(partnerId)) {
        threadsMap.set(partnerId, []);
      }
      threadsMap.get(partnerId)!.push(m);
    });

    const threads: ChatThread[] = [];

    threadsMap.forEach((msgs, partnerId) => {
      const partner = this.getUser(partnerId);
      if (!partner) return; // skip if deleted user

      // Sort messages by time
      msgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      const lastMsg = msgs[msgs.length - 1];

      const unreadCount = msgs.filter(m => m.receiverId === userId && !m.isRead).length;

      // format time relative
      const timeStr = new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      threads.push({
        chatId: this.getChatId(userId, partnerId),
        participantId: partnerId,
        participantName: partner.name,
        participantAvatar: partner.avatar,
        participantRole: partner.role,
        lastMessage: lastMsg.text,
        lastMessageTime: timeStr,
        unreadCount
      });
    });

    // Sort threads so the most recent messages are at the top
    return threads.sort((a, b) => b.lastMessageTime.localeCompare(a.lastMessageTime));
  }

  getUnreadCountTotal(userId: string): number {
    return this.messages.filter(m => m.receiverId === userId && !m.isRead).length;
  }

  // --- STATS FOR ADMIN ---
  getStats() {
    return {
      totalUsers: this.users.length,
      totalSellers: this.users.filter(u => u.role === 'seller').length,
      totalBuyers: this.users.filter(u => u.role === 'buyer').length,
      totalProducts: this.products.length,
      totalReports: this.reports.length,
      pendingReports: this.reports.filter(r => r.status === 'pending').length,
      pendingVerifications: this.verifications.filter(v => v.status === 'pending').length,
      verifiedSellersCount: this.users.filter(u => u.role === 'seller' && u.isVerified).length,
      totalDeliveryOffices: this.users.filter(u => u.role === 'delivery_office').length,
      pendingDeliveryOffices: this.users.filter(u => u.role === 'delivery_office' && u.approvalStatus === 'pending').length,
      totalPartnerStores: this.users.filter(u => u.role === 'partner_store').length,
      pendingPartnerStores: this.users.filter(u => u.role === 'partner_store' && u.storeApprovalStatus === 'pending').length,
    };
  }

  // --- ORDER METHODS ---
  getOrders(): Order[] {
    return this.orders;
  }

  getOrdersForSeller(sellerId: string): Order[] {
    return this.orders.filter(o => o.sellerId === sellerId);
  }

  createOrder(orderData: Omit<Order, 'id' | 'timestamp' | 'status'>): Order {
    const newOrder: Order = {
      ...orderData,
      id: 'ord_' + Math.random().toString(36).substring(2, 9),
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    this.orders.push(newOrder);
    this.saveAll();
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order['status']): boolean {
    const ord = this.orders.find(o => o.id === orderId);
    if (!ord) return false;
    ord.status = status;
    this.saveAll();
    return true;
  }

  updateOrder(orderId: string, updatedFields: Partial<Order>): boolean {
    const idx = this.orders.findIndex(o => o.id === orderId);
    if (idx === -1) return false;
    this.orders[idx] = { ...this.orders[idx], ...updatedFields };
    this.saveAll();
    return true;
  }

  // --- PARTNER STORE METHODS ---
  getPartnerStores(): User[] {
    return this.users.filter(u => u.role === 'partner_store');
  }

  getPartnerStoresApproved(): User[] {
    return this.users.filter(u => u.role === 'partner_store' && u.storeApprovalStatus === 'approved');
  }

  approvePartnerStore(id: string): boolean {
    const store = this.users.find(u => u.id === id);
    if (!store) return false;
    store.storeApprovalStatus = 'approved';
    store.isVerified = true;
    store.isOfficialStore = true; // By default, approving a partner store registers it as official
    this.saveAll();
    return true;
  }

  rejectPartnerStore(id: string): boolean {
    const store = this.users.find(u => u.id === id);
    if (!store) return false;
    store.storeApprovalStatus = 'rejected';
    store.isVerified = false;
    store.isOfficialStore = false;
    this.saveAll();
    return true;
  }

  toggleOfficialStoreBadge(id: string): boolean {
    const store = this.users.find(u => u.id === id);
    if (!store) return false;
    store.isOfficialStore = !store.isOfficialStore;
    this.saveAll();
    return true;
  }

  updatePartnerStoreSubscription(id: string, plan: 'free' | 'pro' | 'enterprise'): boolean {
    const store = this.users.find(u => u.id === id);
    if (!store) return false;
    store.partnerSubscription = plan;
    this.saveAll();
    return true;
  }

  registerPartnerStore(store: Omit<User, 'id' | 'joinedDate' | 'isVerified' | 'lastActive'>): User {
    const newStore: User = {
      ...store,
      id: 'ps_' + Math.random().toString(36).substring(2, 9),
      joinedDate: new Date().toISOString().split('T')[0],
      isVerified: false,
      lastActive: new Date().toISOString(),
      storeApprovalStatus: 'pending',
      partnerSubscription: 'free',
      isOfficialStore: false,
      followersCount: 0,
      ordersCount: 0,
      rating: 5.0,
      reviewsCount: 0
    };
    this.users.push(newStore);
    this.saveAll();
    return newStore;
  }

  // --- DELIVERY OFFICE METHODS ---
  getDeliveryOffices(): User[] {
    return this.users.filter(u => u.role === 'delivery_office');
  }

  approveDeliveryOffice(id: string): boolean {
    const office = this.users.find(u => u.id === id);
    if (!office) return false;
    office.approvalStatus = 'approved';
    office.isVerified = true;
    this.saveAll();
    return true;
  }

  rejectDeliveryOffice(id: string): boolean {
    const office = this.users.find(u => u.id === id);
    if (!office) return false;
    office.approvalStatus = 'rejected';
    office.isVerified = false;
    this.saveAll();
    return true;
  }

  updateDeliveryOfficeSubscription(id: string, plan: 'free' | 'premium'): boolean {
    const office = this.users.find(u => u.id === id);
    if (!office) return false;
    office.subscriptionPlan = plan;
    office.isRecommended = plan === 'premium';
    this.saveAll();
    return true;
  }

  registerDeliveryOffice(office: Omit<User, 'id' | 'joinedDate' | 'isVerified' | 'lastActive'>): User {
    const newOffice: User = {
      ...office,
      id: Math.random().toString(36).substring(2, 9),
      joinedDate: new Date().toISOString().split('T')[0],
      isVerified: false,
      lastActive: new Date().toISOString(),
      approvalStatus: 'pending',
      subscriptionPlan: 'free',
      isRecommended: false,
      ordersCount: 0,
      rating: 5.0,
      reviewsCount: 0
    };
    this.users.push(newOffice);
    this.saveAll();
    return newOffice;
  }
}

export const db = new DZDatabase();
