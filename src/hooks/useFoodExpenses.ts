import { useState, useCallback, useEffect, useMemo } from 'react';
import { FoodExpense, DailyExpenseSummary, WeeklyExpenseSummary, MonthlyExpenseSummary, ExpenseBudget } from '@/types/expense';

const STORAGE_KEY = 'indian_food:expenses';
const BUDGET_KEY = 'indian_food:budget';

export function useFoodExpenses() {
  const [expenses, setExpenses] = useState<FoodExpense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [budget, setBudgetState] = useState<ExpenseBudget>(() => {
    const saved = localStorage.getItem(BUDGET_KEY);
    return saved ? JSON.parse(saved) : { monthly: 10000, weekly: 2500, daily: 400 };
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(budget));
  }, [budget]);

  // Add expense
  const addExpense = useCallback((expense: Omit<FoodExpense, 'id'>) => {
    const newExpense: FoodExpense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses(prev => [newExpense, ...prev]);
    return newExpense;
  }, []);

  // Update expense
  const updateExpense = useCallback((id: string, updates: Partial<FoodExpense>) => {
    setExpenses(prev =>
      prev.map(expense =>
        expense.id === id ? { ...expense, ...updates } : expense
      )
    );
  }, []);

  // Delete expense
  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
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
      byWeek: [], // Simplified for now
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
  const setBudget = useCallback((newBudget: Partial<ExpenseBudget>) => {
    setBudgetState(prev => ({ ...prev, ...newBudget }));
  }, []);

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
  };
}
