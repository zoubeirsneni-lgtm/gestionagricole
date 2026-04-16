import React, { useState } from 'react';
import { useFirestore } from '@/hooks/useFirestore';
import { Button } from '@/components/ui/app-button';
import { Input } from '@/components/ui/app-input';
import { Label } from '@/components/ui/app-label';
import { cn } from '@/lib/utils';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/app-select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/app-dialog';
import { Card, CardContent } from '@/components/ui/app-card';
import { Badge } from '@/components/ui/app-badge';
import { Plus, Package, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { toast } from 'sonner';

export function StockManagement() {
  const { data: stocks, add, update } = useFirestore<any>('stocks');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newStock, setNewStock] = useState({
    name: '',
    category: 'Aliment',
    quantity: 0,
    unit: 'kg',
    minThreshold: 10
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await add(newStock);
      setIsAddOpen(false);
      toast.success('Stock ajouté');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const adjustQuantity = async (id: string, current: number, delta: number) => {
    const newVal = Math.max(0, current + delta);
    await update(id, { quantity: newVal });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif text-[#2d4a3e]">Stocks</h2>
          <p className="text-sm text-[#5a5a40] italic">Gestion des inventaires et consommables</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button className="bg-[#2d4a3e] hover:bg-[#1a2e26] text-white rounded-full px-6 h-11 shadow-md" />}>
            <Plus size={18} className="mr-2" />
            Nouvel article
          </DialogTrigger>
          <DialogContent className="rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-[#2d4a3e]">Ajouter au stock</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-6 pt-4">
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-[#5a5a40]">Nom de l'article</Label>
                <Input 
                  placeholder="ex: Foin, Vaccin X..."
                  className="rounded-xl border-[#e2e2d9]"
                  value={newStock.name}
                  onChange={e => setNewStock({...newStock, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-[#5a5a40]">Catégorie</Label>
                  <Select onValueChange={v => setNewStock({...newStock, category: v})}>
                    <SelectTrigger className="rounded-xl border-[#e2e2d9]">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Aliment">Aliment</SelectItem>
                      <SelectItem value="Médicament">Médicament</SelectItem>
                      <SelectItem value="Équipement">Équipement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-[#5a5a40]">Unité</Label>
                  <Input 
                    placeholder="kg, litres, unités..."
                    className="rounded-xl border-[#e2e2d9]"
                    value={newStock.unit}
                    onChange={e => setNewStock({...newStock, unit: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-[#5a5a40]">Quantité initiale</Label>
                  <Input 
                    type="number"
                    className="rounded-xl border-[#e2e2d9]"
                    value={newStock.quantity}
                    onChange={e => setNewStock({...newStock, quantity: Number(e.target.value)})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-[#5a5a40]">Seuil d'alerte</Label>
                  <Input 
                    type="number"
                    className="rounded-xl border-[#e2e2d9]"
                    value={newStock.minThreshold}
                    onChange={e => setNewStock({...newStock, minThreshold: Number(e.target.value)})}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#2d4a3e] hover:bg-[#1a2e26] text-white rounded-full h-12">Enregistrer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stocks.map((item) => {
          const isLow = item.quantity <= item.minThreshold;
          return (
            <div key={item.id} className={cn(
              "bg-white p-8 rounded-[32px] border transition-all hover:border-[#2d4a3e]/30",
              isLow ? "border-[#c27858]/50 bg-[#c27858]/5" : "border-[#e2e2d9]"
            )}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-2xl",
                    isLow ? "bg-[#c27858]/10" : "bg-[#f5f5f0]"
                  )}>
                    <Package className={isLow ? "text-[#c27858]" : "text-[#2d4a3e]"} size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#2d4a3e]">{item.name}</p>
                    <p className="text-xs text-[#5a5a40] font-serif italic">{item.category}</p>
                  </div>
                </div>
                {isLow && (
                  <span className="px-3 py-1 rounded-full bg-[#c27858] text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle size={12} />
                    Alerte
                  </span>
                )}
              </div>

              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-4xl font-serif font-bold text-[#2d4a3e]">
                    {item.quantity} 
                    <span className="text-sm font-normal text-[#5a5a40] ml-2">{item.unit}</span>
                  </p>
                  <p className="text-[10px] text-[#5a5a40]/60 uppercase tracking-widest font-bold mt-1">Seuil: {item.minThreshold} {item.unit}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 border border-[#e2e2d9] text-[#2d4a3e] hover:bg-[#e2e2d9] rounded-full"
                    onClick={() => adjustQuantity(item.id, item.quantity, -1)}
                  >
                    <ArrowDownRight size={18} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 border border-[#e2e2d9] text-[#2d4a3e] hover:bg-[#e2e2d9] rounded-full"
                    onClick={() => adjustQuantity(item.id, item.quantity, 1)}
                  >
                    <ArrowUpRight size={18} />
                  </Button>
                </div>
              </div>

              <div className="w-full bg-[#f5f5f0] h-1.5 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-500",
                    isLow ? "bg-[#c27858]" : "bg-[#2d4a3e]"
                  )}
                  style={{ width: `${Math.min(100, (item.quantity / (item.minThreshold * 2)) * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
        {stocks.length === 0 && (
          <div className="col-span-full text-center py-24 bg-white rounded-[32px] border border-dashed border-[#e2e2d9]">
            <Package className="mx-auto text-[#5a5a40]/30 mb-4" size={48} />
            <p className="text-[#5a5a40] italic">Aucun article en stock</p>
          </div>
        )}
      </div>
    </div>
  );
}
