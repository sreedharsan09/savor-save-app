import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Moon, Sun, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockUser } from '@/data/mockData';

interface TopBarProps {
  onAddExpense: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function TopBar({ onAddExpense, isDarkMode, onToggleDarkMode }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 md:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Search Bar */}
        <motion.div
          className={cn(
            'relative flex-1 max-w-md transition-all duration-300',
            isSearchFocused && 'max-w-lg'
          )}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search restaurants, cuisines..."
            className={cn(
              'w-full pl-12 pr-4 py-3 rounded-xl',
              'bg-muted/50 border border-transparent',
              'focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20',
              'transition-all duration-300 placeholder:text-muted-foreground'
            )}
          />
        </motion.div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Add Expense Button */}
          <motion.button
            onClick={onAddExpense}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-bg text-white font-medium shadow-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span>Add Expense</span>
          </motion.button>

          {/* Mobile Add Button */}
          <motion.button
            onClick={onAddExpense}
            className="sm:hidden p-3 rounded-xl gradient-bg text-white shadow-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            onClick={onToggleDarkMode}
            className="p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber" />
            ) : (
              <Moon className="w-5 h-5 text-muted-foreground" />
            )}
          </motion.button>

          {/* Notifications */}
          <motion.button
            className="relative p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
          </motion.button>

          {/* Profile Avatar */}
          <motion.button
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={mockUser.avatar}
              alt={mockUser.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-border"
            />
          </motion.button>
        </div>
      </div>
    </header>
  );
}
