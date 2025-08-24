import React, { useState } from 'react';
import aiAgentAPI from '../services/aiAgentApi';

export default function AITest() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<any>(null);

  const testHealth = async () => {
    try {
      const result = await aiAgentAPI.getHealth();
      setHealth(result);
    } catch (error) {
      console.error('Health check failed:', error);
      setHealth({ error: error.message });
    }
  };

  const testQuery = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const result = await aiAgentAPI.processQuery(query.trim());
      setResponse(result.response);
    } catch (error) {
      console.error('Query failed:', error);
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🤖 AI Agent Test Page</h1>
        
        {/* Health Check */}
        <div className="bg-white/10 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">System Health Check</h2>
          <button
            onClick={testHealth}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg mb-4"
          >
            Check Health
          </button>
          
          {health && (
            <div className="bg-white/5 rounded-lg p-4">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(health, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Query Test */}
        <div className="bg-white/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test AI Agent Query</h2>
          
          <div className="mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about your supply chain..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={testQuery}
            disabled={loading || !query.trim()}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg mb-4"
          >
            {loading ? 'Processing...' : 'Send Query'}
          </button>
          
          {response && (
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Response:</h3>
              <div className="whitespace-pre-line text-sm">{response}</div>
            </div>
          )}
        </div>

        {/* Quick Test Queries */}
        <div className="bg-white/10 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Test Queries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'What is the current status of our shipments?',
              'Show me active disruptions',
              'Give me inventory overview',
              'How is transportation performing?'
            ].map((testQuery, index) => (
              <button
                key={index}
                onClick={() => setQuery(testQuery)}
                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-3 text-left text-sm transition-colors"
              >
                {testQuery}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
