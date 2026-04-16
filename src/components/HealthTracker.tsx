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
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, HeartPulse, Calendar, Activity } from 'lucide-react';
import { toast } from 'sonner';

export function HealthTracker() {
  const { data: records, add } = useFirestore<any>('health_records');
  const { data: animals } = useFirestore<any>('animals');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    animalId: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Contrôle',
    description: '',
    cost: 0
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await add(newRecord);
      setIsAddOpen(false);
      toast.success('Soin enregistré');
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif text-[#2d4a3e]">Santé & Médical</h2>
          <p className="text-sm text-[#5a5a40] italic">Suivi vétérinaire et soins</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button className="bg-[#c27858] hover:bg-[#a66346] text-white rounded-full px-6 h-11 shadow-md" />}>
            <Plus size={18} className="mr-2" />
            Nouveau soin
          </DialogTrigger>
          <DialogContent className="rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-[#2d4a3e]">Enregistrer un soin</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-6 pt-4">
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-[#5a5a40]">Animal</Label>
                <Select onValueChange={v => setNewRecord({...newRecord, animalId: v})}>
                  <SelectTrigger className="rounded-xl border-[#e2e2d9]">
                    <SelectValue placeholder="Choisir un animal" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {animals.map(a => (
                      <SelectItem key={a.id} value={a.id}>#{a.tagId} - {a.species}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-[#5a5a40]">Date</Label>
                  <Input 
                    type="date" 
                    className="rounded-xl border-[#e2e2d9]"
                    value={newRecord.date}
                    onChange={e => setNewRecord({...newRecord, date: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-[#5a5a40]">Type</Label>
                  <Select onValueChange={v => setNewRecord({...newRecord, type: v})}>
                    <SelectTrigger className="rounded-xl border-[#e2e2d9]">
                      <SelectValue placeholder="Type de soin" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Vaccination">Vaccination</SelectItem>
                      <SelectItem value="Traitement">Traitement</SelectItem>
                      <SelectItem value="Contrôle">Contrôle</SelectItem>
                      <SelectItem value="Urgence">Urgence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-[#5a5a40]">Description</Label>
                <Input 
                  placeholder="Détails du soin..."
                  className="rounded-xl border-[#e2e2d9]"
                  value={newRecord.description}
                  onChange={e => setNewRecord({...newRecord, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-[#5a5a40]">Coût (€)</Label>
                <Input 
                  type="number"
                  className="rounded-xl border-[#e2e2d9]"
                  value={newRecord.cost}
                  onChange={e => setNewRecord({...newRecord, cost: Number(e.target.value)})}
                />
              </div>
              <Button type="submit" className="w-full bg-[#c27858] hover:bg-[#a66346] text-white rounded-full h-12">Enregistrer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {records.map((record) => {
          const animal = animals.find(a => a.id === record.animalId);
          return (
            <div key={record.id} className="bg-white p-8 rounded-[32px] border border-[#e2e2d9] transition-all hover:border-[#2d4a3e]/30">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#f5f5f0] rounded-2xl">
                    <HeartPulse className="text-[#c27858]" size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-mono font-bold text-[#2d4a3e]">#{animal?.tagId || '?'}</p>
                    <p className="text-xs text-[#5a5a40] font-serif italic">{record.type}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#f5f5f0] border border-[#e2e2d9] text-[10px] font-bold text-[#5a5a40] uppercase tracking-widest">
                  {record.date}
                </span>
              </div>
              <p className="text-sm text-[#5a5a40] mb-6 line-clamp-2 leading-relaxed">{record.description}</p>
              <div className="flex items-center justify-between pt-6 border-t border-[#e2e2d9]/50">
                <div className="flex items-center gap-2 text-[#5a5a40]/60">
                  <Calendar size={14} />
                  <span className="text-[10px] font-mono">{record.date}</span>
                </div>
                <span className="text-lg font-serif font-bold text-[#2d4a3e]">{record.cost} €</span>
              </div>
            </div>
          );
        })}
        {records.length === 0 && (
          <div className="col-span-full text-center py-24 bg-white rounded-[32px] border border-dashed border-[#e2e2d9]">
            <Activity className="mx-auto text-[#5a5a40]/30 mb-4" size={48} />
            <p className="text-[#5a5a40] italic">Aucun historique de santé</p>
          </div>
        )}
      </div>
    </div>
  );
}
