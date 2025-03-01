import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { LineChart } from './Charts';
import DataTable from './DataTable';
import SupportTickets from './SupportTickets';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [chatbots, setChatbots] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    chatbotIssues: 0,
    openTickets: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);

        // Fetch chatbots
        const chatbotsSnapshot = await getDocs(collection(db, 'chatbots'));
        const chatbotsData = chatbotsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setChatbots(chatbotsData);

        // Fetch tickets
        const ticketsSnapshot = await getDocs(collection(db, 'tickets'));
        const ticketsData = ticketsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTickets(ticketsData);

        // Set metrics
        setMetrics({
          activeUsers: usersData.filter(u => u.status === 'active').length,
          chatbotIssues: chatbotsData.filter(c => c.status === 'needs_attention').length,
          openTickets: ticketsData.filter(t => t.status === 'open').length
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleResolveTicket = async (ticketId) => {
    try {
      await updateDoc(doc(db, 'tickets', ticketId), { status: 'resolved' });
      setTickets(prev => prev.map(t => 
        t.id === ticketId ? { ...t, status: 'resolved' } : t
      ));
    } catch (error) {
      console.error('Error resolving ticket:', error);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard 
          title="Active Users"
          value={metrics.activeUsers}
          icon="👥"
        />
        <MetricCard 
          title="Chatbot Issues"
          value={metrics.chatbotIssues}
          icon="⚠️"
        />
        <MetricCard 
          title="Open Tickets"
          value={metrics.openTickets}
          icon="📩"
        />
      </div>

      {/* User Management */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">User Management</h2>
        <DataTable
          data={users}
          columns={[
            { header: 'Name', accessor: 'name' },
            { header: 'Email', accessor: 'email' },
            { header: 'Role', accessor: 'role' },
            { header: 'Status', accessor: 'status' }
          ]}
          onEdit={(id, values) => handleUpdateUserRole(id, values.role)}
        />
      </div>

      {/* Chatbot Oversight */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Chatbot Oversight</h2>
        <DataTable
          data={chatbots}
          columns={[
            { header: 'Name', accessor: 'name' },
            { header: 'Owner', accessor: 'ownerEmail' },
            { header: 'Status', accessor: 'status' },
            { header: 'Last Active', accessor: 'lastActive' }
          ]}
        />
      </div>

      {/* Support Tickets */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Support Tickets</h2>
        <SupportTickets 
          tickets={tickets}
          onResolve={handleResolveTicket}
        />
      </div>

      {/* Analytics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">User Activity</h2>
        <LineChart 
          data={[
            { date: '2023-01', value: 100 },
            { date: '2023-02', value: 150 },
            { date: '2023-03', value: 200 }
          ]}
        />
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <div className="text-gray-500 text-sm">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
}
