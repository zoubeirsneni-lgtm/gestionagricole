import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth.ts';
import { signIn } from '@/lib/firebase.ts';
import { Layout } from '@/components/Layout.tsx';
import { Dashboard } from '@/components/Dashboard.tsx';
import { Summary } from '@/components/Summary.tsx';
import { AnimalList } from '@/components/AnimalList.tsx';
import { HealthTracker } from '@/components/HealthTracker.tsx';
import { ReproductionTracker } from '@/components/ReproductionTracker.tsx';
import { StockManagement } from '@/components/StockManagement.tsx';
import { Button } from '@/components/ui-elements/app-button.tsx';
import { Toaster } from '@/components/ui-elements/app-sonner.tsx';
import { PawPrint, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <PawPrint size={48} className="text-emerald-600" />
          </motion.div>
          <p className="text-zinc-500 font-medium animate-pulse">Chargement d'ÉlevagePro...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col md:flex-row bg-white">
        <div className="flex-1 bg-emerald-600 flex items-center justify-center p-12 text-white">
          <div className="max-w-md space-y-6">
            <PawPrint size={64} />
            <h1 className="text-5xl font-bold tracking-tight">Gérez votre élevage avec précision.</h1>
            <p className="text-emerald-100 text-lg">
              Une plateforme complète pour le suivi de vos animaux, leur santé, la reproduction et vos stocks.
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 bg-zinc-50">
          <div className="w-full max-w-sm space-y-8 bg-white p-8 rounded-2xl shadow-xl shadow-zinc-200/50">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-zinc-900">Bienvenue</h2>
              <p className="text-zinc-500 mt-2">Connectez-vous pour accéder à votre exploitation</p>
            </div>
            <Button 
              onClick={signIn} 
              className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center gap-3 text-lg"
            >
              <LogIn size={20} />
              Se connecter avec Google
            </Button>
            <p className="text-center text-xs text-zinc-400">
              En vous connectant, vous acceptez nos conditions d'utilisation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
      case 'summary': return <Summary />;
      case 'animals': return <AnimalList />;
      case 'health': return <HealthTracker />;
      case 'reproduction': return <ReproductionTracker />;
      case 'stocks': return <StockManagement />;
      default: return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} userEmail={user.email}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </Layout>
      <Toaster position="top-right" />
    </>
  );
}
