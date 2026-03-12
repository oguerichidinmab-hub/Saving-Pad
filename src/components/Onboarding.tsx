import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Bell, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/errorHandlers';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    cycleLength: 28,
    periodLength: 5,
    lastPeriodStart: '',
    notificationsEnabled: true,
    padReminders: true,
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      const userPath = `users/${user.uid}`;
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData: any = {
          uid: user.uid,
          email: user.email,
          cycleLength: formData.cycleLength,
          periodLength: formData.periodLength,
          lastPeriodStart: formData.lastPeriodStart,
          preferences: {
            notificationsEnabled: formData.notificationsEnabled,
            padReminders: formData.padReminders,
          },
        };

        if (!userDoc.exists()) {
          userData.createdAt = serverTimestamp();
        }

        await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
      } catch (err: any) {
        if (err.code === 'permission-denied') {
          handleFirestoreError(err, OperationType.WRITE, userPath);
        }
        throw err;
      }
      
      onComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userPath = `users/${user.uid}`;
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData: any = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          cycleLength: formData.cycleLength,
          periodLength: formData.periodLength,
          lastPeriodStart: formData.lastPeriodStart,
          preferences: {
            notificationsEnabled: formData.notificationsEnabled,
            padReminders: formData.padReminders,
          },
        };

        if (!userDoc.exists()) {
          userData.createdAt = serverTimestamp();
        }

        await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
      } catch (err: any) {
        if (err.code === 'permission-denied') {
          handleFirestoreError(err, OperationType.WRITE, userPath);
        }
        throw err;
      }

      onComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    // Step 0: Welcome
    <div className="flex flex-col items-center text-center space-y-6">
      <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
        <Heart size={48} fill="currentColor" />
      </div>
      <h1 className="text-3xl font-bold text-brand-900">Welcome to Saving Pad</h1>
      <p className="text-brand-700 max-w-xs">
        Your friendly companion for menstrual health, cycle tracking, and finding resources nearby.
      </p>
      <button 
        onClick={nextStep}
        className="w-full py-4 bg-brand-600 text-white rounded-2xl font-semibold shadow-lg shadow-brand-200 hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
      >
        Let's Get Started <ChevronRight size={20} />
      </button>
    </div>,

    // Step 1: Tutorial - Tracking
    <div className="flex flex-col items-center text-center space-y-6">
      <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
        <Calendar size={48} />
      </div>
      <h2 className="text-2xl font-bold text-brand-900">Track Your Cycle</h2>
      <p className="text-brand-700 max-w-xs">
        Log your periods and symptoms to get accurate predictions and understand your body better.
      </p>
      <div className="flex gap-4 w-full">
        <button onClick={prevStep} className="flex-1 py-4 bg-white border border-brand-200 text-brand-600 rounded-2xl font-semibold">Back</button>
        <button onClick={nextStep} className="flex-1 py-4 bg-brand-600 text-white rounded-2xl font-semibold">Next</button>
      </div>
    </div>,

    // Step 2: Tutorial - Find Pads
    <div className="flex flex-col items-center text-center space-y-6">
      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
        <MapPin size={48} />
      </div>
      <h2 className="text-2xl font-bold text-brand-900">Find Pads Nearby</h2>
      <p className="text-brand-700 max-w-xs">
        Locate free or affordable sanitary pads at schools, NGOs, and community centers near you.
      </p>
      <div className="flex gap-4 w-full">
        <button onClick={prevStep} className="flex-1 py-4 bg-white border border-brand-200 text-brand-600 rounded-2xl font-semibold">Back</button>
        <button onClick={nextStep} className="flex-1 py-4 bg-brand-600 text-white rounded-2xl font-semibold">Next</button>
      </div>
    </div>,

    // Step 3: Cycle Preferences
    <div className="flex flex-col space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-brand-900">Tell us about your cycle</h2>
        <p className="text-brand-600 text-sm">This helps us give you better predictions.</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">Average Cycle Length (days)</label>
          <input 
            type="number" 
            value={formData.cycleLength}
            onChange={(e) => setFormData({...formData, cycleLength: parseInt(e.target.value)})}
            className="w-full p-4 bg-white border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">Average Period Duration (days)</label>
          <input 
            type="number" 
            value={formData.periodLength}
            onChange={(e) => setFormData({...formData, periodLength: parseInt(e.target.value)})}
            className="w-full p-4 bg-white border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">When did your last period start?</label>
          <input 
            type="date" 
            value={formData.lastPeriodStart}
            onChange={(e) => setFormData({...formData, lastPeriodStart: e.target.value})}
            className="w-full p-4 bg-white border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
      </div>

      <div className="flex gap-4 w-full pt-4">
        <button onClick={prevStep} className="flex-1 py-4 bg-white border border-brand-200 text-brand-600 rounded-2xl font-semibold">Back</button>
        <button onClick={nextStep} className="flex-1 py-4 bg-brand-600 text-white rounded-2xl font-semibold">Next</button>
      </div>
    </div>,

    // Step 4: Notification Preferences
    <div className="flex flex-col space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-brand-900">Stay Updated</h2>
        <p className="text-brand-600 text-sm">Choose how you'd like to be reminded.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white border border-brand-200 rounded-xl">
          <div className="flex items-center gap-3">
            <Bell className="text-brand-500" />
            <div>
              <p className="font-semibold text-brand-900">Period Reminders</p>
              <p className="text-xs text-brand-600">Get alerts before your period starts</p>
            </div>
          </div>
          <input 
            type="checkbox" 
            checked={formData.notificationsEnabled}
            onChange={(e) => setFormData({...formData, notificationsEnabled: e.target.checked})}
            className="w-6 h-6 accent-brand-600"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-white border border-brand-200 rounded-xl">
          <div className="flex items-center gap-3">
            <Sparkles className="text-brand-500" />
            <div>
              <p className="font-semibold text-brand-900">Pad Access Alerts</p>
              <p className="text-xs text-brand-600">Notify me about free pad distributions</p>
            </div>
          </div>
          <input 
            type="checkbox" 
            checked={formData.padReminders}
            onChange={(e) => setFormData({...formData, padReminders: e.target.checked})}
            className="w-6 h-6 accent-brand-600"
          />
        </div>
      </div>

      <div className="flex gap-4 w-full pt-4">
        <button onClick={prevStep} className="flex-1 py-4 bg-white border border-brand-200 text-brand-600 rounded-2xl font-semibold">Back</button>
        <button onClick={nextStep} className="flex-1 py-4 bg-brand-600 text-white rounded-2xl font-semibold">Almost There!</button>
      </div>
    </div>,

    // Step 5: Sign Up
    <div className="flex flex-col space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-brand-900">Create Your Account</h2>
        <p className="text-brand-600 text-sm">Save your data and sync across devices.</p>
      </div>

      <div className="space-y-4">
        <input 
          type="email" 
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full p-4 bg-white border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
        />
        <input 
          type="password" 
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          className="w-full p-4 bg-white border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
        />
        
        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

        <button 
          onClick={handleSignUp}
          disabled={loading}
          className="w-full py-4 bg-brand-600 text-white rounded-2xl font-semibold disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-brand-200"></div>
          <span className="text-brand-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-brand-200"></div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-4 bg-white border border-brand-200 text-brand-900 rounded-2xl font-semibold flex items-center justify-center gap-2"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>
      </div>

      <button onClick={prevStep} className="w-full text-brand-600 text-sm font-semibold">Back</button>
    </div>
  ];

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl overflow-hidden relative">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-100">
          <motion.div 
            className="h-full bg-brand-500"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="p-8 pt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-brand-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-50" />
      </div>
    </div>
  );
};

export default Onboarding;
