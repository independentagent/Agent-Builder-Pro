import { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';

export default function FirestoreExample() {
  const { data, loading, error, addDocument, updateDocument, deleteDocument } = useFirestore('items');
  const [newItem, setNewItem] = useState('');

  const handleAdd = async () => {
    if (!newItem.trim()) return;
    await addDocument({ name: newItem, createdAt: new Date() });
    setNewItem('');
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-bold mb-4">Firestore Example</h2>
      
      <div className="mb-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="border p-2 mr-2"
          placeholder="New item name"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Item
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      <ul className="space-y-2">
        {data.map((item) => (
          <li key={item.id} className="flex justify-between items-center p-2 border rounded">
            <span>{item.name}</span>
            <div>
              <button
                onClick={() => deleteDocument(item.id)}
                className="text-red-500 hover:text-red-700 mr-2"
              >
                Delete
              </button>
              <button
                onClick={() => updateDocument(item.id, { name: `${item.name} (updated)` })}
                className="text-blue-500 hover:text-blue-700"
              >
                Update
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
