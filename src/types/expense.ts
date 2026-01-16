// Expense Tracker Types

export interface FoodExpense {
  id: string;
  foodId?: string;
  foodName: string;
  restaurant?: string;
  category: 'dine-in' | 'delivery' | 'takeout' | 'home-cooked' | 'street-food';
  amount: number;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  cuisine?: string;
  notes?: string;
  image?: string;
}

export interface DailyExpenseSummary {
  date: string;
  total: number;
  meals: number;
  expenses: FoodExpense[];
}

export interface WeeklyExpenseSummary {
  weekStart: string;
  weekEnd: string;
  total: number;
  averagePerDay: number;
  byCategory: Record<string, number>;
  byCuisine: Record<string, number>;
  byMealType: Record<string, number>;
}

export interface MonthlyExpenseSummary {
  month: string;
  total: number;
  budget: number;
  remaining: number;
  percentUsed: number;
  byWeek: { week: number; total: number }[];
  topCuisines: { name: string; amount: number }[];
  topRestaurants: { name: string; amount: number }[];
}

export interface ExpenseBudget {
  monthly: number;
  weekly: number;
  daily: number;
}
