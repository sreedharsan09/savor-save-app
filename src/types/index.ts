export interface Expense {
  id: string;
  amount: number;
  category: string;
  cuisine: string;
  restaurant: string;
  date: Date;
  paymentMethod: string;
  notes: string;
  receiptUrl?: string;
  splitBill?: { total: number; people: number; yourShare: number };
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  priceRange: number;
  rating: number;
  reviewCount: number;
  distance: number;
  deliveryTime: string;
  imageUrl: string;
  dietaryOptions: string[];
  spiceLevel: number;
  trending: boolean;
  isOpen: boolean;
}

export interface Budget {
  monthly: number;
  spent: number;
  categories: { [key: string]: number };
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  avatar: string;
  dietaryPreferences: string[];
  favoriteCuisines: string[];
  spiceTolerance?: 'mild' | 'medium' | 'hot' | 'extra-hot';
  monthlyBudget?: number;
}
