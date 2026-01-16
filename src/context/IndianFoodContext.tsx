import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { 
  IndianUserProfile, 
  IndianMenuItem, 
  IndianRestaurant, 
  FavoriteItem, 
  WeeklyMealPlan, 
  DailyMealPlan,
  MealPlanEntry,
  Achievement,
  FoodRating,
  ShoppingList,
  DietaryType,
  RegionalCuisine,
  SpiceLevel,
  FoodStyle,
  UserGoal,
  MealType
} from '@/types/indian-food';
import { indianMenuItems, indianRestaurants, getMealContext } from '@/data/indian-food-data';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface IndianFoodContextType {
  // User Profile
  userProfile: IndianUserProfile | null;
  setUserProfile: (profile: IndianUserProfile) => void;
  updateProfile: (updates: Partial<IndianUserProfile>) => void;
  isOnboardingComplete: boolean;
  completeOnboarding: () => void;
  
  // Menu Items & Restaurants
  menuItems: IndianMenuItem[];
  restaurants: IndianRestaurant[];
  
  // Favorites
  favorites: FavoriteItem[];
  addFavorite: (item: IndianMenuItem) => void;
  removeFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
  
  // Meal Planning
  mealPlan: WeeklyMealPlan;
  addToMealPlan: (date: string, mealType: keyof DailyMealPlan, entry: MealPlanEntry) => void;
  removeFromMealPlan: (date: string, mealType: keyof DailyMealPlan) => void;
  autoGenerateMealPlan: () => void;
  
  // Ratings
  ratings: Record<string, FoodRating>;
  rateFood: (itemId: string, rating: FoodRating) => void;
  
  // Shopping List
  shoppingList: ShoppingList | null;
  generateShoppingList: () => void;
  toggleShoppingItem: (category: string, itemName: string) => void;
  
  // Achievements
  achievements: Achievement[];
  
  // Recommendations
  getRecommendations: (limit?: number) => IndianMenuItem[];
  getTrendingItems: (limit?: number) => IndianMenuItem[];
  getItemsByBudget: (budget: number) => IndianMenuItem[];
  getItemsByMealType: (mealType: MealType) => IndianMenuItem[];
  
  // Language
  language: 'english' | 'hindi' | 'both';
  setLanguage: (lang: 'english' | 'hindi' | 'both') => void;
}

const IndianFoodContext = createContext<IndianFoodContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  profile: 'indian_food:profile',
  favorites: 'indian_food:favorites',
  mealPlan: 'indian_food:mealplan',
  ratings: 'indian_food:ratings',
  shoppingList: 'indian_food:shopping',
  achievements: 'indian_food:achievements',
  language: 'indian_food:language',
};

// Default achievements
const defaultAchievements: Achievement[] = [
  { id: 'regional_explorer', nameEn: 'Regional Explorer', nameHi: 'क्षेत्रीय खोजकर्ता', description: 'Try 8 different regional cuisines', icon: '🗺️', progress: { current: 0, target: 8 } },
  { id: 'street_food_lover', nameEn: 'Street Food Lover', nameHi: 'स्ट्रीट फूड प्रेमी', description: 'Try 20 street food items', icon: '🍲', progress: { current: 0, target: 20 } },
  { id: 'spice_king', nameEn: 'Spice King', nameHi: 'मसाला राजा', description: 'Try 10 extra spicy dishes', icon: '🌶️', progress: { current: 0, target: 10 } },
  { id: 'budget_master', nameEn: 'Budget Master', nameHi: 'बजट मास्टर', description: 'Save ₹5000 on meals', icon: '💰', progress: { current: 0, target: 5000 } },
  { id: 'home_chef', nameEn: 'Home Chef', nameHi: 'घर का शेफ', description: 'Cook 15 meals at home', icon: '👨‍🍳', progress: { current: 0, target: 15 } },
];

export function IndianFoodProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  // Initialize state from localStorage
  const [userProfile, setUserProfileState] = useState<IndianUserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.profile);
    return saved ? JSON.parse(saved) : null;
  });
  
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.favorites);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [mealPlan, setMealPlan] = useState<WeeklyMealPlan>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.mealPlan);
    return saved ? JSON.parse(saved) : {};
  });
  
  const [ratings, setRatings] = useState<Record<string, FoodRating>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ratings);
    return saved ? JSON.parse(saved) : {};
  });
  
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.shoppingList);
    return saved ? JSON.parse(saved) : null;
  });
  
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.achievements);
    return saved ? JSON.parse(saved) : defaultAchievements;
  });
  
  const [language, setLanguageState] = useState<'english' | 'hindi' | 'both'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.language);
    return (saved as 'english' | 'hindi' | 'both') || 'both';
  });

  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  // Load profile from database when user is authenticated
  useEffect(() => {
    async function loadProfileFromDB() {
      if (!user) {
        setIsProfileLoaded(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading profile:', error);
          return;
        }

        if (profile) {
          // Map database profile to IndianUserProfile
          const dbProfile: IndianUserProfile = {
            name: profile.name || user.email?.split('@')[0] || 'User',
            email: profile.email || user.email,
            location: {
              city: profile.city || '',
              state: profile.state || '',
            },
            dietary: (profile.dietary as DietaryType) || 'vegetarian',
            regionalPreferences: (profile.regional_preferences as RegionalCuisine[]) || ['north_indian', 'south_indian'],
            spiceLevel: (profile.spice_level as SpiceLevel) || 'medium',
            budgetMin: profile.budget_min || 100,
            budgetMax: profile.budget_max || 500,
            foodStyles: (profile.food_styles as FoodStyle[]) || ['home_style', 'restaurant_style'],
            goals: (profile.goals as UserGoal[]) || ['eat_healthier'],
            language: 'both',
            onboardingComplete: true,
            createdAt: new Date(profile.created_at),
          };
          setUserProfileState(dbProfile);
        }
        setIsProfileLoaded(true);
      } catch (err) {
        console.error('Error loading profile:', err);
        setIsProfileLoaded(true);
      }
    }

    loadProfileFromDB();
  }, [user]);

  // Sync profile to database when it changes
  const syncProfileToDB = useCallback(async (profile: IndianUserProfile) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          city: profile.location?.city,
          state: profile.location?.state,
          dietary: profile.dietary,
          regional_preferences: profile.regionalPreferences,
          spice_level: profile.spiceLevel,
          budget_min: profile.budgetMin,
          budget_max: profile.budgetMax,
          food_styles: profile.foodStyles,
          goals: profile.goals,
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error syncing profile:', error);
      }
    } catch (err) {
      console.error('Error syncing profile:', err);
    }
  }, [user]);

  // Persist to localStorage and sync to DB
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(userProfile));
      // Only sync to DB if profile is loaded and user is authenticated
      if (isProfileLoaded && user) {
        syncProfileToDB(userProfile);
      }
    }
  }, [userProfile, isProfileLoaded, user, syncProfileToDB]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.mealPlan, JSON.stringify(mealPlan));
  }, [mealPlan]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ratings, JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    if (shoppingList) {
      localStorage.setItem(STORAGE_KEYS.shoppingList, JSON.stringify(shoppingList));
    }
  }, [shoppingList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.language, language);
  }, [language]);

  // Profile functions
  const setUserProfile = useCallback((profile: IndianUserProfile) => {
    setUserProfileState(profile);
  }, []);

  const updateProfile = useCallback((updates: Partial<IndianUserProfile>) => {
    setUserProfileState(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const isOnboardingComplete = userProfile?.onboardingComplete ?? false;

  const completeOnboarding = useCallback(() => {
    setUserProfileState(prev => prev ? { ...prev, onboardingComplete: true } : null);
  }, []);

  // Favorites functions
  const addFavorite = useCallback((item: IndianMenuItem) => {
    const favoriteItem: FavoriteItem = {
      id: item.id,
      nameEn: item.nameEn,
      nameHi: item.nameHi,
      cuisine: item.region,
      regional: item.region,
      image: item.image,
      price: item.price,
      rating: 4.5,
      spiceLevel: item.spiceLevel,
      dietary: item.dietary,
      savedAt: new Date(),
    };
    setFavorites(prev => [...prev, favoriteItem]);
  }, []);

  const removeFavorite = useCallback((itemId: string) => {
    setFavorites(prev => prev.filter(f => f.id !== itemId));
  }, []);

  const isFavorite = useCallback((itemId: string) => {
    return favorites.some(f => f.id === itemId);
  }, [favorites]);

  // Meal planning functions
  const addToMealPlan = useCallback((date: string, mealType: keyof DailyMealPlan, entry: MealPlanEntry) => {
    setMealPlan(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [mealType]: entry,
      },
    }));
  }, []);

  const removeFromMealPlan = useCallback((date: string, mealType: keyof DailyMealPlan) => {
    setMealPlan(prev => {
      const updated = { ...prev };
      if (updated[date]) {
        delete updated[date][mealType];
      }
      return updated;
    });
  }, []);

  const autoGenerateMealPlan = useCallback(() => {
    const today = new Date();
    const newPlan: WeeklyMealPlan = {};
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Get random items for each meal
      const breakfastItems = indianMenuItems.filter(item => item.mealType.includes('breakfast'));
      const lunchItems = indianMenuItems.filter(item => item.mealType.includes('lunch'));
      const snackItems = indianMenuItems.filter(item => item.mealType.includes('snacks'));
      const dinnerItems = indianMenuItems.filter(item => item.mealType.includes('dinner'));
      
      const randomItem = (items: IndianMenuItem[]): MealPlanEntry | undefined => {
        if (items.length === 0) return undefined;
        const item = items[Math.floor(Math.random() * items.length)];
        return {
          id: item.id,
          nameEn: item.nameEn,
          nameHi: item.nameHi,
          cuisine: item.region,
          price: item.price.min,
          calories: item.calories,
          cookTime: item.cookTime,
          image: item.image,
        };
      };
      
      newPlan[dateStr] = {
        breakfast: randomItem(breakfastItems),
        lunch: randomItem(lunchItems),
        snacks: randomItem(snackItems),
        dinner: randomItem(dinnerItems),
      };
    }
    
    setMealPlan(newPlan);
  }, []);

  // Rating functions
  const rateFood = useCallback((itemId: string, rating: FoodRating) => {
    setRatings(prev => ({ ...prev, [itemId]: rating }));
  }, []);

  // Shopping list functions
  const generateShoppingList = useCallback(() => {
    // Generate shopping list from meal plan
    const ingredientMap: Record<string, { items: { name: string; nameHi: string; quantity: string }[] }> = {
      vegetables: { items: [] },
      pulses: { items: [] },
      spices: { items: [] },
      dairy: { items: [] },
      grains: { items: [] },
    };
    
    // Simplified shopping list generation
    Object.values(mealPlan).forEach(day => {
      Object.values(day).forEach(meal => {
        if (meal) {
          const menuItem = indianMenuItems.find(item => item.id === meal.id);
          if (menuItem) {
            menuItem.ingredients.forEach(ing => {
              // Add to vegetables by default (simplified)
              if (!ingredientMap.vegetables.items.find(i => i.name === ing.en)) {
                ingredientMap.vegetables.items.push({
                  name: ing.en,
                  nameHi: ing.hi,
                  quantity: '500g',
                });
              }
            });
          }
        }
      });
    });
    
    const list: ShoppingList = {
      weekStarting: new Date().toISOString().split('T')[0],
      items: [
        { category: 'Vegetables', categoryHi: 'सब्ज़ियाँ', items: ingredientMap.vegetables.items.map(i => ({ ...i, checked: false })) },
        { category: 'Pulses', categoryHi: 'दालें', items: [{ name: 'Toor dal', nameHi: 'अरहर दाल', quantity: '1 kg', checked: false }] },
        { category: 'Spices', categoryHi: 'मसाले', items: [{ name: 'Garam Masala', nameHi: 'गरम मसाला', quantity: '100g', checked: false }] },
        { category: 'Dairy', categoryHi: 'दूध उत्पाद', items: [{ name: 'Milk', nameHi: 'दूध', quantity: '2 L', checked: false }] },
        { category: 'Grains', categoryHi: 'अनाज', items: [{ name: 'Rice', nameHi: 'चावल', quantity: '2 kg', checked: false }] },
      ],
      totalEstimate: 1500,
    };
    
    setShoppingList(list);
  }, [mealPlan]);

  const toggleShoppingItem = useCallback((category: string, itemName: string) => {
    setShoppingList(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map(cat => {
          if (cat.category === category) {
            return {
              ...cat,
              items: cat.items.map(item => 
                item.name === itemName ? { ...item, checked: !item.checked } : item
              ),
            };
          }
          return cat;
        }),
      };
    });
  }, []);

  // Recommendation functions
  const getRecommendations = useCallback((limit: number = 10): IndianMenuItem[] => {
    if (!userProfile) return indianMenuItems.slice(0, limit);
    
    const mealContext = getMealContext();
    
    // Filter by user preferences
    let filtered = indianMenuItems.filter(item => {
      // Filter by dietary
      if (userProfile.dietary === 'vegetarian' && !item.isVeg) return false;
      if (userProfile.dietary === 'vegan' && !item.dietary.includes('vegan')) return false;
      if (userProfile.dietary === 'jain' && !item.isJainFriendly) return false;
      
      // Filter by budget
      if (item.price.min > userProfile.budgetMax) return false;
      
      // Prefer items matching meal time
      if (!item.mealType.includes(mealContext.meal)) return false;
      
      return true;
    });
    
    // Sort by regional preference
    filtered.sort((a, b) => {
      const aPreferred = userProfile.regionalPreferences.includes(a.region) ? 1 : 0;
      const bPreferred = userProfile.regionalPreferences.includes(b.region) ? 1 : 0;
      return bPreferred - aPreferred;
    });
    
    return filtered.slice(0, limit);
  }, [userProfile]);

  const getTrendingItems = useCallback((limit: number = 10): IndianMenuItem[] => {
    return indianMenuItems.filter(item => item.isBestseller).slice(0, limit);
  }, []);

  const getItemsByBudget = useCallback((budget: number): IndianMenuItem[] => {
    return indianMenuItems.filter(item => item.price.max <= budget);
  }, []);

  const getItemsByMealType = useCallback((mealType: MealType): IndianMenuItem[] => {
    return indianMenuItems.filter(item => item.mealType.includes(mealType));
  }, []);

  const setLanguage = useCallback((lang: 'english' | 'hindi' | 'both') => {
    setLanguageState(lang);
  }, []);

  const value: IndianFoodContextType = {
    userProfile,
    setUserProfile,
    updateProfile,
    isOnboardingComplete,
    completeOnboarding,
    menuItems: indianMenuItems,
    restaurants: indianRestaurants,
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    mealPlan,
    addToMealPlan,
    removeFromMealPlan,
    autoGenerateMealPlan,
    ratings,
    rateFood,
    shoppingList,
    generateShoppingList,
    toggleShoppingItem,
    achievements,
    getRecommendations,
    getTrendingItems,
    getItemsByBudget,
    getItemsByMealType,
    language,
    setLanguage,
  };

  return <IndianFoodContext.Provider value={value}>{children}</IndianFoodContext.Provider>;
}

export function useIndianFood() {
  const context = useContext(IndianFoodContext);
  if (context === undefined) {
    throw new Error('useIndianFood must be used within an IndianFoodProvider');
  }
  return context;
}
