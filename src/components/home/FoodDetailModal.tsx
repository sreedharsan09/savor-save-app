import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Star, Clock, Flame, IndianRupee, ChevronDown, MapPin, Share2, ShoppingBag } from 'lucide-react';
import { IndianMenuItem } from '@/types/indian-food';
import { formatPrice, getSpiceDisplay } from '@/data/indian-food-data';
import { cn } from '@/lib/utils';
import { useIndianFood } from '@/context/IndianFoodContext';

interface FoodDetailModalProps {
  item: IndianMenuItem;
  isOpen: boolean;
  onClose: () => void;
}

export function FoodDetailModal({ item, isOpen, onClose }: FoodDetailModalProps) {
  const { addFavorite, removeFavorite, isFavorite, restaurants } = useIndianFood();
  const [showNutrition, setShowNutrition] = useState(false);
  const [isLiked, setIsLiked] = useState(isFavorite(item.id));

  // Find restaurants that serve this item
  const availableRestaurants = restaurants.filter(r => 
    r.menuItems.some(mi => mi.id === item.id)
  ).slice(0, 3);

  const toggleFavorite = () => {
    if (isLiked) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
    setIsLiked(!isLiked);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 top-[5%] z-50 bg-background rounded-t-3xl overflow-hidden flex flex-col"
          >
            {/* Header image */}
            <div className="relative h-56 shrink-0">
              <img
                src={item.image}
                alt={item.nameEn}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 left-4 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white">
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleFavorite}
                  className={cn(
                    "p-2 rounded-full backdrop-blur-sm transition-all",
                    isLiked ? "bg-red-500 text-white" : "bg-black/30 text-white"
                  )}
                >
                  <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                </button>
              </div>

              {/* Badges */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <span className={cn(
                  "px-3 py-1 rounded-full text-white text-sm font-semibold",
                  item.isVeg ? "bg-green-600" : "bg-red-600"
                )}>
                  {item.isVeg ? '🟢 Vegetarian' : '🔴 Non-Veg'}
                </span>
                {item.isJainFriendly && (
                  <span className="px-3 py-1 rounded-full bg-yellow-500 text-white text-sm font-semibold">
                    🙏 Jain-friendly
                  </span>
                )}
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto pb-24">
              <div className="p-6">
                {/* Title and rating */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-1">{item.nameEn}</h1>
                    <p className="text-muted-foreground capitalize">
                      {item.region.replace('_', ' ')} Cuisine
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-green-500/10 text-green-600 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold">4.5</span>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  <div className="text-center p-3 rounded-xl bg-card border border-border">
                    <IndianRupee className="w-5 h-5 mx-auto text-primary mb-1" />
                    <p className="text-sm font-semibold">{formatPrice(item.price)}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-card border border-border">
                    <Clock className="w-5 h-5 mx-auto text-blue-500 mb-1" />
                    <p className="text-sm font-semibold">{item.cookTime} mins</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-card border border-border">
                    <Flame className="w-5 h-5 mx-auto text-orange-500 mb-1" />
                    <p className="text-sm font-semibold">{item.calories} cal</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-card border border-border">
                    <span className="text-lg">{getSpiceDisplay(item.spiceLevel)}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="font-semibold mb-2">Description</h2>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>

                {/* Ingredients */}
                <div className="mb-6">
                  <h2 className="font-semibold mb-2">Ingredients</h2>
                  <div className="flex flex-wrap gap-2">
                    {item.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full bg-muted text-sm"
                      >
                        {ing.en}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Nutrition */}
                {item.nutrition && (
                  <div className="mb-6">
                    <button
                      onClick={() => setShowNutrition(!showNutrition)}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border"
                    >
                      <span className="font-semibold">Nutrition Facts</span>
                      <motion.div
                        animate={{ rotate: showNutrition ? 180 : 0 }}
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {showNutrition && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-4 gap-3 mt-3">
                            <div className="text-center p-3 rounded-xl bg-blue-500/10">
                              <p className="text-2xl font-bold text-blue-500">{item.nutrition.protein}g</p>
                              <p className="text-xs text-muted-foreground">Protein</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-amber-500/10">
                              <p className="text-2xl font-bold text-amber-500">{item.nutrition.carbs}g</p>
                              <p className="text-xs text-muted-foreground">Carbs</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-red-500/10">
                              <p className="text-2xl font-bold text-red-500">{item.nutrition.fats}g</p>
                              <p className="text-xs text-muted-foreground">Fats</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-green-500/10">
                              <p className="text-2xl font-bold text-green-500">{item.nutrition.fiber}g</p>
                              <p className="text-xs text-muted-foreground">Fiber</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Serving suggestions */}
                {item.servingSuggestions && item.servingSuggestions.length > 0 && (
                  <div className="mb-6">
                    <h2 className="font-semibold mb-2">Best served with</h2>
                    <div className="flex flex-wrap gap-2">
                      {item.servingSuggestions.map((sug, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm"
                        >
                          {sug}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Where to get */}
                {availableRestaurants.length > 0 && (
                  <div className="mb-6">
                    <h2 className="font-semibold mb-3">Where to get it</h2>
                    <div className="space-y-3">
                      {availableRestaurants.map((restaurant) => (
                        <div
                          key={restaurant.id}
                          className="p-4 rounded-xl bg-card border border-border flex items-center gap-4"
                        >
                          <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{restaurant.name}</h3>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {restaurant.distance} km
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                {restaurant.rating}
                              </span>
                              <span>{restaurant.deliveryTime}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed bottom actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
              <div className="flex gap-3">
                <button
                  onClick={toggleFavorite}
                  className={cn(
                    "p-4 rounded-2xl border-2 transition-all",
                    isLiked ? "border-red-500 text-red-500" : "border-border"
                  )}
                >
                  <Heart className={cn("w-6 h-6", isLiked && "fill-current")} />
                </button>
                <button className="flex-1 py-4 rounded-2xl gradient-bg text-white font-semibold flex items-center justify-center gap-2 shadow-glow">
                  <ShoppingBag className="w-5 h-5" />
                  Order Now
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
