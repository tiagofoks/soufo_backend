import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  onSnapshot,
} from 'firebase/firestore';

export function useFirebase(INITIAL_ITEMS, setItems) {
  const [auth, setAuth] = useState(null);
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [basePrices, setBasePrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};

    async function init() {
      try {
        const appId = __app_id;
        const config = JSON.parse(__firebase_config);

        const app = initializeApp(config, appId);
        const authInstance = getAuth(app);
        const dbInstance = getFirestore(app);

        setAuth(authInstance);
        setDb(dbInstance);

        const login = __initial_auth_token
          ? signInWithCustomToken(authInstance, __initial_auth_token)
          : signInAnonymously(authInstance);

        await login;

        onAuthStateChanged(authInstance, (user) => {
          if (!user) {
            setIsAuthReady(true);
            setLoading(false);
            return;
          }

          setUserId(user.uid);
          setIsAuthReady(true);
          setLoading(false);

          const pricesRef = doc(
            dbInstance,
            `/artifacts/${appId}/users/${user.uid}/prices`,
            'base_prices'
          );

          unsubscribe = onSnapshot(pricesRef, (snap) => {
            const data = snap.exists() ? snap.data() : {};
            setBasePrices(data);

            // Atualiza itens
            setItems((prev) =>
              prev.map((i) => ({
                ...i,
                unitPrice: data[i.id] ?? i.unitPrice,
              }))
            );
          });
        });
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }

    init();
    return () => unsubscribe();
  }, []);

  return { auth, db, userId, basePrices, isAuthReady, loading };
}
