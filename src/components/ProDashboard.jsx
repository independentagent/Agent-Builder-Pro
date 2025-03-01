import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { LineChart, BarChart } from './Charts';
import DataTable from './DataTable';
import CodeEditor from './CodeEditor';

export default function ProDashboard() {
  const [chatbots, setChatbots] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
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

        // Fetch API keys
        const apiKeysSnapshot = await getDocs(collection(db, 'apiKeys'));
        setApiKeys(apiKeysSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));

        // Set usage metrics
        setUsageMetrics({
          totalRequests: 12345,
          activeChatbots: chatbotsData.length,
          storageUsed: '256MB'
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleUpdateChatbot = async (chatbotId, updates) => {
    try {
      await updateDoc(doc(db, 'chatbots', chatbotId), updates);
      setChatbots(prev => prev.map(c => 
        c.id === chatbotId ? { ...c, ...updates } : c
      ));
    } catch (error) {
      console.error('Error updating chatbot:', error);
    }
  };

  const handleRegenerateApiKey = async (keyId) => {
    try {
      const newKey = generateApiKey();
      await updateDoc(doc(db, 'apiKeys', keyId), { key: newKey });
      setApiKeys(prev => prev.map(k => 
        k.id === keyId ? { ...k, key: newKey } : k
      ));
    } catch (error) {
      console.error('Error regenerating API key:', error);
    }
  };

  const generateApiKey = () => {
    return `sk-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Pro Dashboard</h1>

      {/* Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard 
          title="Total Requests"
          value={usageMetrics.totalRequests.toLocaleString()}
          icon="📊"
        />
        <MetricCard 
          title="Active Chatbots"
          value={usageMetrics.activeChatbots}
          icon="🤖"
        />
        <MetricCard 
          title="Storage Used"
          value={usageMetrics.storageUsed}
          icon="💾"
        />
      </div>

      {/* Chatbot Management */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Chatbot Management</h2>
        <DataTable
          data={chatbots}
          columns={[
            { header: 'Name', accessor: 'name' },
            { header: 'Status', accessor: 'status' },
            { header: 'Last Active', accessor: 'lastActive' },
            { header: 'Requests', accessor: 'requestCount' }
          ]}
          onEdit={handleUpdateChatbot}
        />
      </div>

      {/* API Key Management */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">API Keys</h2>
        <DataTable
          data={apiKeys}
          columns={[
            { header: 'Name', accessor: 'name' },
            { header: 'Key', accessor: 'key' },
            { header: 'Created', accessor: 'createdAt' }
          ]}
          actions={[
            {
              label: 'Regenerate',
              action: handleRegenerateApiKey,
              className: 'text-blue-500 hover:text-blue-700'
            }
          ]}
        />
      </div>

      {/* Advanced Configuration */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Advanced Configuration</h2>
        <CodeEditor 
          initialValue={JSON.stringify({
            rateLimiting: {
              requestsPerMinute: 1000
            },
            caching: {
              enabled: true,
              ttl: 300
            }
          }, null, 2)}
          onSave={(value) => console.log('Saved config:', value)}
        />
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Request Volume</h2>
          <LineChart 
            data={[
              { date: '2023-01', value: 1000 },
              { date: '2023-02', value: 1500 },
              { date: '2023-03', value: 2000 }
            ]}
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Chatbot Usage</h2>
          <BarChart 
            data={[
              { chatbot: 'Support Bot', requests: 1200 },
              { chatbot: 'Sales Bot', requests: 800 },
              { chatbot: 'FAQ Bot', requests: 1500 }
            ]}
          />
        </div>
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
