import { motion } from 'framer-motion';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { RecommendedCarousel } from '@/components/restaurants/RecommendedCarousel';
import { mockRestaurants, mockUser } from '@/data/mockData';
import { Expense } from '@/types';

interface DashboardViewProps {
  expenses: Expense[];
  totalSpent: number;
  budgetRemaining: number;
  budgetPercentage: number;
}

export function DashboardView({
  expenses,
  totalSpent,
  budgetRemaining,
  budgetPercentage,
}: DashboardViewProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const trendingRestaurants = mockRestaurants.filter((r) => r.trending);
  const mealsThisWeek = expenses.filter(
    (e) => new Date(e.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-2xl md:text-3xl font-bold">
          {getGreeting()}, {mockUser.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground">
          Craving something special today?
        </p>
      </motion.div>

      {/* Stats Cards */}
      <StatsCards
        totalSpent={totalSpent}
        mealsThisWeek={mealsThisWeek}
        favoriteCuisine="Italian"
        budgetRemaining={budgetRemaining}
        budgetPercentage={budgetPercentage}
      />

      {/* Charts & Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart />
        <RecentOrders expenses={expenses} />
      </div>

      {/* Recommended Restaurants */}
      <RecommendedCarousel
        restaurants={trendingRestaurants}
        title="Trending Near You 🔥"
        subtitle="Popular picks based on your preferences"
      />

      {/* More Recommendations */}
      <RecommendedCarousel
        restaurants={mockRestaurants.slice(3, 8)}
        title="Because You Loved Italian..."
        subtitle="Similar restaurants you might enjoy"
      />
    </div>
  );
}
