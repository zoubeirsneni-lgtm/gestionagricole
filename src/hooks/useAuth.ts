import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        let role: UserRole = 'viewer';

        if (userDoc.exists()) {
          role = userDoc.data().role as UserRole;
        } else {
          // New user initialization
          // The very first super_admin is hardcoded in Firestore Rules by email
          // But we store the role in the doc for the UI to know
          if (firebaseUser.email === 'zoubeirsneni@gmail.com') {
            role = 'super_admin';
          }
          
          await setDoc(userDocRef, {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: role,
            createdAt: new Date().toISOString()
          });
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
