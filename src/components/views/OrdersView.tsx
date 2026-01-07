import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Search, Filter, Download, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Expense } from '@/types';
import { cn, formatIndianNumber } from '@/lib/utils';

interface OrdersViewProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const getCategoryEmoji = (category: string) => {
  const emojis: Record<string, string> = {
    'Dine-in': '🍽️',
    'Delivery': '🛵',
    'Takeout': '🥡',
    'Coffee & Drinks': '☕',
    'Groceries': '🛒',
    'Desserts': '🍰',
    'Bars & Pubs': '🍻',
    'Special Events': '🎉',
  };
  return emojis[category] || '🍽️';
};

export function OrdersView({ expenses, onDelete }: OrdersViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(expenses.map((e) => e.category))];

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedByDate = filteredExpenses.reduce((acc, expense) => {
    const dateKey = format(new Date(expense.date), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">
            {expenses.length} total orders
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 hover:bg-muted text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Export
        </motion.button>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/50 border border-transparent focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all',
              !selectedCategory
                ? 'gradient-bg text-white'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            )}
          >
            All
          </motion.button>
          {categories.map((category) => (
            <motion.button
              key={category}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all',
                selectedCategory === category
                  ? 'gradient-bg text-white'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              )}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Orders Timeline */}
      <div className="space-y-6">
        {sortedDates.map((dateKey) => (
          <div key={dateKey}>
            {/* Date Header */}
            <div className="sticky top-20 z-10 py-2 bg-background/80 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-muted-foreground">
                {format(new Date(dateKey), 'EEEE, MMMM d, yyyy')}
              </h3>
            </div>

            {/* Orders for Date */}
            <div className="space-y-3 mt-3">
              {groupedByDate[dateKey].map((expense, index) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-xl p-4 group"
                >
                  <div className="flex items-start gap-4">
                    {/* Emoji Icon */}
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                      {getCategoryEmoji(expense.category)}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold truncate">{expense.restaurant}</h4>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span>{format(new Date(expense.date), 'h:mm a')}</span>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                            <span>{expense.category}</span>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                            <span>{expense.cuisine}</span>
                          </div>
                        </div>
                        <span className="text-lg font-bold">₹{formatIndianNumber(expense.amount)}</span>
                      </div>

                      {/* Split Bill Info */}
                      {expense.splitBill && (
                        <div className="mt-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-sm inline-block">
                          Split with {expense.splitBill.people} people • Your share: ₹{formatIndianNumber(expense.splitBill.yourShare)}
                        </div>
                      )}

                      {/* Notes */}
                      {expense.notes && (
                        <p className="mt-2 text-sm text-muted-foreground">{expense.notes}</p>
                      )}

                      {/* Payment Method */}
                      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                        <span className="px-2 py-1 rounded-full bg-muted">{expense.paymentMethod}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-primary/10 text-primary"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(expense.id)}
                        className="p-2 rounded-lg bg-destructive/10 text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredExpenses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-4xl mb-4">📋</p>
          <h3 className="text-xl font-bold mb-2">No orders found</h3>
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory
              ? 'Try adjusting your filters'
              : 'Start tracking your food expenses!'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
