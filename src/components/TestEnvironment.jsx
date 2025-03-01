import { useState } from 'react';
import { Button } from './Button';
import { CodeEditor } from './CodeEditor';

export default function TestEnvironment({ agent }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTest = async () => {
    if (!agent?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API call
      const response = await new Promise((resolve) => 
        setTimeout(() => resolve({
          data: {
            response: `Processed input: ${input}`,
            metadata: {
              timestamp: new Date().toISOString(),
              agentId: agent.id
            }
          }
        }), 1000)
      );

      setOutput(JSON.stringify(response.data, null, 2));
    } catch (err) {
      setError(err.message);
      setOutput('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Test Environment</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium">Input</h4>
          <div className="border rounded-lg overflow-hidden">
            <CodeEditor
              value={input}
              onChange={setInput}
              language="json"
              height="200px"
            />
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Output</h4>
          <div className="border rounded-lg overflow-hidden">
            <CodeEditor
              value={output}
              onChange={() => {}}
              language="json"
              height="200px"
              readOnly
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          Error: {error}
        </div>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleTest}
          disabled={loading || !agent?.id}
        >
          {loading ? 'Testing...' : 'Run Test'}
        </Button>
      </div>
    </div>
  );
}
