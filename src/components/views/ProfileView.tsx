import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Edit, 
  Check, 
  Wallet,
  Settings,
  ChevronRight,
  Download,
  Trash2,
  UtensilsCrossed,
  Moon,
  Sun,
  Bell,
  Shield
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { formatINR, formatIndianNumber } from '@/lib/utils';

interface ProfileViewProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function ProfileView({ isDarkMode, onToggleDarkMode }: ProfileViewProps) {
  const { userProfile, updateProfile, expenses, favorites, monthlyBudget, setMonthlyBudget } = useAppContext();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);
  const [editedBudget, setEditedBudget] = useState(monthlyBudget);

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleSave = () => {
    updateProfile(editedProfile);
    setMonthlyBudget(editedBudget);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setEditedProfile(userProfile);
    setEditedBudget(monthlyBudget);
    setIsEditMode(false);
  };

  const toggleDietaryPreference = (pref: string) => {
    const current = editedProfile.dietaryPreferences || [];
    setEditedProfile({
      ...editedProfile,
      dietaryPreferences: current.includes(pref)
        ? current.filter(p => p !== pref)
        : [...current, pref]
    });
  };

  const toggleFavoriteCuisine = (cuisine: string) => {
    const current = editedProfile.favoriteCuisines || [];
    setEditedProfile({
      ...editedProfile,
      favoriteCuisines: current.includes(cuisine)
        ? current.filter(c => c !== cuisine)
        : [...current, cuisine]
    });
  };

  const spiceToleranceIndex = ['mild', 'medium', 'hot', 'extra-hot'].indexOf(editedProfile.spiceTolerance || 'medium');

  return (
    <div className="max-w-4xl mx-auto pb-24 md:pb-8">
      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-orange-500 rounded-2xl p-6 md:p-8 mb-6 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', 
              backgroundSize: '20px 20px'
            }} 
          />
        </div>

        <div className="relative flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
              {editedProfile.avatar ? (
                <img 
                  src={editedProfile.avatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <User size={64} className="text-primary" />
              )}
            </div>
            {isEditMode && (
              <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                <Camera size={20} className="text-primary" />
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 text-white text-center md:text-left">
            {isEditMode ? (
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                className="text-2xl md:text-3xl font-bold bg-white/20 backdrop-blur px-4 py-2 rounded-lg mb-2 w-full max-w-xs text-white placeholder-white/70"
                placeholder="Your Name"
              />
            ) : (
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {userProfile.name || 'Setup Your Profile'}
              </h1>
            )}
            <p className="text-white/90 mb-4">{userProfile.email || 'Add your email'}</p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg text-center">
                <span className="text-xl md:text-2xl font-bold block">{expenses.length}</span>
                <span className="text-xs md:text-sm">Total Orders</span>
              </div>
              <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg text-center">
                <span className="text-xl md:text-2xl font-bold block">{favorites.length}</span>
                <span className="text-xs md:text-sm">Favorites</span>
              </div>
              <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg text-center">
                <span className="text-xl md:text-2xl font-bold block">
                  ₹{formatIndianNumber(totalSpent)}
                </span>
                <span className="text-xs md:text-sm">Total Spent</span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="absolute top-4 right-4 flex gap-2">
            {isEditMode ? (
              <>
                <button
                  onClick={handleCancel}
                  className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg hover:bg-white/30 transition-all text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-white px-4 py-2 rounded-lg hover:bg-white/90 transition-all text-primary font-medium text-sm flex items-center gap-1"
                >
                  <Check size={16} />
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditMode(true)}
                className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg hover:bg-white/30 transition-all text-white flex items-center gap-2"
              >
                <Edit size={16} />
                <span className="hidden md:inline">Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Personal Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <User size={24} className="text-primary" />
            Personal Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail size={14} />
                Email
              </label>
              {isEditMode ? (
                <input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg mt-1 bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              ) : (
                <p className="font-medium mt-1">{userProfile.email || 'Not set'}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <Phone size={14} />
                Phone
              </label>
              {isEditMode ? (
                <input
                  type="tel"
                  value={editedProfile.phone || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg mt-1 bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="+91 98765 43210"
                />
              ) : (
                <p className="font-medium mt-1">{userProfile.phone || 'Not set'}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin size={14} />
                Location
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  value={editedProfile.location || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg mt-1 bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="City, State"
                />
              ) : (
                <p className="font-medium mt-1">{userProfile.location || 'Not set'}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Food Preferences Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <UtensilsCrossed size={24} className="text-primary" />
            Food Preferences
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Dietary Preferences</label>
              <div className="flex flex-wrap gap-2">
                {['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Halal'].map(diet => (
                  <button
                    key={diet}
                    onClick={() => isEditMode && toggleDietaryPreference(diet)}
                    disabled={!isEditMode}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      (isEditMode ? editedProfile : userProfile).dietaryPreferences?.includes(diet)
                        ? 'bg-primary text-white'
                        : 'bg-muted text-muted-foreground'
                    } ${isEditMode ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Favorite Cuisines</label>
              <div className="flex flex-wrap gap-2">
                {['Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese'].map(cuisine => (
                  <button
                    key={cuisine}
                    onClick={() => isEditMode && toggleFavoriteCuisine(cuisine)}
                    disabled={!isEditMode}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      (isEditMode ? editedProfile : userProfile).favoriteCuisines?.includes(cuisine)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    } ${isEditMode ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Spice Tolerance: {(isEditMode ? editedProfile : userProfile).spiceTolerance || 'Medium'}
              </label>
              {isEditMode ? (
                <input
                  type="range"
                  min="0"
                  max="3"
                  value={spiceToleranceIndex >= 0 ? spiceToleranceIndex : 1}
                  onChange={(e) => {
                    const levels: Array<'mild' | 'medium' | 'hot' | 'extra-hot'> = ['mild', 'medium', 'hot', 'extra-hot'];
                    setEditedProfile({ ...editedProfile, spiceTolerance: levels[parseInt(e.target.value)] });
                  }}
                  className="w-full accent-primary"
                />
              ) : (
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(level => (
                    <span
                      key={level}
                      className={`text-2xl ${
                        level <= (spiceToleranceIndex + 1)
                          ? 'opacity-100'
                          : 'opacity-20'
                      }`}
                    >
                      🌶️
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Budget Settings Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6 mb-6"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Wallet size={24} className="text-primary" />
          Budget Settings
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Monthly Budget: ₹{formatIndianNumber(isEditMode ? editedBudget : monthlyBudget)}
            </label>
            {isEditMode ? (
              <input
                type="number"
                value={editedBudget}
                onChange={(e) => setEditedBudget(Number(e.target.value))}
                className="w-full px-4 py-2 border border-border rounded-lg bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="15000"
              />
            ) : (
              <div className="space-y-2">
                <div className="overflow-hidden h-4 text-xs flex rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((totalSpent / monthlyBudget) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                      (totalSpent / monthlyBudget) * 100 > 90 
                        ? 'bg-red-500' 
                        : (totalSpent / monthlyBudget) * 100 > 70 
                          ? 'bg-yellow-500' 
                          : 'bg-gradient-to-r from-primary to-orange-500'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Spent: <span className="font-medium text-foreground">₹{formatIndianNumber(totalSpent)}</span>
                  </span>
                  <span className="text-muted-foreground">
                    Remaining: <span className="font-medium text-emerald-500">₹{formatIndianNumber(Math.max(0, monthlyBudget - totalSpent))}</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* App Settings Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6 mb-6"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Settings size={24} className="text-primary" />
          App Settings
        </h3>

        <div className="space-y-3">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              {isDarkMode ? <Moon size={20} className="text-primary" /> : <Sun size={20} className="text-primary" />}
              <span>Dark Mode</span>
            </div>
            <button
              onClick={onToggleDarkMode}
              className={`w-14 h-7 rounded-full transition-colors relative ${
                isDarkMode ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            >
              <motion.div
                animate={{ x: isDarkMode ? 28 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-5 h-5 rounded-full bg-white shadow-md absolute top-1"
              />
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-primary" />
              <span>Notifications</span>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </div>

          {/* Privacy */}
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-primary" />
              <span>Privacy & Security</span>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </div>
        </div>
      </motion.div>

      {/* Account Actions Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <User size={24} className="text-primary" />
          Account
        </h3>

        <div className="space-y-3">
          <button className="w-full px-4 py-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all text-left flex items-center justify-between">
            <span>Export My Data</span>
            <Download size={20} />
          </button>

          <button className="w-full px-4 py-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all text-left flex items-center justify-between">
            <span>Delete Account</span>
            <Trash2 size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
