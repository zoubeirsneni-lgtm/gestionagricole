import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

export function useFirestore<T>(collectionName: string, constraints: QueryConstraint[] = []) {
  const { user } = useAuth();
  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, collectionName),
      where('ownerId', '==', user.uid),
      ...constraints
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          ...(doc.data() as T),
          id: doc.id
        }));
        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching ${collectionName}:`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user, collectionName]);

  const add = async (item: Omit<T, 'id' | 'ownerId'>) => {
    if (!user) return;
    return addDoc(collection(db, collectionName), {
      ...item,
      ownerId: user.uid,
      createdAt: new Date().toISOString()
    });
  };

  const update = async (id: string, item: Partial<T>) => {
    return updateDoc(doc(db, collectionName, id), item as any);
  };

  const remove = async (id: string) => {
    return deleteDoc(doc(db, collectionName, id));
  };

  return { data, loading, error, add, update, remove };
}
