import React, { useState } from 'react';
import { useFirestore } from '@/hooks/useFirestore.ts';
import { useAuth } from '@/hooks/useAuth.ts';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui-elements/app-table.tsx';
import { Button } from '@/components/ui-elements/app-button.tsx';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui-elements/app-select.tsx';
import { Badge } from '@/components/ui-elements/app-badge.tsx';
import { Shield, ShieldAlert, User, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-elements/app-card.tsx';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function UserManagement() {
  const { data: users, update, remove } = useFirestore<any>('users');
  const { isSuperAdmin, user: currentUser } = useAuth();

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      if (!isSuperAdmin) {
        toast.error('Seul le Super Admin peut modifier les rôles.');
        return;
      }
      await update(userId, { role: newRole });
      toast.success('Rôle mis à jour avec succès.');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du rôle.');
    }
  };

  const handleRemove = async (userId: string) => {
    if (userId === currentUser?.uid) {
      toast.error('Vous ne pouvez pas supprimer votre propre compte.');
      return;
    }
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await remove(userId);
        toast.success('Utilisateur supprimé.');
      } catch (error) {
        toast.error('Erreur lors de la suppression.');
      }
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh]">
        <ShieldAlert className="w-16 h-16 text-[#c27858] mb-4" />
        <h2 className="text-2xl font-serif text-[#2d4a3e] mb-2">Accès Restreint</h2>
        <p className="text-[#5a5a40]">Votre compte n'a pas les privilèges nécessaires pour gérer les utilisateurs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif text-[#2d4a3e]">Gestion des Utilisateurs</h2>
          <p className="text-[#5a5a40]">Gérez les rôles et les permissions d'accès.</p>
        </div>
      </div>

      <Card className="rounded-[32px] border-[#e2e2d9] shadow-none overflow-hidden">
        <CardHeader className="bg-[#f5f5f0]/50 border-b border-[#e2e2d9]">
          <CardTitle className="font-serif">Liste des Utilisateurs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-[#e2e2d9] hover:bg-transparent">
                <TableHead className="font-serif italic pl-8">Utilisateur</TableHead>
                <TableHead className="font-serif italic text-center">Rôle Actuel</TableHead>
                <TableHead className="font-serif italic text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} className="border-[#e2e2d9]/50 transition-colors hover:bg-[#f5f5f0]/30">
                  <TableCell className="py-4 pl-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#e2e2d9] flex items-center justify-center text-[#2d4a3e]">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-[#2d4a3e]">{u.displayName || 'Sans nom'}</div>
                        <div className="text-xs text-[#5a5a40] font-mono">{u.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={cn(
                      "font-bold uppercase tracking-widest text-[10px]",
                      u.role === 'super_admin' ? "bg-[#2d4a3e] text-white border-transparent" :
                      u.role === 'admin' ? "bg-[#5a5a40] text-white border-transparent" : 
                      "bg-[#e2e2d9] text-[#2d4a3e] border-[#2d4a3e]/10"
                    )}>
                      {u.role?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex items-center justify-end gap-3">
                      <Select 
                        defaultValue={u.role} 
                        onValueChange={(val) => handleRoleChange(u.id, val)}
                        disabled={u.email === 'zoubeirsneni@gmail.com'} // Protect the primary root
                      >
                        <SelectTrigger className="w-36 rounded-full border-[#e2e2d9] font-medium text-xs">
                          <SelectValue placeholder="Changer rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="viewer">Lecture Seule</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {u.email !== 'zoubeirsneni@gmail.com' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-[#991b1b] hover:bg-[#fee2e2] rounded-full"
                          onClick={() => handleRemove(u.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="bg-[#f5f5f0] p-6 rounded-[24px] border border-[#e2e2d9] flex gap-4 items-start">
        <Shield className="w-6 h-6 text-[#2d4a3e] shrink-0" />
        <div className="text-sm text-[#5a5a40] leading-relaxed">
          <p className="font-bold text-[#2d4a3e] mb-1">Rappel des permissions :</p>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Super Admin :</strong> Peut gérer les utilisateurs et modifier toutes les données.</li>
            <li><strong>Admin :</strong> Peut modifier les animaux, la santé, la reproduction et les stocks.</li>
            <li><strong>Lecture Seule :</strong> Peut visualiser tous les tableaux de bord mais ne peut rien modifier.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
