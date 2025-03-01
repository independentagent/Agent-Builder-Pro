import { useState } from 'react';

export default function DataTable({ data, columns, maxRows = Infinity }) {
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const handleEdit = (id, values) => {
    setEditingId(id);
    setEditValues(values);
  };

  const handleSave = async (id) => {
    await onEdit(id, editValues);
    setEditingId(null);
  };

  const displayedData = data.slice(0, maxRows);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.accessor} className="px-4 py-2 text-left">
                {col.header}
              </th>
            ))}
            {maxRows > data.length && <th className="px-4 py-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {displayedData.map(item => (
            <tr key={item.id} className="border-t">
              {columns.map(col => (
                <td key={col.accessor} className="px-4 py-2">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={editValues[col.accessor] || item[col.accessor]}
                      onChange={(e) => setEditValues(prev => ({
                        ...prev,
                        [col.accessor]: e.target.value
                      }))}
                      className="border p-1"
                    />
                  ) : (
                    item[col.accessor]
                  )}
                </td>
              ))}
              {maxRows > data.length && (
                <td className="px-4 py-2 space-x-2">
                  {editingId === item.id ? (
                    <>
                      <button 
                        onClick={() => handleSave(item.id)}
                        className="text-green-500 hover:text-green-700"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setEditingId(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => handleEdit(item.id, item)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
          {maxRows <= data.length && (
            <tr>
              <td colSpan={columns.length + 1} className="px-4 py-2 text-center text-gray-500">
                Upgrade to Pro to manage more chatbots
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
