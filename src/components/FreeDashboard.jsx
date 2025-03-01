import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { LineChart } from './Charts';
import DataTable from './DataTable';
import CodeEditor from './CodeEditor';

export default function FreeDashboard() {
  const [chatbots, setChatbots] = useState([]);
  const [usageMetrics, setUsageMetrics] = useState({
    totalRequests: 0,
    activeChatbots: 0,
    storageUsed: '0MB'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch chatbots
        const chatbotsSnapshot = await getDocs(collection(db, 'chatbots'));
        const chatbotsData = chatbotsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setChatbots(chatbotsData);

        // Set usage metrics
        setUsageMetrics({
          totalRequests: 1000, // Free tier limit
          activeChatbots: Math.min(chatbotsData.length, 1), // Free tier allows 1 chatbot
          storageUsed: '10MB' // Free tier limit
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Free Dashboard</h1>

      {/* Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard 
          title="Total Requests"
          value={`${usageMetrics.totalRequests}/1000`}
          icon="📊"
          warning={usageMetrics.totalRequests >= 1000}
        />
        <MetricCard 
          title="Active Chatbots"
          value={`${usageMetrics.activeChatbots}/1`}
          icon="🤖"
          warning={usageMetrics.activeChatbots >= 1}
        />
        <MetricCard 
          title="Storage Used"
          value={`${usageMetrics.storageUsed}/10MB`}
          icon="💾"
          warning={usageMetrics.storageUsed >= '10MB'}
        />
      </div>

      {/* Upgrade Prompt */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-2">Upgrade to Pro</h2>
        <p className="mb-4">
          Unlock more features and higher limits by upgrading to Pro!
        </p>
        <button 
          className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
          onClick={() => console.log('Upgrade clicked')}
        >
          Upgrade Now
        </button>
      </div>

      {/* Chatbot Management */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Chatbot Management</h2>
        <DataTable
          data={chatbots}
          columns={[
            { header: 'Name', accessor: 'name' },
            { header: 'Status', accessor: 'status' },
            { header: 'Last Active', accessor: 'lastActive' }
          ]}
          maxRows={1}
        />
      </div>

      {/* Basic Configuration */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Basic Configuration</h2>
        <CodeEditor 
          initialValue={JSON.stringify({
            welcomeMessage: 'Hello! How can I help you?',
            responseDelay: 1000
          }, null, 2)}
          onSave={(value) => console.log('Saved config:', value)}
          readOnly={usageMetrics.activeChatbots >= 1}
        />
      </div>

      {/* Basic Analytics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Usage Analytics</h2>
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

function MetricCard({ title, value, icon, warning = false }) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${warning ? 'border-2 border-red-500' : ''}`}>
      <div className="flex items-center space-x-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <div className="text-gray-500 text-sm">{title}</div>
          <div className={`text-2xl font-bold ${warning ? 'text-red-500' : ''}`}>{value}</div>
        </div>
      </div>
    </div>
  );
}
