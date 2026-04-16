import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useFirestore } from '../hooks/useFirestore';
import { PawPrint, HeartPulse, Baby, Package, TrendingUp } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export function Dashboard({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { data: animals } = useFirestore<any>('animals');
  const { data: health } = useFirestore<any>('health_records');
  const { data: repro } = useFirestore<any>('reproduction');
  const { data: stocks } = useFirestore<any>('stocks');

  const stats = [
    { label: 'Effectif Total', value: animals.length, sub: '+4 ce mois', subColor: 'text-[#2d4a3e]' },
    { label: 'Alertes Sanitaires', value: health.length, sub: 'À traiter aujourd\'hui', subColor: 'text-[#5a5a40]', valColor: 'text-[#c27858]' },
    { label: 'Mises-bas prévues', value: repro.filter(r => r.status === 'En attente').length, sub: 'Sous 7 jours', subColor: 'text-[#c27858]' },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-[#e2e2d9] transition-all hover:border-[#2d4a3e]/30">
            <div className="text-xs text-[#5a5a40] uppercase tracking-[0.15em] font-bold mb-4">{stat.label}</div>
            <div className={cn("text-5xl font-serif mb-2", stat.valColor || "text-[#2d4a3e]")}>
              {stat.value.toString().padStart(2, '0')}
            </div>
            <div className={cn("text-xs font-medium italic", stat.subColor)}>{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-[#e2e2d9]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-serif text-[#2d4a3e]">Derniers animaux suivis</h3>
            <Button 
              variant="ghost" 
              className="text-sm font-medium text-[#5a5a40] hover:text-[#2d4a3e] rounded-full px-4"
              onClick={() => setActiveTab('animals')}
            >
              Voir tout
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-[#5a5a40] border-b border-[#e2e2d9]">
                  <th className="text-left py-4 px-2 font-serif italic text-sm">ID Animal</th>
                  <th className="text-left py-4 px-2 font-serif italic text-sm">Race</th>
                  <th className="text-left py-4 px-2 font-serif italic text-sm">Sexe</th>
                  <th className="text-left py-4 px-2 font-serif italic text-sm">Statut</th>
                  <th className="text-right py-4 px-2 font-serif italic text-sm">Dernière Visite</th>
                </tr>
              </thead>
              <tbody className="font-sans">
                {animals.slice(0, 5).map((animal, i) => (
                  <tr key={i} className="border-b border-[#e2e2d9]/50 hover:bg-[#f5f5f0]/50 transition-colors">
                    <td className="py-4 px-2 font-mono text-sm font-bold text-[#2d4a3e]">#{animal.tagId}</td>
                    <td className="py-4 px-2 text-sm text-[#5a5a40]">{animal.breed}</td>
                    <td className="py-4 px-2 text-sm text-[#5a5a40]">{animal.gender}</td>
                    <td className="py-4 px-2">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        animal.status === 'Actif' ? "bg-[#e2e2d9] text-[#2d4a3e]" : "bg-[#fee2e2] text-[#991b1b]"
                      )}>
                        {animal.status === 'Actif' ? 'Sain' : animal.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right text-xs text-[#5a5a40] font-mono">
                      {new Date(animal.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
                {animals.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#5a5a40] italic">Aucun animal enregistré</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="bg-white p-8 rounded-[32px] border border-[#e2e2d9]">
            <h3 className="text-xl font-serif text-[#2d4a3e] mb-6">Stocks Critiques</h3>
            <div className="space-y-6">
              {stocks.slice(0, 3).map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-sm font-bold text-[#2d4a3e]">{item.name}</div>
                      <div className="text-[10px] text-[#5a5a40] uppercase tracking-widest font-mono">
                        {item.quantity} / {item.minThreshold * 2} {item.unit}
                      </div>
                    </div>
                    <div className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                      item.quantity <= item.minThreshold ? "bg-[#fee2e2] text-[#991b1b]" : "bg-[#e2e2d9] text-[#2d4a3e]"
                    )}>
                      {item.quantity <= item.minThreshold ? 'Alerte' : 'OK'}
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-[#f5f5f0] rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-500",
                        item.quantity <= item.minThreshold ? "bg-[#c27858]" : "bg-[#2d4a3e]"
                      )}
                      style={{ width: `${Math.min(100, (item.quantity / (item.minThreshold * 2)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              {stocks.length === 0 && <p className="text-sm text-[#5a5a40] italic">Aucun stock critique</p>}
            </div>
          </div>

          <div className="bg-[#5a5a40] p-8 rounded-[32px] text-[#f5f5f0] relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 transition-transform group-hover:scale-110">
              <TrendingUp size={120} />
            </div>
            <h3 className="text-xl font-serif mb-3">Action Rapide</h3>
            <p className="text-sm mb-6 text-[#f5f5f0]/80 leading-relaxed">Enregistrer une nouvelle naissance ou un nouveau soin vétérinaire.</p>
            <div className="flex flex-col gap-3">
              <Button 
                className="w-full bg-[#c27858] hover:bg-[#a66346] text-white rounded-full font-medium h-12 shadow-lg shadow-black/10"
                onClick={() => setActiveTab('reproduction')}
              >
                Nouvelle Naissance
              </Button>
              <Button 
                className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full font-medium h-12"
                onClick={() => setActiveTab('health')}
              >
                Nouveau Soin
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
