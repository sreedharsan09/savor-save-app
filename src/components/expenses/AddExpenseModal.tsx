import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, CreditCard, Check, IndianRupee } from 'lucide-react';
import { expenseCategories, paymentMethods, cuisineCategories } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { formatIndianNumber } from '@/lib/utils';
import { toast } from 'sonner';

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
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [notes, setNotes] = useState('');
  const [isSplitBill, setIsSplitBill] = useState(false);
  const [splitPeople, setSplitPeople] = useState(2);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !restaurant) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const expenseDate = new Date(`${date}T${time}`);
    
    const expense = {
      amount: parseFloat(amount),
      category,
      cuisine: cuisine || 'Other',
      restaurant,
      date: expenseDate,
      paymentMethod,
      notes,
      splitBill: isSplitBill ? {
        total: parseFloat(amount),
        people: splitPeople,
        yourShare: parseFloat(amount) / splitPeople,
      } : undefined,
    };

    onAdd(expense);
    setIsSuccess(true);
    toast.success('✅ Expense added successfully!');
    
    setTimeout(() => {
      setIsSuccess(false);
      setIsSubmitting(false);
      resetForm();
      onClose();
    }, 800);
  };

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setCuisine('');
    setRestaurant('');
    setPaymentMethod('UPI');
    setNotes('');
    setIsSplitBill(false);
    setSplitPeople(2);
    setDate(new Date().toISOString().split('T')[0]);
    setTime(new Date().toTimeString().slice(0, 5));
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Dark overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 md:w-full md:max-w-xl"
          >
            <div className="bg-card rounded-2xl shadow-2xl h-full md:h-auto max-h-[90vh] overflow-hidden flex flex-col border border-border">
              {/* Header */}
              <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between flex-shrink-0">
                <h2 className="text-2xl font-bold">Add Expense</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Scrollable Content */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Amount Input - LARGE and PROMINENT */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Amount *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-muted-foreground">₹</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        required
                        autoFocus
                        className="w-full pl-14 pr-4 py-4 text-3xl font-bold rounded-xl bg-muted/50 border-2 border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Category Selection - Icon Grid */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-muted-foreground">Category *</label>
                    <div className="grid grid-cols-4 gap-2">
                      {expenseCategories.map((cat) => (
                        <motion.button
                          key={cat.id}
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setCategory(cat.label)}
                          className={cn(
                            'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all',
                            category === cat.label
                              ? 'border-primary bg-primary/10 shadow-md'
                              : 'border-border bg-muted/30 hover:border-primary/50'
                          )}
                        >
                          <span className="text-2xl">{cat.icon}</span>
                          <span className="text-xs font-medium text-center leading-tight">{cat.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Restaurant/Vendor Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Restaurant/Vendor *</label>
                    <input
                      type="text"
                      value={restaurant}
                      onChange={(e) => setRestaurant(e.target.value)}
                      placeholder="Where did you eat?"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border-2 border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  {/* Cuisine Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Cuisine</label>
                    <select
                      value={cuisine}
                      onChange={(e) => setCuisine(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border-2 border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option value="">Select cuisine</option>
                      {cuisineCategories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Date *</label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border-2 border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Time *</label>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border-2 border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                    <div className="grid grid-cols-4 gap-2">
                      {paymentMethods.map((method) => (
                        <motion.button
                          key={method}
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setPaymentMethod(method)}
                          className={cn(
                            'py-3 rounded-xl border-2 text-sm font-medium transition-all',
                            paymentMethod === method
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          )}
                        >
                          {method}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Split Bill Toggle */}
                  <div className="p-4 rounded-xl bg-muted/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Split Bill?</p>
                          <p className="text-sm text-muted-foreground">Divide between friends</p>
                        </div>
                      </div>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsSplitBill(!isSplitBill)}
                        className={cn(
                          'w-14 h-7 rounded-full transition-colors relative',
                          isSplitBill ? 'bg-primary' : 'bg-muted-foreground/30'
                        )}
                      >
                        <motion.div
                          animate={{ x: isSplitBill ? 28 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="w-5 h-5 rounded-full bg-white shadow-md absolute top-1"
                        />
                      </motion.button>
                    </div>

                    <AnimatePresence>
                      {isSplitBill && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 overflow-hidden"
                        >
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-sm text-muted-foreground">Number of people</span>
                            <div className="flex items-center gap-3">
                              <motion.button
                                type="button"
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSplitPeople(Math.max(2, splitPeople - 1))}
                                className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted"
                              >
                                -
                              </motion.button>
                              <span className="font-bold text-lg w-8 text-center">{splitPeople}</span>
                              <motion.button
                                type="button"
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSplitPeople(splitPeople + 1)}
                                className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted"
                              >
                                +
                              </motion.button>
                            </div>
                          </div>
                          {amount && parseFloat(amount) > 0 && (
                            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-center">
                              <p className="text-sm">
                                Per person: <span className="font-bold text-lg">₹{formatIndianNumber(parseFloat(amount) / splitPeople)}</span>
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Notes (optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any additional details..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border-2 border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Footer - Action Buttons */}
                <div className="sticky bottom-0 bg-card border-t border-border p-6 flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-6 py-3 border-2 border-border rounded-xl font-medium hover:bg-muted transition-all"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!amount || !category || !restaurant || isSubmitting}
                    className={cn(
                      'flex-1 px-6 py-3 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2',
                      isSuccess
                        ? 'bg-emerald-500 text-white'
                        : 'gradient-bg text-white shadow-glow',
                      (!amount || !category || !restaurant) && 'opacity-50 cursor-not-allowed'
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
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        Add Expense
                        {amount && parseFloat(amount) > 0 && (
                          <span className="opacity-80">• ₹{formatIndianNumber(parseFloat(amount))}</span>
                        )}
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
