import { createContext, useContext, useState } from "react";

// CONTEXTO PRINCIPAL
const BudgetContext = createContext();

export function BudgetProvider({ children }) {
  const [items, setItems] = useState([]);
  const [prices, setPrices] = useState({
    day: 0,
    night: 0,
    perKm: 0,
  });

  const addItem = (item) => {
    setItems((prev) => [...prev, item]);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id, changes) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...changes } : i)));
  };

  const updatePrices = (newPrices) => {
    setPrices((prev) => ({ ...prev, ...newPrices }));
  };

  return (
    <BudgetContext.Provider
      value={{ items, prices, addItem, removeItem, updateItem, updatePrices }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  return useContext(BudgetContext);
}