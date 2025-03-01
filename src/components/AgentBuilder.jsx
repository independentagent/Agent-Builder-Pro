import { useState } from 'react';
import { useAgents } from '../hooks/useAgents';
import AgentConfigEditor from './AgentConfigEditor';

export default function AgentBuilder() {
  const { agents, loading, error, createAgent, updateAgent, deleteAgent, publishAgent } = useAgents();
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentDescription, setNewAgentDescription] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);

  const handleCreate = async () => {
    if (!newAgentName.trim()) return;
    await createAgent({
      name: newAgentName,
      description: newAgentDescription,
      config: {}
    });
    setNewAgentName('');
    setNewAgentDescription('');
  };

  const handleConfigSave = async (config) => {
    await updateAgent(selectedAgent.id, { config });
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-bold mb-4">AI Agent Builder</h2>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="mb-4 space-y-2">
            <input
              type="text"
              value={newAgentName}
              onChange={(e) => setNewAgentName(e.target.value)}
              className="border p-2 w-full"
              placeholder="Agent name"
            />
            <textarea
              value={newAgentDescription}
              onChange={(e) => setNewAgentDescription(e.target.value)}
              className="border p-2 w-full"
              placeholder="Agent description"
              rows={3}
            />
            <button
              onClick={handleCreate}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Create New Agent
            </button>
          </div>

          {loading && <p>Loading agents...</p>}
          {error && <p className="text-red-500">Error: {error.message}</p>}

          <div className="space-y-4">
            {agents.map((agent) => (
              <div 
                key={agent.id} 
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedAgent?.id === agent.id ? 'border-blue-500' : ''
                }`}
                onClick={() => setSelectedAgent(agent)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{agent.name}</h3>
                    <p className="text-sm text-gray-600">{agent.description}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      Status: {agent.status} | Created: {new Date(agent.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        publishAgent(agent.id);
                      }}
                      className="text-green-500 hover:text-green-700"
                      disabled={agent.status === 'published'}
                    >
                      Publish
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAgent(agent.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {selectedAgent && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Configuration Editor</h3>
              <AgentConfigEditor 
                agent={selectedAgent}
                onSave={handleConfigSave}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
