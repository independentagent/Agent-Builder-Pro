import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { LineChart, BarChart } from './Charts';
import DataTable from './DataTable';
import AuditLogs from './AuditLogs';

export default function SuperAdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeChatbots: 0,
    monthlyRevenue: 0,
    systemHealth: 'Good'
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

        // Fetch metrics (mock data for now)
        setMetrics({
          totalUsers: usersData.length,
          activeChatbots: 123,
          monthlyRevenue: 45678,
          systemHealth: 'Good'
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleUpdateUser = async (userId, updates) => {
    try {
      await updateDoc(doc(db, 'users', userId), updates);
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, ...updates } : u
      ));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Users"
          value={metrics.totalUsers}
          icon="👥"
        />
        <MetricCard 
          title="Active Chatbots"
          value={metrics.activeChatbots}
          icon="🤖"
        />
        <MetricCard 
          title="Monthly Revenue"
          value={`$${metrics.monthlyRevenue.toLocaleString()}`}
          icon="💵"
        />
        <MetricCard 
          title="System Health"
          value={metrics.systemHealth}
          icon="🟢"
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
          onEdit={handleUpdateUser}
          onDelete={handleDeleteUser}
        />
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Chatbot Usage</h2>
          <LineChart 
            data={[
              { date: '2023-01', value: 100 },
              { date: '2023-02', value: 150 },
              { date: '2023-03', value: 200 }
            ]}
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Revenue Growth</h2>
          <BarChart 
            data={[
              { month: 'Jan', revenue: 10000 },
              { month: 'Feb', revenue: 15000 },
              { month: 'Mar', revenue: 20000 }
            ]}
          />
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Audit Logs</h2>
        <AuditLogs />
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
