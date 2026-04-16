import React, { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Baby, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function ReproductionTracker() {
  const { data: records, add, update } = useFirestore<any>('reproduction');
  const { data: animals } = useFirestore<any>('animals');
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  const females = animals.filter(a => a.gender === 'Femelle');
  const males = animals.filter(a => a.gender === 'Mâle');

  const [newRepro, setNewRepro] = useState({
    motherId: '',
    fatherId: '',
    matingDate: new Date().toISOString().split('T')[0],
    expectedBirthDate: '',
    status: 'En attente'
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await add(newRepro);
      setIsAddOpen(false);
      toast.success('Saillie enregistrée');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Réussi': return <CheckCircle2 className="text-emerald-500" size={16} />;
      case 'Échec': return <XCircle className="text-red-500" size={16} />;
      default: return <Clock className="text-amber-500" size={16} />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif text-[#2d4a3e]">Reproduction</h2>
          <p className="text-sm text-[#5a5a40] italic">Suivi des cycles et naissances</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button className="bg-[#5a5a40] hover:bg-[#4a4a35] text-white rounded-full px-6 h-11 shadow-md" />}>
            <Plus size={18} className="mr-2" />
            Nouvelle saillie
          </DialogTrigger>
          <DialogContent className="rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-[#2d4a3e]">Enregistrer une saillie</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-[#5a5a40]">Mère</Label>
                  <Select onValueChange={v => setNewRepro({...newRepro, motherId: v})}>
                    <SelectTrigger className="rounded-xl border-[#e2e2d9]">
                      <SelectValue placeholder="Mère" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {females.map(a => (
                        <SelectItem key={a.id} value={a.id}>#{a.tagId}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-[#5a5a40]">Père</Label>
                  <Select onValueChange={v => setNewRepro({...newRepro, fatherId: v})}>
                    <SelectTrigger className="rounded-xl border-[#e2e2d9]">
                      <SelectValue placeholder="Père" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {males.map(a => (
                        <SelectItem key={a.id} value={a.id}>#{a.tagId}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-[#5a5a40]">Date saillie</Label>
                  <Input 
                    type="date" 
                    className="rounded-xl border-[#e2e2d9]"
                    value={newRepro.matingDate}
                    onChange={e => setNewRepro({...newRepro, matingDate: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-[#5a5a40]">Date prévue</Label>
                  <Input 
                    type="date" 
                    className="rounded-xl border-[#e2e2d9]"
                    value={newRepro.expectedBirthDate}
                    onChange={e => setNewRepro({...newRepro, expectedBirthDate: e.target.value})}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#5a5a40] hover:bg-[#4a4a35] text-white rounded-full h-12">Enregistrer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {records.map((record) => {
          const mother = animals.find(a => a.id === record.motherId);
          const father = animals.find(a => a.id === record.fatherId);
          const daysLeft = record.expectedBirthDate ? Math.ceil((new Date(record.expectedBirthDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

          return (
            <div key={record.id} className="bg-white p-8 rounded-[32px] border border-[#e2e2d9] relative overflow-hidden group transition-all hover:border-[#2d4a3e]/30">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#f5f5f0] rounded-2xl">
                    <Baby className="text-[#5a5a40]" size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-mono font-bold text-[#2d4a3e]">Mère: #{mother?.tagId || '?'}</p>
                    <p className="text-xs text-[#5a5a40] font-serif italic">Père: #{father?.tagId || '?'}</p>
                  </div>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                  record.status === 'Réussi' ? "bg-[#e2e2d9] text-[#2d4a3e]" : 
                  record.status === 'Échec' ? "bg-[#fee2e2] text-[#991b1b]" : 
                  "bg-[#c27858]/10 text-[#c27858]"
                )}>
                  {record.status}
                </span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-xs">
                  <span className="text-[#5a5a40]/60 uppercase tracking-widest font-bold">Saillie</span>
                  <span className="text-[#2d4a3e] font-mono">{record.matingDate}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#5a5a40]/60 uppercase tracking-widest font-bold">Mise-bas prévue</span>
                  <span className="text-[#2d4a3e] font-mono font-bold">{record.expectedBirthDate || '-'}</span>
                </div>
              </div>

              {record.status === 'En attente' && daysLeft !== null && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#5a5a40]">
                    <span>Progression</span>
                    <span className="text-[#c27858]">{daysLeft > 0 ? `J-${daysLeft}` : 'Imminent'}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#f5f5f0] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#c27858] transition-all duration-500"
                      style={{ width: `${Math.max(0, Math.min(100, 100 - (daysLeft / 285) * 100))}%` }}
                    />
                  </div>
                </div>
              )}

              {record.status === 'En attente' && (
                <div className="flex gap-3 pt-8 mt-4 border-t border-[#e2e2d9]/50">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 text-[10px] font-bold uppercase tracking-widest h-9 border border-[#e2e2d9] text-[#2d4a3e] hover:bg-[#e2e2d9] rounded-full"
                    onClick={() => update(record.id, { status: 'Réussi' })}
                  >
                    Succès
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 text-[10px] font-bold uppercase tracking-widest h-9 border border-[#e2e2d9] text-[#991b1b] hover:bg-[#fee2e2] rounded-full"
                    onClick={() => update(record.id, { status: 'Échec' })}
                  >
                    Échec
                  </Button>
                </div>
              )}
            </div>
          );
        })}
        {records.length === 0 && (
          <div className="col-span-full text-center py-24 bg-white rounded-[32px] border border-dashed border-[#e2e2d9]">
            <Baby className="mx-auto text-[#5a5a40]/30 mb-4" size={48} />
            <p className="text-[#5a5a40] italic">Aucun suivi de reproduction</p>
          </div>
        )}
      </div>
    </div>
  );
}
