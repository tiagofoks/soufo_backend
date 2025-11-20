import { forwardRef } from "react";
import { formatCurrency } from "../utils/format";

const BudgetView = forwardRef(({ items, client, totalValue }, ref) => {
  return (
    <div ref={ref} className="p-8 bg-white rounded-lg shadow-md text-black border">
      <h2 className="text-2xl font-bold mb-4">Orçamento Completo</h2>

      <section className="mb-6">
        <h3 className="text-lg font-bold mb-2">Cliente</h3>
        <p><strong>Nome:</strong> {client.nome}</p>
        <p><strong>Telefone:</strong> {client.telefone}</p>
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Endereço:</strong> {client.endereco}</p>
        <p><strong>Cidade:</strong> {client.cidade}</p>
      </section>

      <section>
        <h3 className="text-lg font-bold mb-2">Itens</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Qtd</th>
              <th className="text-left p-2">Descrição</th>
              <th className="text-right p-2">Unitário</th>
              <th className="text-right p-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-b">
                <td className="p-2">{i.qty}</td>
                <td className="p-2">{i.description}</td>
                <td className="text-right p-2">{formatCurrency(i.unitPrice)}</td>
                <td className="text-right p-2">{formatCurrency(i.qty * i.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right mt-4 text-xl font-bold">
          Total: {formatCurrency(totalValue)}
        </div>
      </section>
    </div>
  );
});

export default BudgetView;