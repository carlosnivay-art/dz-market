
export const COLORS = {
  green: '#1E6B52',
  orange: '#FF7A3D',
  white: '#FFFFFF',
  gray: '#F3F4F6'
};

export const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda",
  "Skikda", "Sidi Bel Abbès", "Annabba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara",
  "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj", "Boumerدès", "El Tarf", "Tindouf", 
  "Tissemsilt", "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
  "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", "In Salah", 
  "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
];

export const MOCK_PRODUCTS: any[] = [
  {
    id: '1',
    name: 'سماعات رأس لاسلكية برو',
    price: 8500,
    oldPrice: 12000,
    category: 'electronics',
    image: 'https://picsum.photos/seed/headphones1/600/600',
    images: [
      'https://picsum.photos/seed/headphones1/600/600',
      'https://picsum.photos/seed/headphones2/600/600',
      'https://picsum.photos/seed/headphones3/600/600',
      'https://picsum.photos/seed/headphones4/600/600'
    ],
    rating: 4.8,
    reviewsCount: 124,
    sellerId: 's1',
    wilaya: 'الجزائر',
    isVerified: true,
    hasStudentDiscount: true,
    isFastDelivery: true,
    description: 'سماعات عالية الجودة مع عزل ضجيج نشط. تتميز ببطارية تدوم طويلاً وتصميم مريح للأذن.'
  },
  {
    id: '2',
    name: 'حذاء رياضي عصري',
    price: 4200,
    category: 'fashion',
    image: 'https://picsum.photos/seed/shoes1/600/600',
    images: [
      'https://picsum.photos/seed/shoes1/600/600',
      'https://picsum.photos/seed/shoes2/600/600',
      'https://picsum.photos/seed/shoes3/600/600'
    ],
    rating: 4.5,
    reviewsCount: 56,
    sellerId: 's2',
    wilaya: 'وهران',
    isVerified: false,
    hasStudentDiscount: false,
    isFastDelivery: true,
    description: 'حذاء مريح جدا للمشي والجري لمسافات طويلة. متوفر بألوان مختلفة وتصميم جزائري عصري.'
  },
  {
    id: '3',
    name: 'محفظة جلدية طبيعية',
    price: 2500,
    category: 'accessories',
    image: 'https://picsum.photos/seed/wallet1/600/600',
    images: [
      'https://picsum.photos/seed/wallet1/600/600',
      'https://picsum.photos/seed/wallet2/600/600'
    ],
    rating: 4.9,
    reviewsCount: 89,
    sellerId: 's1',
    wilaya: 'قسنطينة',
    isVerified: true,
    hasStudentDiscount: true,
    isFastDelivery: false,
    description: 'صناعة يدوية جزائرية 100% من الجلد الطبيعي الفاخر.'
  },
  {
    id: '4',
    name: 'طقم أقلام رسم للطلبة',
    price: 1500,
    category: 'student',
    image: 'https://picsum.photos/seed/pens1/600/600',
    images: [
      'https://picsum.photos/seed/pens1/600/600',
      'https://picsum.photos/seed/pens2/600/600'
    ],
    rating: 4.7,
    reviewsCount: 230,
    sellerId: 's3',
    wilaya: 'سطيف',
    isVerified: true,
    hasStudentDiscount: true,
    isFastDelivery: true,
    description: 'طقم متكامل لطلبة الفنون والهندسة المعمارية بجودة احترافية.'
  },
  {
    id: '5',
    name: 'ساعة ذكية S8',
    price: 6800,
    oldPrice: 7500,
    category: 'electronics',
    image: 'https://picsum.photos/seed/smartwatch1/600/600',
    images: [
      'https://picsum.photos/seed/smartwatch1/600/600',
      'https://picsum.photos/seed/smartwatch2/600/600',
      'https://picsum.photos/seed/smartwatch3/600/600'
    ],
    rating: 4.2,
    reviewsCount: 15,
    sellerId: 's2',
    wilaya: 'عنابة',
    isVerified: false,
    hasStudentDiscount: false,
    isFastDelivery: true,
    description: 'ساعة ذكية مقاومة للماء مع تتبع نبضات القلب وشاشة عالية الوضوح.'
  }
];
