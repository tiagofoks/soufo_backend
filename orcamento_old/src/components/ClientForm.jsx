export default function ClientForm({ client, updateClient }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
      <h2 className="text-xl font-bold mb-4">Dados do Cliente</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(client).map((field) => (
          <div key={field}>
            <label className="text-sm">{field.toUpperCase()}</label>
            <input
              className="w-full p-2 border rounded"
              value={client[field]}
              onChange={(e) => updateClient(field, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
