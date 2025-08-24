import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  Truck, 
  Ship, 
  Plane, 
  Train,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import aiAgentAPI from '../services/aiAgentApi';

export default function AITest() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<any>(null);
  const [responseType, setResponseType] = useState<'text' | 'data' | 'chart'>('text');
  const [responseData, setResponseData] = useState<any>(null);

  const testHealth = async () => {
    try {
      const result = await aiAgentAPI.getHealth();
      setHealth(result);
    } catch (error) {
      console.error('Health check failed:', error);
      setHealth({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  const testQuery = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const result = await aiAgentAPI.processQuery(query.trim());
      setResponse(result.response);
      
      // Try to parse response for data visualization
      const parsedData = parseResponseForVisualization(result.response, query);
      if (parsedData) {
        setResponseData(parsedData);
        setResponseType('data');
      } else {
        setResponseType('text');
      }
    } catch (error) {
      console.error('Query failed:', error);
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setResponseType('text');
    } finally {
      setLoading(false);
    }
  };

  const parseResponseForVisualization = (response: string, query: string) => {
    // Parse different types of responses for visualization
    const lowerQuery = query.toLowerCase();
    const lowerResponse = response.toLowerCase();
    
    // Shipment status visualization
    if (lowerQuery.includes('shipment') || lowerQuery.includes('status')) {
      return parseShipmentData(response);
    }
    
    // Disruption visualization
    if (lowerQuery.includes('disruption') || lowerQuery.includes('risk')) {
      return parseDisruptionData(response);
    }
    
    // Inventory visualization
    if (lowerQuery.includes('inventory') || lowerQuery.includes('stock')) {
      return parseInventoryData(response);
    }
    
    // Performance visualization
    if (lowerQuery.includes('performance') || lowerQuery.includes('transportation')) {
      return parsePerformanceData(response);
    }
    
    return null;
  };

  const parseShipmentData = (response: string) => {
    // Mock shipment data parsing - in real app, this would parse actual response
    return {
      type: 'shipments',
      data: [
        { status: 'In Transit', count: 15, color: 'bg-blue-500' },
        { status: 'Delivered', count: 8, color: 'bg-green-500' },
        { status: 'Delayed', count: 3, color: 'bg-yellow-500' },
        { status: 'Cancelled', count: 1, color: 'bg-red-500' }
      ],
      total: 27
    };
  };

  const parseDisruptionData = (response: string) => {
    return {
      type: 'disruptions',
      data: [
        { type: 'Weather', severity: 'High', count: 2, color: 'bg-orange-500' },
        { type: 'Port Closure', severity: 'Medium', count: 1, color: 'bg-red-500' },
        { type: 'Carrier Strike', severity: 'Low', count: 1, color: 'bg-yellow-500' }
      ],
      total: 4
    };
  };

  const parseInventoryData = (response: string) => {
    return {
      type: 'inventory',
      data: [
        { category: 'Electronics', level: 85, status: 'Good', color: 'bg-green-500' },
        { category: 'Clothing', level: 45, status: 'Medium', color: 'bg-yellow-500' },
        { category: 'Food', level: 20, status: 'Low', color: 'bg-red-500' },
        { category: 'Automotive', level: 70, status: 'Good', color: 'bg-green-500' }
      ]
    };
  };

  const parsePerformanceData = (response: string) => {
    return {
      type: 'performance',
      data: [
        { mode: 'Sea', onTime: 78, cost: 1250, icon: Ship },
        { mode: 'Air', onTime: 92, cost: 2800, icon: Plane },
        { mode: 'Road', onTime: 85, cost: 450, icon: Truck },
        { mode: 'Rail', onTime: 88, cost: 380, icon: Train }
      ]
    };
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Response:</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setResponseType('text')}
                    className={`px-3 py-1 rounded text-xs ${
                      responseType === 'text' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    Text
                  </button>
                  {responseData && (
                    <button
                      onClick={() => setResponseType('data')}
                      className={`px-3 py-1 rounded text-xs ${
                        responseType === 'data' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white/10 text-white/70'
                      }`}
                    >
                      Visual
                    </button>
                  )}
                </div>
              </div>
              
              {responseType === 'text' ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Enhanced colorful styling for markdown elements
                      h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-3 text-blue-400 border-b border-blue-400/30 pb-1" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-base font-semibold mb-2 text-green-400" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-sm font-semibold mb-1 text-yellow-400" {...props} />,
                      p: ({node, ...props}) => <p className="mb-2 leading-relaxed" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3 space-y-1 ml-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-2" {...props} />,
                      li: ({node, ...props}) => <li className="text-sm leading-relaxed" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-blue-300" {...props} />,
                      em: ({node, ...props}) => <em className="italic text-purple-300" {...props} />,
                      code: ({node, ...props}) => <code className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-2 py-1 rounded text-xs font-mono border border-purple-400/30" {...props} />,
                      pre: ({node, ...props}) => <pre className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-3 rounded-lg text-xs font-mono overflow-x-auto border border-gray-600/30 shadow-lg" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gradient-to-b from-blue-400 to-purple-400 pl-4 italic bg-gradient-to-r from-blue-500/10 to-purple-500/10 py-2 rounded-r-lg" {...props} />,
                      table: ({node, ...props}) => <table className="w-full border-collapse border border-blue-400/30 rounded-lg overflow-hidden" {...props} />,
                      th: ({node, ...props}) => <th className="border border-blue-400/30 px-3 py-2 text-left font-semibold bg-gradient-to-r from-blue-500/20 to-purple-500/20" {...props} />,
                      td: ({node, ...props}) => <td className="border border-blue-400/30 px-3 py-2 bg-white/5" {...props} />,
                      a: ({node, ...props}) => <a className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300" {...props} />,
                    }}
                  >
                    {response}
                  </ReactMarkdown>
                </div>
              ) : (
                <ResponseVisualization data={responseData} />
              )}
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

// Response Visualization Component
const ResponseVisualization: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return null;

  switch (data.type) {
    case 'shipments':
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">Shipment Status Overview</h4>
            <span className="text-2xl font-bold text-blue-400">{data.total}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.data.map((item: any, index: number) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${item.color} rounded-full mx-auto mb-2 flex items-center justify-center`}>
                  <Package className="h-8 w-8 text-white" />
                </div>
                <div className="text-2xl font-bold">{item.count}</div>
                <div className="text-sm text-white/70">{item.status}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'disruptions':
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">Active Disruptions</h4>
            <span className="text-2xl font-bold text-red-400">{data.total}</span>
          </div>
          <div className="space-y-3">
            {data.data.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                  <span className="font-medium">{item.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                    item.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {item.severity}
                  </span>
                  <span className="text-sm text-white/70">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'inventory':
      return (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Inventory Levels</h4>
          <div className="space-y-3">
            {data.data.map((item: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.category}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.status === 'Good' ? 'bg-green-500/20 text-green-400' :
                    item.status === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className={`h-2 ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.level}%` }}
                  ></div>
                </div>
                <div className="text-xs text-white/70">{item.level}%</div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'performance':
      return (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Transportation Performance</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.data.map((item: any, index: number) => {
              const Icon = item.icon;
              return (
                <div key={index} className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Icon className="h-6 w-6 text-blue-400" />
                    <span className="font-medium">{item.mode}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-white/70">On-Time %</span>
                      <span className="font-semibold">{item.onTime}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${item.onTime}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-white/70">Cost</span>
                      <span className="font-semibold">${item.cost}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );

    default:
      return null;
  }
};
