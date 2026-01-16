import { useState, useCallback, useEffect, useMemo } from 'react';
import { FoodExpense, DailyExpenseSummary, WeeklyExpenseSummary, MonthlyExpenseSummary, ExpenseBudget } from '@/types/expense';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const BUDGET_KEY = 'indian_food:budget';

// Get current user ID
async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

// Helper to map database row to FoodExpense
function mapOrderToExpense(order: Record<string, unknown>): FoodExpense {
  return {
    id: order.id as string,
    foodId: (order.food_id as string) || undefined,
    foodName: order.food_name as string,
    restaurant: (order.restaurant as string) || undefined,
    category: order.category as FoodExpense['category'],
    amount: Number(order.amount),
    date: new Date(order.order_date as string),
    mealType: order.meal_type as FoodExpense['mealType'],
    cuisine: (order.cuisine as string) || undefined,
    notes: (order.notes as string) || undefined,
    image: (order.image as string) || undefined,
  };
}

export function useFoodExpenses() {
  const [expenses, setExpenses] = useState<FoodExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [budget, setBudgetState] = useState<ExpenseBudget>(() => {
    const saved = localStorage.getItem(BUDGET_KEY);
    return saved ? JSON.parse(saved) : { monthly: 10000, weekly: 2500, daily: 400 };
  });

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('food_orders')
        .select('*')
        .order('order_date', { ascending: false });

      if (error) throw error;

      const mappedExpenses = (data || []).map(order => mapOrderToExpense(order as Record<string, unknown>));
      setExpenses(mappedExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      // Fallback to localStorage
      const saved = localStorage.getItem('indian_food:expenses');
      if (saved) {
        setExpenses(JSON.parse(saved));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBudget = async () => {
    try {
      const { data, error } = await supabase
        .from('user_budgets')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setBudgetState({
          monthly: Number(data.monthly_budget),
          weekly: Number(data.weekly_budget),
          daily: Number(data.daily_budget),
        });
      }
    } catch (error) {
      console.error('Error fetching budget:', error);
    }
  };

  // Fetch expenses from Supabase on mount and setup realtime subscription
  useEffect(() => {
    fetchExpenses();
    fetchBudget();

    // Setup realtime subscription for food_orders
    const channel = supabase
      .channel('food_orders_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'food_orders',
        },
        (payload) => {
          const newExpense = mapOrderToExpense(payload.new as Record<string, unknown>);
          setExpenses(prev => {
            // Avoid duplicates (in case we already added it optimistically)
            if (prev.some(e => e.id === newExpense.id)) return prev;
            return [newExpense, ...prev];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'food_orders',
        },
        (payload) => {
          const updatedExpense = mapOrderToExpense(payload.new as Record<string, unknown>);
          setExpenses(prev =>
            prev.map(e => e.id === updatedExpense.id ? updatedExpense : e)
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'food_orders',
        },
        (payload) => {
          const deletedId = (payload.old as { id: string }).id;
          setExpenses(prev => prev.filter(e => e.id !== deletedId));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Persist budget to localStorage as backup
  useEffect(() => {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(budget));
  }, [budget]);

  // Add expense
  const addExpense = useCallback(async (expense: Omit<FoodExpense, 'id'>) => {
    const tempId = Date.now().toString();
    const newExpense: FoodExpense = {
      ...expense,
      id: tempId,
    };

    // Optimistic update
    setExpenses(prev => [newExpense, ...prev]);

    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        toast.error('Please log in to save orders');
        return newExpense;
      }

      const { data, error } = await supabase
        .from('food_orders')
        .insert({
          user_id: userId,
          food_id: expense.foodId || null,
          food_name: expense.foodName,
          restaurant: expense.restaurant || null,
          category: expense.category,
          amount: expense.amount,
          order_date: expense.date instanceof Date ? expense.date.toISOString() : expense.date,
          meal_type: expense.mealType,
          cuisine: expense.cuisine || null,
          notes: expense.notes || null,
          image: expense.image || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Update with real ID from database
      setExpenses(prev =>
        prev.map(e => e.id === tempId ? { ...e, id: data.id } : e)
      );

      toast.success('Order saved to cloud!');
      return { ...newExpense, id: data.id };
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to sync order to cloud');
      return newExpense;
    }
  }, []);

  // Update expense
  const updateExpense = useCallback(async (id: string, updates: Partial<FoodExpense>) => {
    // Optimistic update
    setExpenses(prev =>
      prev.map(expense =>
        expense.id === id ? { ...expense, ...updates } : expense
      )
    );

    try {
      const updateData: Record<string, unknown> = {};
      if (updates.foodId !== undefined) updateData.food_id = updates.foodId;
      if (updates.foodName !== undefined) updateData.food_name = updates.foodName;
      if (updates.restaurant !== undefined) updateData.restaurant = updates.restaurant;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.amount !== undefined) updateData.amount = updates.amount;
      if (updates.date !== undefined) updateData.order_date = updates.date instanceof Date ? updates.date.toISOString() : updates.date;
      if (updates.mealType !== undefined) updateData.meal_type = updates.mealType;
      if (updates.cuisine !== undefined) updateData.cuisine = updates.cuisine;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (updates.image !== undefined) updateData.image = updates.image;

      const { error } = await supabase
        .from('food_orders')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Failed to update order');
    }
  }, []);

  // Delete expense
  const deleteExpense = useCallback(async (id: string) => {
    // Optimistic update
    setExpenses(prev => prev.filter(expense => expense.id !== id));

    try {
      const { error } = await supabase
        .from('food_orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Order deleted');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete order');
      // Refetch to restore state
      fetchExpenses();
    }
  }, []);

  // Get today's expenses
  const getTodayExpenses = useCallback(() => {
    const today = new Date().toDateString();
    return expenses.filter(e => new Date(e.date).toDateString() === today);
  }, [expenses]);

  // Get total spent today
  const getTodayTotal = useCallback(() => {
    return getTodayExpenses().reduce((sum, e) => sum + e.amount, 0);
  }, [getTodayExpenses]);

  // Get this week's expenses
  const getWeekExpenses = useCallback(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    return expenses.filter(e => new Date(e.date) >= weekStart);
  }, [expenses]);

  // Get weekly total
  const getWeekTotal = useCallback(() => {
    return getWeekExpenses().reduce((sum, e) => sum + e.amount, 0);
  }, [getWeekExpenses]);

  // Get this month's expenses
  const getMonthExpenses = useCallback(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return expenses.filter(e => new Date(e.date) >= monthStart);
  }, [expenses]);

  // Get monthly total
  const getMonthTotal = useCallback(() => {
    return getMonthExpenses().reduce((sum, e) => sum + e.amount, 0);
  }, [getMonthExpenses]);

  // Get spending by category
  const getSpendingByCategory = useCallback(() => {
    return expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
  }, [expenses]);

  // Get spending by cuisine
  const getSpendingByCuisine = useCallback(() => {
    return expenses.reduce((acc, expense) => {
      if (expense.cuisine) {
        acc[expense.cuisine] = (acc[expense.cuisine] || 0) + expense.amount;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [expenses]);

  // Get spending by meal type
  const getSpendingByMealType = useCallback(() => {
    return expenses.reduce((acc, expense) => {
      acc[expense.mealType] = (acc[expense.mealType] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
  }, [expenses]);

  // Get recent expenses
  const getRecentExpenses = useCallback((limit: number = 5) => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }, [expenses]);

  // Get daily summary for a specific date
  const getDailySummary = useCallback((date: Date): DailyExpenseSummary => {
    const dateStr = date.toDateString();
    const dayExpenses = expenses.filter(e => new Date(e.date).toDateString() === dateStr);
    
    return {
      date: date.toISOString().split('T')[0],
      total: dayExpenses.reduce((sum, e) => sum + e.amount, 0),
      meals: dayExpenses.length,
      expenses: dayExpenses,
    };
  }, [expenses]);

  // Get weekly summary
  const getWeeklySummary = useCallback((): WeeklyExpenseSummary => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const weekExpenses = getWeekExpenses();
    const total = weekExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    return {
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0],
      total,
      averagePerDay: total / 7,
      byCategory: weekExpenses.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
      }, {} as Record<string, number>),
      byCuisine: weekExpenses.reduce((acc, e) => {
        if (e.cuisine) acc[e.cuisine] = (acc[e.cuisine] || 0) + e.amount;
        return acc;
      }, {} as Record<string, number>),
      byMealType: weekExpenses.reduce((acc, e) => {
        acc[e.mealType] = (acc[e.mealType] || 0) + e.amount;
        return acc;
      }, {} as Record<string, number>),
    };
  }, [getWeekExpenses]);

  // Get monthly summary
  const getMonthlySummary = useCallback((): MonthlyExpenseSummary => {
    const monthExpenses = getMonthExpenses();
    const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const now = new Date();
    
    // Group by cuisine
    const cuisineMap = monthExpenses.reduce((acc, e) => {
      if (e.cuisine) acc[e.cuisine] = (acc[e.cuisine] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);
    
    // Group by restaurant
    const restaurantMap = monthExpenses.reduce((acc, e) => {
      if (e.restaurant) acc[e.restaurant] = (acc[e.restaurant] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
      total,
      budget: budget.monthly,
      remaining: budget.monthly - total,
      percentUsed: (total / budget.monthly) * 100,
      byWeek: [],
      topCuisines: Object.entries(cuisineMap)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5),
      topRestaurants: Object.entries(restaurantMap)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5),
    };
  }, [getMonthExpenses, budget]);

  // Set budget
  const setBudget = useCallback(async (newBudget: Partial<ExpenseBudget>) => {
    const updatedBudget = { ...budget, ...newBudget };
    setBudgetState(updatedBudget);

    try {
      const userId = await getCurrentUserId();
      if (!userId) return;

      // Check if budget exists for this user
      const { data: existing } = await supabase
        .from('user_budgets')
        .select('id')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('user_budgets')
          .update({
            monthly_budget: updatedBudget.monthly,
            weekly_budget: updatedBudget.weekly,
            daily_budget: updatedBudget.daily,
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('user_budgets')
          .insert({
            user_id: userId,
            monthly_budget: updatedBudget.monthly,
            weekly_budget: updatedBudget.weekly,
            daily_budget: updatedBudget.daily,
          });
      }
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  }, [budget]);

  // Budget status
  const budgetStatus = useMemo(() => {
    const monthTotal = getMonthTotal();
    const percentUsed = (monthTotal / budget.monthly) * 100;
    
    return {
      monthly: {
        spent: monthTotal,
        budget: budget.monthly,
        remaining: budget.monthly - monthTotal,
        percentUsed,
        status: percentUsed > 90 ? 'danger' : percentUsed > 70 ? 'warning' : 'healthy',
      },
      weekly: {
        spent: getWeekTotal(),
        budget: budget.weekly,
        remaining: budget.weekly - getWeekTotal(),
        percentUsed: (getWeekTotal() / budget.weekly) * 100,
      },
      daily: {
        spent: getTodayTotal(),
        budget: budget.daily,
        remaining: budget.daily - getTodayTotal(),
        percentUsed: (getTodayTotal() / budget.daily) * 100,
      },
    };
  }, [budget, getMonthTotal, getWeekTotal, getTodayTotal]);

  return {
    expenses,
    budget,
    isLoading,
    addExpense,
    updateExpense,
    deleteExpense,
    getTodayExpenses,
    getTodayTotal,
    getWeekExpenses,
    getWeekTotal,
    getMonthExpenses,
    getMonthTotal,
    getSpendingByCategory,
    getSpendingByCuisine,
    getSpendingByMealType,
    getRecentExpenses,
    getDailySummary,
    getWeeklySummary,
    getMonthlySummary,
    setBudget,
    budgetStatus,
    refetch: fetchExpenses,
  };
}
