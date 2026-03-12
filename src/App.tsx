import { useState, useEffect } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc, getDocFromServer, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';
import Onboarding from './components/Onboarding';
import Calendar from './components/Calendar';
import PadLocator from './components/Map';
import Education from './components/Education';
import Community from './components/Community';
import Partners from './components/Partners';
import Donate from './components/Donate';
import PartnerOnboarding from './components/PartnerOnboarding';
import ErrorBoundary from './components/ErrorBoundary';
import { handleFirestoreError, OperationType } from './utils/errorHandlers';
import { 
  Home, 
  Calendar as CalendarIcon, 
  MapPin, 
  BookOpen, 
  User as UserIcon,
  Plus,
  LogOut,
  Settings,
  ChevronRight,
  Users,
  Building2
} from 'lucide-react';
import { format, addDays, parseISO, differenceInDays } from 'date-fns';

type View = 'home' | 'calendar' | 'map' | 'education' | 'community' | 'partners' | 'donate' | 'partner-onboarding' | 'profile';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userPath = `users/${currentUser.uid}`;
        
        // Use onSnapshot for real-time profile updates
        const unsubscribeProfile = onSnapshot(doc(db, userPath), (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
            setShowOnboarding(false);
          } else {
            setShowOnboarding(true);
          }
          setLoading(false);
        }, (error: any) => {
          if (error.code === 'permission-denied') {
            handleFirestoreError(error, OperationType.GET, userPath);
          }
          console.error("Error fetching user doc:", error);
          setShowOnboarding(true);
          setLoading(false);
        });

        return () => unsubscribeProfile();
      } else {
        setUser(null);
        setUserProfile(null);
        setShowOnboarding(true);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const calculateNextPeriod = () => {
    if (!userProfile?.lastPeriodStart || userProfile.lastPeriodStart === "" || !userProfile?.cycleLength) return null;
    try {
      const lastStart = parseISO(userProfile.lastPeriodStart);
      if (isNaN(lastStart.getTime())) return null;
      const nextStart = addDays(lastStart, userProfile.cycleLength);
      const daysUntil = differenceInDays(nextStart, new Date());
      return {
        date: nextStart,
        daysUntil: daysUntil > 0 ? daysUntil : (userProfile.cycleLength + (daysUntil % userProfile.cycleLength)) % userProfile.cycleLength
      };
    } catch (e) {
      return null;
    }
  };

  const nextPeriod = calculateNextPeriod();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-brand-200 rounded-full"></div>
          <div className="h-4 w-24 bg-brand-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <ErrorBoundary>
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      </ErrorBoundary>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* Cycle Card */}
            <div className="bg-brand-600 rounded-[2rem] p-8 text-white shadow-xl shadow-brand-200 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-brand-100 text-sm font-medium uppercase tracking-wider">Next Period In</p>
                <h2 className="text-5xl font-bold mt-2">
                  {nextPeriod ? `${nextPeriod.daysUntil} Days` : 'Not Set'}
                </h2>
                <p className="mt-4 text-brand-100 opacity-80">
                  {nextPeriod ? `Predicted: ${format(nextPeriod.date, 'MMM d')} - ${format(addDays(nextPeriod.date, (userProfile?.periodLength || 5) - 1), 'MMM d')}` : 'Log your last period to see predictions'}
                </p>
                <button 
                  onClick={() => setCurrentView('calendar')}
                  className="mt-6 px-6 py-3 bg-white text-brand-600 rounded-xl font-bold text-sm"
                >
                  Log Period
                </button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => setCurrentView('calendar')}
                className="bg-white p-4 rounded-3xl shadow-sm border border-brand-100 flex flex-col items-center text-center gap-2 cursor-pointer hover:border-brand-300 transition-all"
              >
                <div className="w-10 h-10 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center">
                  <Plus size={20} />
                </div>
                <p className="font-bold text-brand-900 text-[10px]">Log Cycle</p>
              </div>
              <div 
                onClick={() => setCurrentView('map')}
                className="bg-white p-4 rounded-3xl shadow-sm border border-brand-100 flex flex-col items-center text-center gap-2 cursor-pointer hover:border-brand-300 transition-all"
              >
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <p className="font-bold text-brand-900 text-[10px]">Find Pads</p>
              </div>
            </div>

            {/* Daily Tip */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand-100">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="text-brand-500" size={20} />
                <h3 className="font-bold text-brand-900">Daily Tip</h3>
              </div>
              <p className="text-brand-700 text-sm leading-relaxed">
                Drinking plenty of water and staying hydrated can help reduce bloating and cramps during your period.
              </p>
            </div>

            {/* Partner Spotlight */}
            <div 
              onClick={() => setCurrentView('partners')}
              className="bg-brand-50 p-6 rounded-3xl border border-brand-200 flex items-center justify-between cursor-pointer hover:bg-brand-100 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-sm">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-brand-900 text-sm">Our Partners</h3>
                  <p className="text-xs text-brand-600">See who's supporting our mission</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-brand-400" />
            </div>

            {/* Community Spotlight */}
            <div 
              onClick={() => setCurrentView('community')}
              className="bg-purple-50 p-6 rounded-3xl border border-purple-100 flex items-center justify-between cursor-pointer hover:bg-purple-100 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-brand-900 text-sm">Sisterhood Circle</h3>
                  <p className="text-xs text-brand-600">Join the conversation & support others</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-purple-400" />
            </div>
          </div>
        );
      case 'calendar':
        return <Calendar userProfile={userProfile} />;
      case 'map':
        return <PadLocator />;
      case 'education':
        return <Education />;
      case 'community':
        return <Community onDonate={() => setCurrentView('donate')} />;
      case 'partners':
        return <Partners 
          onDonate={() => setCurrentView('donate')} 
          onPartnerOnboarding={() => setCurrentView('partner-onboarding')}
        />;
      case 'partner-onboarding':
        return <PartnerOnboarding 
          onComplete={() => setCurrentView('partners')} 
          onBack={() => setCurrentView('partners')}
        />;
      case 'donate':
        return <Donate onBack={() => setCurrentView('home')} />;
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-brand-100 text-center">
              <div className="w-24 h-24 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon size={48} />
              </div>
              <h2 className="text-2xl font-bold text-brand-900">{user?.displayName || 'User'}</h2>
              <p className="text-brand-500 text-sm">{user?.email}</p>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-brand-100 overflow-hidden">
              <div className="p-4 border-b border-brand-50">
                <h3 className="font-bold text-brand-900 px-2">Settings</h3>
              </div>
              <div className="divide-y divide-brand-50">
                <button className="w-full p-6 flex items-center justify-between hover:bg-brand-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-50 text-brand-500 rounded-xl flex items-center justify-center">
                      <Settings size={20} />
                    </div>
                    <span className="font-semibold text-brand-900">Cycle Settings</span>
                  </div>
                  <ChevronRight size={20} className="text-brand-300" />
                </button>
                <button 
                  onClick={() => setCurrentView('partners')}
                  className="w-full p-6 flex items-center justify-between hover:bg-brand-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-50 text-brand-500 rounded-xl flex items-center justify-center">
                      <Building2 size={20} />
                    </div>
                    <span className="font-semibold text-brand-900">Our Partners</span>
                  </div>
                  <ChevronRight size={20} className="text-brand-300" />
                </button>
                <button 
                  onClick={() => signOut(auth)}
                  className="w-full p-6 flex items-center justify-between hover:bg-red-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
                      <LogOut size={20} />
                    </div>
                    <span className="font-semibold text-red-600">Sign Out</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-brand-50 pb-24">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-brand-900">
              {currentView === 'home' ? 'Hello!' : currentView.charAt(0).toUpperCase() + currentView.slice(1)}
            </h1>
            <p className="text-brand-600 text-sm">
              {currentView === 'home' ? 'Welcome back to Saving Pad' : `Manage your ${currentView}`}
            </p>
          </div>
          {currentView !== 'profile' && (
            <button 
              onClick={() => setCurrentView('profile')}
              className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-brand-600 hover:bg-brand-50 transition-colors"
            >
              <UserIcon size={24} />
            </button>
          )}
        </header>

        {/* Main Content */}
        <main className="px-6">
          {renderView()}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-brand-100 px-4 py-4 flex justify-between items-center z-50">
          <button 
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'home' ? 'text-brand-600' : 'text-brand-400'}`}
          >
            <Home size={20} />
            <span className="text-[8px] font-bold uppercase tracking-tighter">Home</span>
          </button>
          <button 
            onClick={() => setCurrentView('calendar')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'calendar' ? 'text-brand-600' : 'text-brand-400'}`}
          >
            <CalendarIcon size={20} />
            <span className="text-[8px] font-bold uppercase tracking-tighter">Cycle</span>
          </button>
          <button 
            onClick={() => setCurrentView('map')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'map' ? 'text-brand-600' : 'text-brand-400'}`}
          >
            <MapPin size={20} />
            <span className="text-[8px] font-bold uppercase tracking-tighter">Pads</span>
          </button>
          <button 
            onClick={() => setCurrentView('education')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'education' ? 'text-brand-600' : 'text-brand-400'}`}
          >
            <BookOpen size={20} />
            <span className="text-[8px] font-bold uppercase tracking-tighter">Learn</span>
          </button>
          <button 
            onClick={() => setCurrentView('profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'profile' ? 'text-brand-600' : 'text-brand-400'}`}
          >
            <UserIcon size={20} />
            <span className="text-[8px] font-bold uppercase tracking-tighter">Me</span>
          </button>
        </nav>
      </div>
    </ErrorBoundary>
  );
}

