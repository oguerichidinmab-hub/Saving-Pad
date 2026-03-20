import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Globe, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Upload,
  Heart,
  Briefcase,
  Info
} from 'lucide-react';

interface PartnerOnboardingProps {
  onComplete: () => void;
  onBack: () => void;
}

type Step = 'intro' | 'details' | 'verification' | 'tier' | 'payment' | 'processing' | 'success';

const PartnerOnboarding: React.FC<PartnerOnboardingProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState<Step>('intro');
  const [formData, setFormData] = useState({
    orgName: '',
    orgType: '',
    website: '',
    description: '',
    tier: ''
  });
  const [isPaymentVerified, setIsPaymentVerified] = useState(false);

  const tiers = [
    { id: 'bronze', name: 'Bronze Partner', price: 100, benefits: ['Logo on website', 'Monthly newsletter'] },
    { id: 'silver', name: 'Silver Partner', price: 500, benefits: ['Logo on website', 'Social media shoutout', 'Impact report'] },
    { id: 'gold', name: 'Gold Partner', price: 1000, benefits: ['All Silver benefits', 'Featured spotlight', 'Event partnership'] },
  ];

  const handleNext = () => {
    if (step === 'intro') setStep('details');
    else if (step === 'details') setStep('verification');
    else if (step === 'verification') setStep('tier');
    else if (step === 'tier') setStep('payment');
  };

  const handlePayment = () => {
    setStep('processing');
    // Simulate payment processing
    setTimeout(() => {
      setIsPaymentVerified(true);
      setStep('success');
    }, 3000);
  };

  const renderStep = () => {
    switch (step) {
      case 'intro':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 text-center"
          >
            <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <Handshake size={40} />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-brand-900">Partner with Us</h2>
              <p className="text-brand-600 max-w-xs mx-auto leading-relaxed">
                Join our network of organizations dedicated to ending period poverty and promoting menstrual health.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 text-left">
              <div className="bg-white p-5 rounded-3xl border border-brand-100 flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Heart size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-brand-900 text-sm">Make an Impact</h4>
                  <p className="text-xs text-brand-500 mt-1">Directly support girls in rural communities with essential products.</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-brand-100 flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Globe size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-brand-900 text-sm">Global Visibility</h4>
                  <p className="text-xs text-brand-500 mt-1">Get featured on our platform and reach a wider audience.</p>
                </div>
              </div>
            </div>
            <button 
              onClick={handleNext}
              className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-200 flex items-center justify-center gap-2"
            >
              Get Started <ChevronRight size={20} />
            </button>
          </motion.div>
        );

      case 'details':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-brand-900">Organization Details</h3>
              <p className="text-sm text-brand-500">Tell us about your organization.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-400 uppercase tracking-wider ml-1">Organization Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="e.g. Health First Foundation"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-brand-100 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    value={formData.orgName}
                    onChange={(e) => setFormData({...formData, orgName: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-400 uppercase tracking-wider ml-1">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300" size={18} />
                  <input 
                    type="url" 
                    placeholder="https://example.org"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-brand-100 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-400 uppercase tracking-wider ml-1">Brief Description</label>
                <textarea 
                  placeholder="What does your organization do?"
                  rows={4}
                  className="w-full px-4 py-4 bg-white border border-brand-100 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
            <button 
              onClick={handleNext}
              disabled={!formData.orgName || !formData.website}
              className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-200 disabled:opacity-50"
            >
              Continue
            </button>
          </motion.div>
        );

      case 'verification':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 text-center"
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-brand-900">Verification</h3>
              <p className="text-sm text-brand-500">Please upload your registration documents.</p>
            </div>
            <div className="p-10 border-2 border-dashed border-brand-200 rounded-[2rem] bg-brand-50/50 flex flex-col items-center gap-4 cursor-pointer hover:bg-brand-50 transition-colors">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-brand-400 shadow-sm">
                <Upload size={32} />
              </div>
              <div>
                <p className="font-bold text-brand-900">Click to upload</p>
                <p className="text-xs text-brand-400 mt-1">PDF, PNG or JPG (max. 5MB)</p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3 text-left">
              <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed">
                Verification helps us maintain a safe and trusted community. Our team will review your documents within 24-48 hours.
              </p>
            </div>
            <button 
              onClick={handleNext}
              className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-200"
            >
              Submit for Review
            </button>
          </motion.div>
        );

      case 'tier':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-brand-900">Partnership Tier</h3>
              <p className="text-sm text-brand-500">Choose how you want to support.</p>
            </div>
            <div className="space-y-3">
              {tiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setFormData({...formData, tier: tier.id})}
                  className={`w-full p-5 rounded-3xl border-2 text-left transition-all ${
                    formData.tier === tier.id 
                      ? 'border-brand-600 bg-brand-50' 
                      : 'border-brand-100 bg-white hover:border-brand-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-brand-900">{tier.name}</span>
                    <span className="text-lg font-bold text-brand-600">${tier.price}/yr</span>
                  </div>
                  <ul className="space-y-1">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="text-[10px] text-brand-500 flex items-center gap-1.5">
                        <CheckCircle2 size={10} className="text-emerald-500" /> {benefit}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
            <button 
              onClick={handleNext}
              disabled={!formData.tier}
              className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-200 disabled:opacity-50"
            >
              Proceed to Payment
            </button>
          </motion.div>
        );

      case 'payment':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-brand-900">Payment</h3>
              <p className="text-sm text-brand-500">Secure your partnership tier.</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-brand-50">
                <span className="text-brand-500 text-sm">Selected Tier</span>
                <span className="font-bold text-brand-900">{tiers.find(t => t.id === formData.tier)?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-500 text-sm">Total Amount</span>
                <span className="text-xl font-bold text-brand-600">${tiers.find(t => t.id === formData.tier)?.price}</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300" size={18} />
                  <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-12 pr-4 py-4 bg-brand-50 border border-brand-100 rounded-2xl outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">Expiry Date</label>
                  <input type="text" placeholder="MM/YY" className="w-full px-4 py-4 bg-brand-50 border border-brand-100 rounded-2xl outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">CVV</label>
                  <input type="text" placeholder="***" className="w-full px-4 py-4 bg-brand-50 border border-brand-100 rounded-2xl outline-none" />
                </div>
              </div>
            </div>
            <button 
              onClick={handlePayment}
              className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-200"
            >
              Pay Now
            </button>
          </motion.div>
        );

      case 'processing':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-[400px] flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="w-20 h-20 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-brand-900">Verifying Payment</h3>
              <p className="text-sm text-brand-500">Please do not close this window...</p>
            </div>
          </motion.div>
        );

      case 'success':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8 text-center"
          >
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={48} />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-brand-900">Welcome, Partner!</h2>
              <p className="text-brand-600 max-w-xs mx-auto leading-relaxed">
                Your payment has been verified and your organization is now a registered partner of Saving Pad.
              </p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-brand-100 text-left space-y-4">
              <h4 className="font-bold text-brand-900 text-sm">Next Steps</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-xs text-brand-600">
                  <div className="w-5 h-5 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center shrink-0 font-bold">1</div>
                  Complete your public profile to start appearing in our directory.
                </li>
                <li className="flex items-start gap-3 text-xs text-brand-600">
                  <div className="w-5 h-5 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center shrink-0 font-bold">2</div>
                  Access your partner dashboard to track your impact.
                </li>
              </ul>
            </div>
            <button 
              onClick={onComplete}
              className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-200"
            >
              Go to Dashboard
            </button>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 p-6">
      <div className="max-w-md mx-auto">
        {step !== 'success' && step !== 'processing' && (
          <button 
            onClick={step === 'intro' ? onBack : () => {
              if (step === 'details') setStep('intro');
              else if (step === 'verification') setStep('details');
              else if (step === 'tier') setStep('verification');
              else if (step === 'payment') setStep('tier');
            }}
            className="mb-8 text-brand-500 font-bold flex items-center gap-1 hover:text-brand-600 transition-colors"
          >
            <ChevronLeft size={20} /> Back
          </button>
        )}
        
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
};

import { Handshake } from 'lucide-react';

export default PartnerOnboarding;
