import { formatCurrency } from "../utils/format";

export default function ItemsTable({ items, updateItem }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
      <h2 className="text-xl font-bold mb-4">Itens e Valores</h2>

      <table className="w-full">
        <thead>
          <tr>
            <th>Qtd</th>
            <th>Item</th>
            <th>Unit</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>
                <input
                  type="number"
                  value={i.qty}
                  onChange={(e) => updateItem(i.id, "qty", e.target.value)}
                  className="w-16 border p-1"
                />
              </td>
              <td>{i.description}</td>
              <td className="text-right">{formatCurrency(i.unitPrice)}</td>
              <td className="text-right">{formatCurrency(i.qty * i.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
