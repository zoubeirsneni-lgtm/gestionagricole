import { useFirestore } from '@/hooks/useFirestore';
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
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@/lib/utils';

export function Summary() {
  const { data: animals } = useFirestore<any>('animals');
  const { data: health } = useFirestore<any>('health_records');
  const { data: repro } = useFirestore<any>('reproduction');
  const { data: stocks } = useFirestore<any>('stocks');

  // Colors for the theme
  const COLORS = ['#2d4a3e', '#c27858', '#5a5a40', '#8b5cf6', '#3b82f6'];

  // 1. Species Distribution
  const speciesData = animals.reduce((acc: any[], animal: any) => {
    const existing = acc.find(i => i.name === animal.species);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: animal.species, value: 1 });
    }
    return acc;
  }, []);

  // 2. Health Costs by Type
  const healthData = health.reduce((acc: any[], record: any) => {
    const existing = acc.find(i => i.name === record.type);
    if (existing) {
      existing.cost += record.cost || 0;
    } else {
      acc.push({ name: record.type, cost: record.cost || 0 });
    }
    return acc;
  }, []);

  // 3. Reproduction Status
  const reproData = repro.reduce((acc: any[], event: any) => {
    const existing = acc.find(i => i.name === event.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: event.status, value: 1 });
    }
    return acc;
  }, []);

  // 4. Stock Levels
  const stockData = stocks.map((item: any) => ({
    name: item.name,
    quantité: item.quantity,
    seuil: item.minThreshold
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-2xl border border-[#e2e2d9] shadow-xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[#5a5a40] mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-serif text-[#2d4a3e]">
              {entry.name}: <span className="font-bold">{entry.value}</span> {entry.unit || ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Distribution des Espèces */}
        <div className="bg-white p-8 rounded-[32px] border border-[#e2e2d9]">
          <h3 className="text-xl font-serif text-[#2d4a3e] mb-8">Répartition du Cheptel</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={speciesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {speciesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-4">
            {speciesData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs font-medium text-[#5a5a40]">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Coûts de Santé */}
        <div className="bg-white p-8 rounded-[32px] border border-[#e2e2d9]">
          <h3 className="text-xl font-serif text-[#2d4a3e] mb-8">Dépenses de Santé par Type</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e2d9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#5a5a40', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#5a5a40', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cost" fill="#c27858" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* État de la Reproduction */}
        <div className="bg-white p-8 rounded-[32px] border border-[#e2e2d9]">
          <h3 className="text-xl font-serif text-[#2d4a3e] mb-8">Statut de Reproduction</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reproData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {reproData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#2d4a3e' : '#e2e2d9'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Niveaux de Stock */}
        <div className="bg-white p-8 rounded-[32px] border border-[#e2e2d9]">
          <h3 className="text-xl font-serif text-[#2d4a3e] mb-8">Niveaux de Stock vs Seuils</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e2d9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#5a5a40', fontSize: 12 }} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#5a5a40', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="quantité" fill="#2d4a3e" radius={[0, 10, 10, 0]} barSize={20} />
                <Bar dataKey="seuil" fill="#c27858" radius={[0, 10, 10, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#2d4a3e]" />
              <span className="text-xs font-medium text-[#5a5a40]">Quantité Actuelle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#c27858]" />
              <span className="text-xs font-medium text-[#5a5a40]">Seuil d'Alerte</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
