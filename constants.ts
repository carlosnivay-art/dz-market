
export const COLORS = {
  green: '#1E6B52',
  orange: '#FF7A3D',
  white: '#FFFFFF',
  gray: '#F3F4F6',
  text: '#374151',
  border: '#E5E7EB'
};

export const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzو", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda",
  "Skikda", "Sidi Bel Abbès", "Annabba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara",
  "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj", "Boumerدès", "El Tarf", "Tindouf", 
  "Tissemsilt", "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
  "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", "In Salah", 
  "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
];

export type Language = 'ar' | 'fr' | 'en';

export const INTEREST_CATEGORIES = [
  { id: 'cars', label: 'سيارات ومركبات', emoji: '🚗' },
  { id: 'phones', label: 'هواتف ولوحات', emoji: '📱' },
  { id: 'computers', label: 'حواسيب وإعلام آلي', emoji: '💻' },
  { id: 'fashion', label: 'ملابس وأزياء', emoji: '👕' },
  { id: 'shoes', label: 'أحذية', emoji: '👟' },
  { id: 'livestock_sheep', label: 'أغنام ومواشي', emoji: '🐏' },
  { id: 'livestock_cow', label: 'أبقار وإنتاج حليبي', emoji: '🐄' },
  { id: 'realestate', label: 'عقارات وأراضي', emoji: '🏠' },
  { id: 'appliances', label: 'أجهزة كهرومنزلية', emoji: '📺' },
  { id: 'agriculture', label: 'معدات فلاحية', emoji: '🚜' },
  { id: 'construction', label: 'مواد بناء', emoji: '🏗️' },
  { id: 'sports', label: 'رياضة ولياقة', emoji: '⚽' },
  { id: 'beauty', label: 'تجميل وعناية', emoji: '✨' },
  { id: 'furniture', label: 'أثاث وديكور', emoji: '🛋️' }
];

export const TRANSLATIONS = {
  ar: {
    dir: 'rtl',
    brand: 'DZ MARKET',
    searchPlaceholder: 'واش راك تحوس اليوم على ديزاد ماركت؟',
    home: 'الرئيسية',
    notifications: 'الإشعارات',
    messages: 'الرسائل',
    heroTitle: 'تجربة تسوق فريدة مع DZ MARKET',
    heroBadge: 'سوق الجزائر الذكي 🇩🇿',
    startShopping: 'ابدأ التسوق الآن',
    trending: '🔥 الأكثر طلباً حالياً',
    backToShopping: 'العودة للتسوق',
    liveStream: 'شاهد البث المباشر',
    buyNow: 'اشتري الآن',
    totalPrice: 'السعر الإجمالي',
    specifications: 'المواصفات والوصف',
    points: 'نقطة مكافأة',
    logout: 'تسجيل الخروج',
    settings: 'الإعدادات والتفضيلات',
    saveSettings: 'حفظ الإعدادات',
    saving: 'جاري الحفظ...',
    saved: 'تم حفظ التغييرات',
    followers: 'متابع',
    following: 'يتابع',
    posts: 'منشورات',
    myPosts: 'منشوراتي',
    savedItems: 'المحفوظات',
    platinumBuyer: 'مشتري بلاتيني 💎',
    platinumSeller: 'بائع بلاتيني 💎',
    interestsTitle: 'وش يهمك أكثر؟',
    interestsSubtitle: 'اختر المجالات اللي تحبها باش نطلعولك واش تحوس بالضبط في ديزاد ماركت.',
    continue: 'استمرار'
  },
  fr: {
    dir: 'ltr',
    brand: 'DZ MARKET',
    searchPlaceholder: 'Que cherchez-vous aujourd\'hui sur DZ Market ?',
    home: 'Accueil',
    notifications: 'Notifications',
    messages: 'Messages',
    heroTitle: 'Expérience shopping unique avec DZ MARKET',
    heroBadge: 'Le marché intelligent d\'Algérie 🇩🇿',
    startShopping: 'Achetez maintenant',
    trending: '🔥 Les plus demandés',
    backToShopping: 'Retour au shopping',
    liveStream: 'Regarder le Live',
    buyNow: 'Acheter maintenant',
    totalPrice: 'Prix Total',
    specifications: 'Spécifications & Description',
    points: 'points bonus',
    logout: 'Déconnexion',
    settings: 'Paramètres & Préférences',
    saveSettings: 'Enregistrer',
    saving: 'Enregistrement...',
    saved: 'Modifications enregistrées',
    followers: 'Abonnés',
    following: 'Abonnements',
    posts: 'Posts',
    myPosts: 'Mes Posts',
    savedItems: 'Enregistrés',
    platinumBuyer: 'Acheteur Platinum 💎',
    platinumSeller: 'Vendeur Platinum 💎',
    interestsTitle: 'Qu\'est-ce qui vous intéresse ?',
    interestsSubtitle: 'Choisissez vos catégories préférées pour personnaliser votre flux.',
    continue: 'Continuer'
  },
  en: {
    dir: 'ltr',
    brand: 'DZ MARKET',
    searchPlaceholder: 'What are you looking for today on DZ Market?',
    home: 'Home',
    notifications: 'Notifications',
    messages: 'Messages',
    heroTitle: 'Unique shopping experience with DZ MARKET',
    heroBadge: 'Algeria\'s Smart Market 🇩🇿',
    startShopping: 'Start Shopping',
    trending: '🔥 Most Wanted Now',
    backToShopping: 'Back to Shopping',
    liveStream: 'Watch Live Stream',
    buyNow: 'Buy Now',
    totalPrice: 'Total Amount',
    specifications: 'Specs & Description',
    points: 'reward points',
    logout: 'Logout',
    settings: 'Settings & Preferences',
    saveSettings: 'Save Settings',
    saving: 'Saving...',
    saved: 'Changes Saved',
    followers: 'Followers',
    following: 'Following',
    posts: 'Posts',
    myPosts: 'My Posts',
    savedItems: 'Saved',
    platinumBuyer: 'Platinum Buyer 💎',
    platinumSeller: 'Platinum Seller 💎',
    interestsTitle: 'What interests you?',
    interestsSubtitle: 'Select your favorite categories to personalize your feed.',
    continue: 'Continue'
  }
};

export const MOCK_PRODUCTS: any[] = [
  {
    id: '1',
    name: 'سماعات رأس لاسلكية برو',
    price: 8500,
    oldPrice: 12000,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80'
    ],
    rating: 4.8,
    reviewsCount: 124,
    sellerId: 's1',
    wilaya: 'الجزائر',
    isVerified: true,
    hasStudentDiscount: true,
    isFastDelivery: true,
    description: 'سماعات عالية الجودة مع عزل ضجيج نشط من ديزاد ماركت. تتميز ببطارية تدوم طويلاً وتصميم مريح للأذن.'
  },
  {
    id: '2',
    name: 'حذاء رياضي عصري',
    price: 4200,
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80'
    ],
    rating: 4.5,
    reviewsCount: 56,
    sellerId: 's2',
    wilaya: 'وهران',
    isVerified: false,
    hasStudentDiscount: false,
    isFastDelivery: true,
    description: 'حذاء مريح جدا للمشي والجري لمسافات طويلة. متوفر بألوان مختلفة وتصميم جزائري عصري حصري على ديزاد ماركت.'
  }
];
