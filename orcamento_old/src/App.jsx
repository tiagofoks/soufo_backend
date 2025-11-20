import { INITIAL_ITEMS } from "./utils/initialItems";
import { useFirebase } from "./hooks/useFirebase";
import { useBudget } from "./hooks/useBudget";

import ClientForm from "./components/ClientForm";
import ItemsTable from "./components/ItemsTable";
import PriceSettings from "./components/PriceSettings";
import BudgetView from "./components/BudgetView";

export default function App() {
  const {
    client,
    items,
    updateClient,
    updateItem,
    totalValue,
    budgetRef,
    saveBudget,
  } = useBudget(INITIAL_ITEMS);

  const {
    db,
    userId,
    basePrices,
    isAuthReady,
    loading,
  } = useFirebase(INITIAL_ITEMS, (fn) => fn);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Gerador de Orçamentos Solar</h1>

      <ClientForm client={client} updateClient={updateClient} />

      <ItemsTable items={items} updateItem={updateItem} />

      <PriceSettings
        db={db}
        userId={userId}
        basePrices={basePrices}
        isAuthReady={isAuthReady}
      />

      <BudgetView
        ref={budgetRef}
        items={items}
        client={client}
        totalValue={totalValue}
      />
    </div>
  );
}
