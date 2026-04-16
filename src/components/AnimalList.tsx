import React, { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Plus, Search, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

export function AnimalList() {
  const { data: animals, add, remove } = useFirestore<any>('animals');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newAnimal, setNewAnimal] = useState({
    tagId: '',
    species: 'Bovin',
    breed: '',
    birthDate: '',
    gender: 'Femelle',
    status: 'Actif',
    weight: 0
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await add(newAnimal);
      setIsAddOpen(false);
      setNewAnimal({
        tagId: '',
        species: 'Bovin',
        breed: '',
        birthDate: '',
        gender: 'Femelle',
        status: 'Actif',
        weight: 0
      });
      toast.success('Animal ajouté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout');
    }
  };

  const filteredAnimals = animals.filter(a => 
    a.tagId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-serif text-[#2d4a3e]">Animaux</h2>
          <p className="text-sm text-[#5a5a40] italic">Gérez votre cheptel avec précision</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button className="bg-[#2d4a3e] hover:bg-[#1a2e26] text-white rounded-full px-6 h-11 shadow-md" />}>
            <Plus size={18} className="mr-2" />
            Ajouter un animal
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-[#2d4a3e]">Nouvel Animal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-6 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="tagId" className="text-xs font-bold uppercase tracking-widest text-[#5a5a40]">ID / Boucle</Label>
                <Input 
                  id="tagId" 
                  required 
                  className="rounded-xl border-[#e2e2d9] focus:ring-[#2d4a3e]"
                  value={newAnimal.tagId}
                  onChange={e => setNewAnimal({...newAnimal, tagId: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-[#5a5a40]">Espèce</Label>
                  <Select 
                    value={newAnimal.species} 
                    onValueChange={v => setNewAnimal({...newAnimal, species: v})}
                  >
                    <SelectTrigger className="rounded-xl border-[#e2e2d9]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Bovin">Bovin</SelectItem>
                      <SelectItem value="Ovin">Ovin</SelectItem>
                      <SelectItem value="Caprin">Caprin</SelectItem>
                      <SelectItem value="Porcin">Porcin</SelectItem>
                      <SelectItem value="Volaille">Volaille</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-[#5a5a40]">Genre</Label>
                  <Select 
                    value={newAnimal.gender} 
                    onValueChange={v => setNewAnimal({...newAnimal, gender: v})}
                  >
                    <SelectTrigger className="rounded-xl border-[#e2e2d9]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Mâle">Mâle</SelectItem>
                      <SelectItem value="Femelle">Femelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="breed" className="text-xs font-bold uppercase tracking-widest text-[#5a5a40]">Race</Label>
                <Input 
                  id="breed" 
                  className="rounded-xl border-[#e2e2d9]"
                  value={newAnimal.breed}
                  onChange={e => setNewAnimal({...newAnimal, breed: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="birthDate" className="text-xs font-bold uppercase tracking-widest text-[#5a5a40]">Date de naissance</Label>
                <Input 
                  id="birthDate" 
                  type="date" 
                  className="rounded-xl border-[#e2e2d9]"
                  value={newAnimal.birthDate}
                  onChange={e => setNewAnimal({...newAnimal, birthDate: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full bg-[#2d4a3e] hover:bg-[#1a2e26] text-white rounded-full h-12">Enregistrer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a5a40]" size={18} />
        <Input 
          placeholder="Rechercher un animal (ID, Race...)" 
          className="pl-12 h-12 bg-white border-[#e2e2d9] rounded-full focus:ring-[#2d4a3e]"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[32px] border border-[#e2e2d9] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f5f5f0]/50 border-b border-[#e2e2d9]">
              <TableHead className="text-[#5a5a40] font-serif italic py-5 px-6">ID / Boucle</TableHead>
              <TableHead className="text-[#5a5a40] font-serif italic py-5 px-6">Espèce</TableHead>
              <TableHead className="text-[#5a5a40] font-serif italic py-5 px-6">Race</TableHead>
              <TableHead className="text-[#5a5a40] font-serif italic py-5 px-6">Genre</TableHead>
              <TableHead className="text-[#5a5a40] font-serif italic py-5 px-6">Statut</TableHead>
              <TableHead className="text-right text-[#5a5a40] font-serif italic py-5 px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAnimals.map((animal) => (
              <TableRow key={animal.id} className="border-b border-[#e2e2d9]/50 hover:bg-[#f5f5f0]/30 transition-colors">
                <TableCell className="font-mono font-bold text-[#2d4a3e] py-5 px-6">#{animal.tagId}</TableCell>
                <TableCell className="py-5 px-6 text-[#5a5a40]">{animal.species}</TableCell>
                <TableCell className="py-5 px-6 text-[#5a5a40]">{animal.breed || '-'}</TableCell>
                <TableCell className="py-5 px-6 text-[#5a5a40]">{animal.gender}</TableCell>
                <TableCell className="py-5 px-6">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    animal.status === 'Actif' ? "bg-[#e2e2d9] text-[#2d4a3e]" : "bg-[#fee2e2] text-[#991b1b]"
                  )}>
                    {animal.status}
                  </span>
                </TableCell>
                <TableCell className="text-right py-5 px-6">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="text-[#5a5a40] hover:text-[#2d4a3e] hover:bg-[#f5f5f0] rounded-full">
                      <Edit2 size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-[#5a5a40] hover:text-[#c27858] hover:bg-red-50 rounded-full"
                      onClick={() => remove(animal.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredAnimals.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-[#5a5a40] italic">
                  Aucun animal trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
