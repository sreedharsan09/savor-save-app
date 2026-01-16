import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { REGIONAL_CUISINES, IndianMenuItem, MealType } from '@/types/indian-food';
import { useIndianFood } from '@/context/IndianFoodContext';
import { cn } from '@/lib/utils';

interface CategoryBrowserProps {
  onSelectItem: (item: IndianMenuItem) => void;
}

type CategoryType = 'regional' | 'meal' | 'diet' | 'time' | 'price' | 'spice';

const categories: { id: CategoryType; label: string; labelHi: string; icon: string }[] = [
  { id: 'regional', label: 'By Regional Cuisine', labelHi: 'क्षेत्रीय व्यंजन', icon: '🍛' },
  { id: 'meal', label: 'By Meal Type', labelHi: 'भोजन का प्रकार', icon: '🕐' },
  { id: 'diet', label: 'By Diet Type', labelHi: 'आहार प्रकार', icon: '🥗' },
  { id: 'time', label: 'By Cooking Time', labelHi: 'पकाने का समय', icon: '⚡' },
  { id: 'price', label: 'By Price Range', labelHi: 'मूल्य सीमा', icon: '💰' },
  { id: 'spice', label: 'By Spice Level', labelHi: 'मसाला स्तर', icon: '🌶️' },
];

const mealTypes: { id: MealType; label: string; labelHi: string; icon: string }[] = [
  { id: 'breakfast', label: 'Breakfast', labelHi: 'नाश्ता', icon: '🌅' },
  { id: 'lunch', label: 'Lunch', labelHi: 'दोपहर का खाना', icon: '🍛' },
  { id: 'snacks', label: 'Snacks', labelHi: 'नमकीन', icon: '🍿' },
  { id: 'dinner', label: 'Dinner', labelHi: 'रात का खाना', icon: '🌙' },
  { id: 'desserts', label: 'Desserts', labelHi: 'मिठाई', icon: '🍮' },
];

const dietTypes = [
  { id: 'veg', label: 'Pure Vegetarian', labelHi: 'शुद्ध शाकाहारी', icon: '🟢' },
  { id: 'jain', label: 'Jain Food', labelHi: 'जैन भोजन', icon: '🙏' },
  { id: 'nonveg', label: 'Non-Vegetarian', labelHi: 'मांसाहारी', icon: '🔴' },
  { id: 'highprotein', label: 'High Protein', labelHi: 'प्रोटीन युक्त', icon: '💪' },
  { id: 'lowcal', label: 'Low Calorie', labelHi: 'कम कैलोरी', icon: '🥬' },
];

const cookingTimes = [
  { id: 'quick', label: 'Quick (15 min)', labelHi: 'जल्दी (15 मिनट)', max: 15 },
  { id: 'medium', label: 'Medium (30 min)', labelHi: 'मध्यम (30 मिनट)', max: 30 },
  { id: 'elaborate', label: 'Elaborate (1 hour+)', labelHi: 'विस्तृत (1 घंटा+)', max: 999 },
];

const priceRanges = [
  { id: 'budget', label: 'Budget (₹50-150)', labelHi: 'बजट (₹50-150)', min: 50, max: 150 },
  { id: 'mid', label: 'Mid-range (₹150-300)', labelHi: 'मध्य-श्रेणी (₹150-300)', min: 150, max: 300 },
  { id: 'premium', label: 'Premium (₹300+)', labelHi: 'प्रीमियम (₹300+)', min: 300, max: 9999 },
];

const spiceLevels = [
  { id: 'mild', label: 'Mild', labelHi: 'हल्का', icon: '🌶️' },
  { id: 'medium', label: 'Medium', labelHi: 'मध्यम', icon: '🌶️🌶️' },
  { id: 'spicy', label: 'Spicy', labelHi: 'तीखा', icon: '🌶️🌶️🌶️' },
  { id: 'extra-spicy', label: 'Extra Hot', labelHi: 'एक्स्ट्रा तीखा', icon: '🌶️🌶️🌶️🌶️' },
];

export function CategoryBrowser({ onSelectItem }: CategoryBrowserProps) {
  const { menuItems, language } = useIndianFood();
  const [expandedCategory, setExpandedCategory] = useState<CategoryType | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  // Get filtered items based on selection
  const filteredItems = useMemo(() => {
    if (!selectedSubcategory) return [];

    return menuItems.filter(item => {
      if (expandedCategory === 'regional') {
        return item.region === selectedSubcategory;
      }
      if (expandedCategory === 'meal') {
        return item.mealType.includes(selectedSubcategory as MealType);
      }
      if (expandedCategory === 'diet') {
        if (selectedSubcategory === 'veg') return item.isVeg;
        if (selectedSubcategory === 'jain') return item.isJainFriendly;
        if (selectedSubcategory === 'nonveg') return !item.isVeg;
        if (selectedSubcategory === 'highprotein') return item.nutrition && item.nutrition.protein > 15;
        if (selectedSubcategory === 'lowcal') return item.calories < 300;
      }
      if (expandedCategory === 'time') {
        const time = cookingTimes.find(t => t.id === selectedSubcategory);
        if (time) return item.cookTime <= time.max;
      }
      if (expandedCategory === 'price') {
        const range = priceRanges.find(r => r.id === selectedSubcategory);
        if (range) return item.price.max >= range.min && item.price.max <= range.max;
      }
      if (expandedCategory === 'spice') {
        return item.spiceLevel === selectedSubcategory;
      }
      return false;
    });
  }, [menuItems, expandedCategory, selectedSubcategory]);

  const toggleCategory = (categoryId: CategoryType) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
      setSelectedSubcategory(null);
    } else {
      setExpandedCategory(categoryId);
      setSelectedSubcategory(null);
    }
  };

  const getSubcategories = () => {
    switch (expandedCategory) {
      case 'regional':
        return REGIONAL_CUISINES.map(c => ({ id: c.id, label: c.nameEn, labelHi: c.nameHi, icon: c.icon }));
      case 'meal':
        return mealTypes;
      case 'diet':
        return dietTypes;
      case 'time':
        return cookingTimes.map(t => ({ id: t.id, label: t.label, labelHi: t.labelHi, icon: '⏱️' }));
      case 'price':
        return priceRanges.map(r => ({ id: r.id, label: r.label, labelHi: r.labelHi, icon: '💰' }));
      case 'spice':
        return spiceLevels;
      default:
        return [];
    }
  };

  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <div key={category.id} className="rounded-2xl border border-border bg-card overflow-hidden">
          {/* Category header */}
          <button
            onClick={() => toggleCategory(category.id)}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{category.icon}</span>
              <div className="text-left">
                <p className="font-semibold">{category.label}</p>
                <p className="text-sm text-muted-foreground">{category.labelHi}</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: expandedCategory === category.id ? 180 : 0 }}
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </button>

          {/* Subcategories */}
          <AnimatePresence>
            {expandedCategory === category.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-border"
              >
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {getSubcategories().map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setSelectedSubcategory(sub.id)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                          selectedSubcategory === sub.id
                            ? "gradient-bg text-white shadow-lg"
                            : "bg-muted hover:bg-primary/10"
                        )}
                      >
                        {'icon' in sub && <span>{sub.icon}</span>}
                        <span>{language === 'hindi' ? sub.labelHi : sub.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Filtered items */}
                  {selectedSubcategory && filteredItems.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 space-y-2"
                    >
                      <p className="text-sm text-muted-foreground mb-2">
                        {filteredItems.length} items found
                      </p>
                      {filteredItems.slice(0, 5).map((item) => (
                        <button
                          key={item.id}
                          onClick={() => onSelectItem(item)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all text-left"
                        >
                          <img
                            src={item.image}
                            alt={item.nameEn}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium">
                              {language === 'hindi' ? item.nameHi : item.nameEn}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ₹{item.price.min} - {item.price.max}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                      ))}
                      {filteredItems.length > 5 && (
                        <p className="text-center text-sm text-primary font-medium pt-2">
                          + {filteredItems.length - 5} more items
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
