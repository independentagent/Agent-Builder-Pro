import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate().toLocaleString()
      })));
    });

    return unsubscribe;
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Action</th>
            <th className="px-4 py-2 text-left">User</th>
            <th className="px-4 py-2 text-left">Details</th>
            <th className="px-4 py-2 text-left">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id} className="border-t">
              <td className="px-4 py-2">{log.action}</td>
              <td className="px-4 py-2">{log.userEmail}</td>
              <td className="px-4 py-2">{log.details}</td>
              <td className="px-4 py-2">{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
