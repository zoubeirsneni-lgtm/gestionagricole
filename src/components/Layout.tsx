import React from 'react';
import { 
  LayoutDashboard, 
  PawPrint, 
  HeartPulse, 
  Baby, 
  Package, 
  LogOut,
  Menu,
  X,
  Settings,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/app-ui/app-button.tsx';
import { logOut } from '@/lib/firebase.ts';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userEmail?: string | null;
}

export function Layout({ children, activeTab, setActiveTab, userEmail }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'summary', label: 'Résumé & Analyses', icon: TrendingUp },
    { id: 'animals', label: 'Animaux', icon: PawPrint },
    { id: 'reproduction', label: 'Reproduction', icon: Baby },
    { id: 'health', label: 'Santé', icon: HeartPulse },
    { id: 'stocks', label: 'Stocks', icon: Package },
  ];

  return (
    <div className="flex h-screen bg-[#f5f5f0] font-sans text-[#1a1a1a]">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-[#2d4a3e] h-full text-[#f5f5f0] p-6">
        <div className="mb-12 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c27858]">
            <PawPrint className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-serif">ÉlevagePro</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-2xl",
                activeTab === item.id 
                  ? "bg-[#3a5c4d] text-white shadow-sm" 
                  : "text-[#f5f5f0]/70 hover:bg-[#3a5c4d]/50 hover:text-white"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="rounded-2xl bg-[#3a5c4d]/30 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#c27858] flex items-center justify-center text-white font-bold">
                {userEmail?.[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-medium text-white">{userEmail?.split('@')[0]}</p>
                <p className="text-xs text-[#f5f5f0]/50 italic">Éleveur Certifié</p>
              </div>
            </div>
          </div>
          <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[#f5f5f0]/70 hover:bg-[#3a5c4d]/50 hover:text-white transition-colors">
            <Settings size={20} />
            Configuration
          </button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-[#f5f5f0]/70 hover:text-red-400 hover:bg-red-400/10 rounded-2xl px-4 py-3 h-auto"
            onClick={logOut}
          >
            <LogOut size={20} className="mr-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#2d4a3e] border-b border-[#3a5c4d] flex items-center justify-between px-4 z-50 text-white">
        <h1 className="text-lg font-bold text-white font-serif flex items-center gap-2">
          <PawPrint size={20} className="text-[#c27858]" />
          ÉlevagePro
        </h1>
        <Button variant="ghost" size="icon" className="text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#2d4a3e] z-40 pt-16 text-[#f5f5f0]">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-4 text-base font-medium rounded-2xl",
                  activeTab === item.id 
                    ? "bg-[#3a5c4d] text-white" 
                    : "text-[#f5f5f0]/70"
                )}
              >
                <item.icon size={24} />
                {item.label}
              </button>
            ))}
            <Button 
              variant="ghost" 
              className="w-full justify-start text-[#f5f5f0]/70 py-6 rounded-2xl"
              onClick={logOut}
            >
              <LogOut size={24} className="mr-4" />
              Déconnexion
            </Button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 flex flex-col">
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between bg-[#f5f5f0]/80 px-8 backdrop-blur-md md:h-24">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-medium text-[#2d4a3e] font-serif">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <p className="text-xs font-bold uppercase tracking-widest text-[#5a5a40]">Date du jour</p>
              <p className="text-sm font-medium text-[#2d4a3e]">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-white border border-[#e2e2d9] flex items-center justify-center text-[#2d4a3e]">
              <TrendingUp size={20} />
            </div>
          </div>
        </header>

        <div className="max-w-[1200px] w-full mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
