import { useState, useRef } from 'react';
import { serverTimestamp, doc, collection, setDoc } from 'firebase/firestore';

export function useBudget(INITIAL_ITEMS) {
  const [client, setClient] = useState({
    nome: '',
    telefone: '',
    email: '',
    endereco: '',
    cidade: '',
  });

  const [items, setItems] = useState(INITIAL_ITEMS);
  const budgetRef = useRef(null);

  function updateClient(field, value) {
    setClient((c) => ({ ...c, [field]: value }));
  }

  function updateItem(id, field, value) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, [field]: field === 'description' ? value : Number(value) }
          : item
      )
    );
  }

  const totalValue = items.reduce((t, i) => t + i.qty * i.unitPrice, 0);

  async function saveBudget(db, appId, userId) {
    const ref = doc(collection(db, `/artifacts/${appId}/public/data/budgets`));

    const data = {
      client,
      items: items.map((i) => ({
        ...i,
        subtotal: i.qty * i.unitPrice,
      })),
      createdAt: serverTimestamp(),
      createdBy: userId,
      totalValue,
    };

    await setDoc(ref, data);
    return ref.id;
  }

  return {
    client,
    items,
    updateClient,
    updateItem,
    totalValue,
    budgetRef,
    saveBudget,
  };
}
