import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, Heart } from 'lucide-react';
import { RestaurantCard } from '@/components/restaurants/RestaurantCard';
import { mockRestaurants, cuisineCategories, dietaryOptions } from '@/data/mockData';
import { cn, getPriceRangeDisplay } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';

export function DiscoverView() {
  const { toggleFavorite, isFavorite } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([1, 4]);
  const [showFilters, setShowFilters] = useState(false);
  const [showOpenOnly, setShowOpenOnly] = useState(false);

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const toggleDietary = (option: string) => {
    setSelectedDietary((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const filteredRestaurants = mockRestaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.some((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCuisine =
      selectedCuisines.length === 0 ||
      restaurant.cuisine.some((c) => selectedCuisines.includes(c));

    const matchesDietary =
      selectedDietary.length === 0 ||
      restaurant.dietaryOptions.some((d) => selectedDietary.includes(d));

    const matchesPrice =
      restaurant.priceRange >= priceRange[0] &&
      restaurant.priceRange <= priceRange[1];

    const matchesOpen = !showOpenOnly || restaurant.isOpen;

    return matchesSearch && matchesCuisine && matchesDietary && matchesPrice && matchesOpen;
  });

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Discover</h1>
        <p className="text-muted-foreground">
          Find your next favorite meal
        </p>
      </motion.div>

      {/* Search & Filters */}
      <div className="sticky top-20 z-30 -mx-4 px-4 md:-mx-8 md:px-8 py-4 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants, cuisines..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/50 border border-transparent focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Filter Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'p-3 rounded-xl transition-all',
              showFilters
                ? 'gradient-bg text-white shadow-glow'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            )}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Cuisine Chips */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {cuisineCategories.map((cuisine) => (
            <motion.button
              key={cuisine}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleCuisine(cuisine)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all',
                selectedCuisines.includes(cuisine)
                  ? 'gradient-bg text-white shadow-lg'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              )}
            >
              {cuisine}
            </motion.button>
          ))}
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 rounded-xl bg-card border border-border/50 space-y-4"
          >
            {/* Open Now Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Open Now</label>
              <button
                onClick={() => setShowOpenOnly(!showOpenOnly)}
                className={cn(
                  'w-12 h-6 rounded-full transition-colors relative',
                  showOpenOnly ? 'bg-primary' : 'bg-muted-foreground/30'
                )}
              >
                <motion.div
                  animate={{ x: showOpenOnly ? 24 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5"
                />
              </button>
            </div>

            {/* Dietary Options */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Dietary Preferences</label>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map((option) => (
                  <motion.button
                    key={option}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleDietary(option)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                      selectedDietary.includes(option)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Price Range</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((price) => (
                  <motion.button
                    key={price}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (priceRange[0] === price && priceRange[1] === price) {
                        setPriceRange([1, 4]);
                      } else {
                        setPriceRange([price, price]);
                      }
                    }}
                    className={cn(
                      'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
                      priceRange[0] <= price && priceRange[1] >= price
                        ? 'gradient-bg text-white'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {getPriceRangeDisplay(price)}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSelectedCuisines([]);
                setSelectedDietary([]);
                setPriceRange([1, 4]);
                setShowOpenOnly(false);
              }}
              className="text-sm text-primary font-medium"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Active Filters */}
      {(selectedCuisines.length > 0 || selectedDietary.length > 0 || showOpenOnly) && (
        <div className="flex flex-wrap gap-2">
          {showOpenOnly && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm"
            >
              Open Now
              <button onClick={() => setShowOpenOnly(false)}>
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          )}
          {selectedCuisines.map((cuisine) => (
            <motion.span
              key={cuisine}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
            >
              {cuisine}
              <button onClick={() => toggleCuisine(cuisine)}>
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
          {selectedDietary.map((option) => (
            <motion.span
              key={option}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-sm"
            >
              {option}
              <button onClick={() => toggleDietary(option)}>
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
        </div>
      )}

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        {filteredRestaurants.length} restaurants found
      </p>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant, index) => (
          <RestaurantCard 
            key={restaurant.id} 
            restaurant={restaurant} 
            index={index}
            isFavorite={isFavorite(restaurant.id)}
            onToggleFavorite={() => toggleFavorite(restaurant.id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredRestaurants.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-4xl mb-4">🍽️</p>
          <h3 className="text-xl font-bold mb-2">No restaurants found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </motion.div>
      )}
    </div>
  );
}
