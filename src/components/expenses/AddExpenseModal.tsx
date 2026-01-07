import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, DollarSign, Receipt, Users, CreditCard, FileText, Check } from 'lucide-react';
import { expenseCategories, paymentMethods, cuisineCategories } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (expense: any) => void;
}

export function AddExpenseModal({ isOpen, onClose, onAdd }: AddExpenseModalProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [restaurant, setRestaurant] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [notes, setNotes] = useState('');
  const [isSplitBill, setIsSplitBill] = useState(false);
  const [splitPeople, setSplitPeople] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!amount || !category) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const expense = {
      amount: parseFloat(amount),
      category,
      cuisine: cuisine || 'Other',
      restaurant: restaurant || 'Unknown',
      date: new Date(),
      paymentMethod,
      notes,
      splitBill: isSplitBill ? {
        total: parseFloat(amount) * splitPeople,
        people: splitPeople,
        yourShare: parseFloat(amount),
      } : undefined,
    };

    onAdd(expense);
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      setIsSubmitting(false);
      resetForm();
      onClose();
    }, 1000);
  };

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setCuisine('');
    setRestaurant('');
    setPaymentMethod('Credit Card');
    setNotes('');
    setIsSplitBill(false);
    setSplitPeople(2);
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-full md:max-w-lg"
          >
            <div className="bg-card rounded-t-3xl md:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-card/90 backdrop-blur-xl border-b border-border/50 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Add Expense</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Amount Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-4 text-3xl font-bold rounded-xl bg-muted/50 border border-transparent focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <div className="grid grid-cols-4 gap-2">
                    {expenseCategories.map((cat) => (
                      <motion.button
                        key={cat.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCategory(cat.label)}
                        className={cn(
                          'flex flex-col items-center gap-1 p-3 rounded-xl transition-all',
                          category === cat.label
                            ? 'bg-primary text-white shadow-glow'
                            : 'bg-muted/50 hover:bg-muted'
                        )}
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-xs font-medium">{cat.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Restaurant */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Restaurant / Vendor</label>
                  <input
                    type="text"
                    value={restaurant}
                    onChange={(e) => setRestaurant(e.target.value)}
                    placeholder="Where did you eat?"
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-transparent focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Cuisine */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-muted-foreground">Cuisine Type</label>
                  <div className="flex flex-wrap gap-2">
                    {cuisineCategories.slice(0, 6).map((c) => (
                      <motion.button
                        key={c}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCuisine(c)}
                        className={cn(
                          'px-4 py-2 rounded-full text-sm font-medium transition-all',
                          cuisine === c
                            ? 'bg-primary text-white'
                            : 'bg-muted/50 hover:bg-muted'
                        )}
                      >
                        {c}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                  <div className="flex flex-wrap gap-2">
                    {paymentMethods.map((method) => (
                      <motion.button
                        key={method}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPaymentMethod(method)}
                        className={cn(
                          'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
                          paymentMethod === method
                            ? 'bg-primary text-white'
                            : 'bg-muted/50 hover:bg-muted'
                        )}
                      >
                        <CreditCard className="w-4 h-4" />
                        {method}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Split Bill Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Split Bill</p>
                      <p className="text-sm text-muted-foreground">Divide between friends</p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsSplitBill(!isSplitBill)}
                    className={cn(
                      'w-12 h-7 rounded-full transition-colors relative',
                      isSplitBill ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <motion.div
                      animate={{ x: isSplitBill ? 22 : 2 }}
                      className="w-5 h-5 rounded-full bg-white shadow-md absolute top-1"
                    />
                  </motion.button>
                </div>

                {/* Split Details */}
                <AnimatePresence>
                  {isSplitBill && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Number of people</span>
                        <div className="flex items-center gap-3">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSplitPeople(Math.max(2, splitPeople - 1))}
                            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                          >
                            -
                          </motion.button>
                          <span className="font-bold text-lg w-8 text-center">{splitPeople}</span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSplitPeople(splitPeople + 1)}
                            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                          >
                            +
                          </motion.button>
                        </div>
                      </div>
                      {amount && (
                        <div className="p-3 rounded-xl bg-emerald/10 text-emerald text-center">
                          <p className="text-sm">Your share: <span className="font-bold">${(parseFloat(amount) / splitPeople).toFixed(2)}</span></p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-transparent focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-card/90 backdrop-blur-xl border-t border-border/50 p-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={!amount || !category || isSubmitting}
                  className={cn(
                    'w-full py-4 rounded-xl font-semibold text-lg transition-all',
                    isSuccess
                      ? 'bg-emerald text-white'
                      : 'gradient-bg text-white shadow-glow',
                    (!amount || !category) && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {isSuccess ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Saved!
                    </motion.div>
                  ) : isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto"
                    />
                  ) : (
                    `Save Expense${amount ? ` • $${parseFloat(amount).toFixed(2)}` : ''}`
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
