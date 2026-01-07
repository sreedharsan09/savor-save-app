import { Expense, Restaurant, Budget, UserProfile } from '@/types';

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Bella Napoli',
    cuisine: ['Italian', 'Pizza'],
    priceRange: 2,
    rating: 4.8,
    reviewCount: 342,
    distance: 1.2,
    deliveryTime: '25-35 min',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop',
    dietaryOptions: ['Vegetarian'],
    spiceLevel: 1,
    trending: true,
    isOpen: true,
  },
  {
    id: '2',
    name: 'Tokyo Garden',
    cuisine: ['Japanese', 'Sushi'],
    priceRange: 3,
    rating: 4.9,
    reviewCount: 521,
    distance: 2.5,
    deliveryTime: '30-40 min',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop',
    dietaryOptions: ['Gluten-Free'],
    spiceLevel: 1,
    trending: true,
    isOpen: true,
  },
  {
    id: '3',
    name: 'Spice Kingdom',
    cuisine: ['Indian', 'Curry'],
    priceRange: 2,
    rating: 4.7,
    reviewCount: 289,
    distance: 0.8,
    deliveryTime: '20-30 min',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop',
    dietaryOptions: ['Vegetarian', 'Vegan'],
    spiceLevel: 3,
    trending: false,
    isOpen: true,
  },
  {
    id: '4',
    name: 'El Mexicano',
    cuisine: ['Mexican', 'Tacos'],
    priceRange: 1,
    rating: 4.5,
    reviewCount: 178,
    distance: 1.5,
    deliveryTime: '15-25 min',
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop',
    dietaryOptions: ['Vegetarian', 'Gluten-Free'],
    spiceLevel: 2,
    trending: false,
    isOpen: true,
  },
  {
    id: '5',
    name: 'Golden Dragon',
    cuisine: ['Chinese', 'Dim Sum'],
    priceRange: 2,
    rating: 4.6,
    reviewCount: 412,
    distance: 3.2,
    deliveryTime: '35-45 min',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop',
    dietaryOptions: [],
    spiceLevel: 2,
    trending: true,
    isOpen: true,
  },
  {
    id: '6',
    name: 'Mediterranean Breeze',
    cuisine: ['Mediterranean', 'Greek'],
    priceRange: 2,
    rating: 4.7,
    reviewCount: 234,
    distance: 1.8,
    deliveryTime: '25-35 min',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop',
    dietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-Free'],
    spiceLevel: 1,
    trending: false,
    isOpen: true,
  },
  {
    id: '7',
    name: 'Seoul Kitchen',
    cuisine: ['Korean', 'BBQ'],
    priceRange: 3,
    rating: 4.8,
    reviewCount: 367,
    distance: 2.1,
    deliveryTime: '30-40 min',
    imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop',
    dietaryOptions: ['Gluten-Free'],
    spiceLevel: 3,
    trending: true,
    isOpen: true,
  },
  {
    id: '8',
    name: 'Thai Orchid',
    cuisine: ['Thai', 'Noodles'],
    priceRange: 2,
    rating: 4.6,
    reviewCount: 198,
    distance: 1.0,
    deliveryTime: '20-30 min',
    imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&auto=format&fit=crop',
    dietaryOptions: ['Vegetarian', 'Vegan'],
    spiceLevel: 3,
    trending: false,
    isOpen: true,
  },
];

export const mockExpenses: Expense[] = [
  {
    id: '1',
    amount: 45.80,
    category: 'Dine-in',
    cuisine: 'Italian',
    restaurant: 'Bella Napoli',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    paymentMethod: 'Credit Card',
    notes: 'Birthday dinner',
  },
  {
    id: '2',
    amount: 32.50,
    category: 'Delivery',
    cuisine: 'Japanese',
    restaurant: 'Tokyo Garden',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    paymentMethod: 'Wallet',
    notes: 'Friday sushi night',
  },
  {
    id: '3',
    amount: 18.90,
    category: 'Takeout',
    cuisine: 'Mexican',
    restaurant: 'El Mexicano',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48),
    paymentMethod: 'Cash',
    notes: 'Quick lunch',
  },
  {
    id: '4',
    amount: 28.40,
    category: 'Delivery',
    cuisine: 'Indian',
    restaurant: 'Spice Kingdom',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72),
    paymentMethod: 'Credit Card',
    notes: '',
  },
  {
    id: '5',
    amount: 52.00,
    category: 'Dine-in',
    cuisine: 'Korean',
    restaurant: 'Seoul Kitchen',
    date: new Date(Date.now() - 1000 * 60 * 60 * 96),
    paymentMethod: 'Debit Card',
    notes: 'Team lunch',
    splitBill: { total: 156, people: 3, yourShare: 52 },
  },
  {
    id: '6',
    amount: 15.50,
    category: 'Coffee & Drinks',
    cuisine: 'Cafe',
    restaurant: 'Brew & Bean',
    date: new Date(Date.now() - 1000 * 60 * 60 * 120),
    paymentMethod: 'Wallet',
    notes: 'Morning coffee',
  },
  {
    id: '7',
    amount: 38.20,
    category: 'Delivery',
    cuisine: 'Thai',
    restaurant: 'Thai Orchid',
    date: new Date(Date.now() - 1000 * 60 * 60 * 144),
    paymentMethod: 'Credit Card',
    notes: 'Movie night dinner',
  },
];

export const mockBudget: Budget = {
  monthly: 800,
  spent: 485.30,
  categories: {
    'Dine-in': 200,
    'Delivery': 250,
    'Takeout': 150,
    'Coffee & Drinks': 100,
    'Groceries': 100,
  },
};

export const mockUser: UserProfile = {
  name: 'Alex Chen',
  email: 'alex@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop',
  dietaryPreferences: ['Vegetarian-friendly'],
  favoriteCuisines: ['Italian', 'Japanese', 'Thai'],
};

export const cuisineCategories = [
  'Italian', 'Japanese', 'Indian', 'Mexican', 'Chinese', 
  'Thai', 'Korean', 'Mediterranean', 'Vietnamese', 'Greek'
];

export const dietaryOptions = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Halal'
];

export const expenseCategories = [
  { id: 'dine-in', label: 'Dine-in', icon: '🍽️' },
  { id: 'delivery', label: 'Delivery', icon: '🛵' },
  { id: 'takeout', label: 'Takeout', icon: '🥡' },
  { id: 'coffee', label: 'Coffee & Drinks', icon: '☕' },
  { id: 'groceries', label: 'Groceries', icon: '🛒' },
  { id: 'desserts', label: 'Desserts', icon: '🍰' },
  { id: 'bars', label: 'Bars & Pubs', icon: '🍻' },
  { id: 'special', label: 'Special Events', icon: '🎉' },
];

export const paymentMethods = [
  'Cash', 'Credit Card', 'Debit Card', 'UPI', 'Wallet'
];

export const weeklySpendingData = [
  { day: 'Mon', amount: 45 },
  { day: 'Tue', amount: 32 },
  { day: 'Wed', amount: 18 },
  { day: 'Thu', amount: 28 },
  { day: 'Fri', amount: 67 },
  { day: 'Sat', amount: 85 },
  { day: 'Sun', amount: 42 },
];

export const categorySpendingData = [
  { name: 'Dine-in', value: 145, color: '#FF6B35' },
  { name: 'Delivery', value: 180, color: '#F7931E' },
  { name: 'Takeout', value: 65, color: '#10B981' },
  { name: 'Coffee', value: 55, color: '#8B5CF6' },
  { name: 'Other', value: 40, color: '#6B7280' },
];

export const cuisineSpendingData = [
  { cuisine: 'Italian', amount: 125, orders: 4 },
  { cuisine: 'Japanese', amount: 98, orders: 3 },
  { cuisine: 'Korean', amount: 85, orders: 2 },
  { cuisine: 'Thai', amount: 72, orders: 3 },
  { cuisine: 'Indian', amount: 65, orders: 2 },
  { cuisine: 'Mexican', amount: 45, orders: 2 },
];
