import { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";

export default function PriceSettings({ db, userId, basePrices, isAuthReady }) {
  const [prices, setPrices] = useState({});

  useEffect(() => {
    if (basePrices) setPrices(basePrices);
  }, [basePrices]);

  async function save() {
    const ref = doc(db, `/artifacts/${__app_id}/users/${userId}/prices/base_prices`);
    await setDoc(ref, prices, { merge: true });
    alert("Preços atualizados com sucesso!");
  }

  function update(id, value) {
    setPrices((p) => ({ ...p, [id]: Number(value) }));
  }

  if (!isAuthReady) return null;

  return (
    <div className="bg-white p-6 rounded shadow border-t-4 border-purple-500">
      <h2 className="text-xl font-bold mb-4">Preços Base</h2>

      {Object.entries(prices).map(([id, price]) => (
        <div className="mb-3" key={id}>
          <label className="block text-sm font-medium">{id}</label>
          <input
            type="number"
            value={price}
            onChange={(e) => update(id, e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
      ))}

      <button
        onClick={save}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded shadow"
      >
        Salvar
      </button>
    </div>
  );
}