import { useState, useEffect } from 'react';
import { CodeEditor } from './CodeEditor';
import { Button } from './Button';
import TestEnvironment from './TestEnvironment';

export default function AgentConfigEditor({ agent, onSave }) {
  const [config, setConfig] = useState(JSON.stringify(agent.config || {}, null, 2));
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setConfig(JSON.stringify(agent.config || {}, null, 2));
  }, [agent]);

  const handleSave = () => {
    try {
      const parsedConfig = JSON.parse(config);
      onSave(parsedConfig);
      setIsValid(true);
    } catch (err) {
      setIsValid(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Configuration Editor</h3>
        <div className="border rounded-lg overflow-hidden">
          <CodeEditor
            value={config}
            onChange={setConfig}
            language="json"
            height="400px"
          />
        </div>
        
        {!isValid && (
          <div className="text-red-500 text-sm">
            Invalid JSON configuration
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Save Configuration
          </Button>
        </div>
      </div>

      <TestEnvironment agent={agent} />
    </div>
  );
}
