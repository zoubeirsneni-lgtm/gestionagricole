import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase.ts';

export type UserRole = 'super_admin' | 'admin' | 'viewer';

interface AppUser extends User {
  role?: UserRole;
}

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // 1. Try to find by UID
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        let userDoc = await getDoc(userDocRef);
        let role: UserRole = 'viewer';

        if (userDoc.exists()) {
          role = userDoc.data().role as UserRole;
        } else {
          // 2. Try to find by Email (for pre-authorized users)
          const q = query(collection(db, 'users'), where('email', '==', firebaseUser.email));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const preAuthDoc = querySnapshot.docs[0];
            role = preAuthDoc.data().role as UserRole;
            // Migrating pre-auth record to UID-based record if email was not UID
            await setDoc(userDocRef, {
              ...preAuthDoc.data(),
              uid: firebaseUser.uid, // ensure uid is stored
              updatedAt: new Date().toISOString()
            });
            // We could delete the old one, but keeping it simple for now
          } else {
            // New user initialization
            if (firebaseUser.email === 'zoubeirsneni@gmail.com') {
              role = 'super_admin';
            }
            
            await setDoc(userDocRef, {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              role: role,
              uid: firebaseUser.uid,
              createdAt: new Date().toISOString()
            });
          }
        }

        setUser({ ...firebaseUser, role } as AppUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { 
    user, 
    loading,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isSuperAdmin: user?.role === 'super_admin',
    isViewer: user?.role === 'viewer'
  };
}
