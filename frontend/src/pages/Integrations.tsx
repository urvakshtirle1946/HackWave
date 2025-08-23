import React, { useState } from 'react';
import { Plug, CheckCircle, AlertCircle, Settings, Plus } from 'lucide-react';

const integrations = [
  {
    id: 1,
    name: 'SAP ERP',
    category: 'ERP System',
    description: 'Enterprise resource planning integration for real-time data synchronization',
    status: 'connected',
    lastSync: '2024-01-22 10:30:00',
    dataPoints: 15420,
    health: 98,
    icon: '🏢'
  },
  {
    id: 2,
    name: 'Salesforce CRM',
    category: 'Customer Management',
    description: 'Customer relationship management for supply chain visibility',
    status: 'connected',
    lastSync: '2024-01-22 10:25:00',
    dataPoints: 8750,
    health: 95,
    icon: '☁️'
  },
  {
    id: 3,
    name: 'Microsoft Power BI',
    category: 'Analytics',
    description: 'Business intelligence and advanced analytics platform',
    status: 'warning',
    lastSync: '2024-01-22 08:15:00',
    dataPoints: 12300,
    health: 78,
    icon: '📊'
  },
  {
    id: 4,
    name: 'Amazon Web Services',
    category: 'Cloud Infrastructure',
    description: 'Cloud computing services and data storage integration',
    status: 'connected',
    lastSync: '2024-01-22 10:35:00',
    dataPoints: 45200,
    health: 99,
    icon: '☁️'
  },
  {
    id: 5,
    name: 'Slack',
    category: 'Communication',
    description: 'Team communication and alert notifications',
    status: 'error',
    lastSync: '2024-01-22 06:20:00',
    dataPoints: 0,
    health: 0,
    icon: '💬'
  },
  {
    id: 6,
    name: 'Weather API',
    category: 'External Data',
    description: 'Global weather data for supply chain risk assessment',
    status: 'connected',
    lastSync: '2024-01-22 10:40:00',
    dataPoints: 2840,
    health: 92,
    icon: '🌤️'
  }
];

const availableIntegrations = [
  { name: 'Oracle SCM', category: 'Supply Chain', description: 'Supply chain management platform' },
  { name: 'Microsoft Dynamics', category: 'ERP System', description: 'Business applications suite' },
  { name: 'Tableau', category: 'Analytics', description: 'Data visualization platform' },
  { name: 'MongoDB', category: 'Database', description: 'NoSQL database integration' },
  { name: 'Stripe', category: 'Payments', description: 'Payment processing integration' },
  { name: 'Google Analytics', category: 'Analytics', description: 'Web analytics service' }
];

const webhookEndpoints = [
  { name: 'Supply Chain Events', url: '/webhooks/supply-chain', method: 'POST', status: 'active' },
  { name: 'Risk Alerts', url: '/webhooks/risk-alerts', method: 'POST', status: 'active' },
  { name: 'Supplier Updates', url: '/webhooks/suppliers', method: 'POST', status: 'inactive' },
  { name: 'Cost Changes', url: '/webhooks/costs', method: 'POST', status: 'active' }
];

export default function Integrations() {
  const [selectedIntegration, setSelectedIntegration] = useState<number | null>(null);
  const [showAvailable, setShowAvailable] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400 bg-green-400/10';
      case 'warning': return 'text-yellow-400 bg-yellow-400/10';
      case 'error': return 'text-red-400 bg-red-400/10';
      case 'disconnected': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-400" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-400" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'text-green-400';
    if (health >= 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const totalDataPoints = integrations.reduce((sum, i) => sum + i.dataPoints, 0);

  return (
    <div className="space-y-6">
      {/* Integration Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Connected</p>
              <p className="text-2xl font-bold text-green-400">{connectedCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Systems</p>
              <p className="text-2xl font-bold text-white">{integrations.length}</p>
            </div>
            <Plug className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Data Points</p>
              <p className="text-2xl font-bold text-white">{totalDataPoints.toLocaleString()}</p>
            </div>
            <Settings className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Avg Health</p>
              <p className="text-2xl font-bold text-green-400">
                {Math.round(integrations.reduce((sum, i) => sum + i.health, 0) / integrations.length)}%
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Integration Management */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Active Integrations</h3>
          <button
            onClick={() => setShowAvailable(!showAvailable)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm"
          >
            <Plus size={16} className="mr-2" />
            Add Integration
          </button>
        </div>

        {/* Available Integrations */}
        {showAvailable && (
          <div className="mb-6 p-4 bg-slate-700 rounded-lg">
            <h4 className="text-white font-medium mb-4">Available Integrations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableIntegrations.map((integration, index) => (
                <div key={index} className="bg-slate-600 rounded-lg p-3 hover:bg-slate-500 cursor-pointer">
                  <h5 className="text-white font-medium mb-1">{integration.name}</h5>
                  <p className="text-xs text-blue-400 mb-2">{integration.category}</p>
                  <p className="text-xs text-gray-400">{integration.description}</p>
                  <button className="mt-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integration List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              onClick={() => setSelectedIntegration(
                selectedIntegration === integration.id ? null : integration.id
              )}
              className={`bg-slate-700 rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-600 ${selectedIntegration === integration.id ? 'ring-2 ring-blue-500' : ''
                }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{integration.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">{integration.name}</h4>
                    <p className="text-sm text-blue-400 mb-2">{integration.category}</p>
                    <p className="text-sm text-gray-400">{integration.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(integration.status)}
                  <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(integration.status)}`}>
                    {integration.status}
                  </span>
                </div>
              </div>

              {selectedIntegration === integration.id && (
                <div className="mt-4 pt-4 border-t border-slate-600 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Last Sync</p>
                      <p className="text-sm text-white">{integration.lastSync}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Data Points</p>
                      <p className="text-sm text-white">{integration.dataPoints.toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-2">System Health</p>
                    <div className="flex items-center">
                      <span className={`text-sm font-medium mr-3 ${getHealthColor(integration.health)}`}>
                        {integration.health}%
                      </span>
                      <div className="flex-1 bg-slate-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${integration.health >= 95 ? 'bg-green-500' :
                            integration.health >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${integration.health}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-xs">
                      Configure
                    </button>
                    <button className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-lg text-white text-xs">
                      Test Connection
                    </button>
                    <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-white text-xs">
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* API & Webhooks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Keys */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">API Management</h3>
          <div className="space-y-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">Production API Key</h4>
                <span className="text-green-400 text-sm">Active</span>
              </div>
              <div className="flex items-center space-x-3">
                <code className="flex-1 bg-slate-600 px-3 py-2 rounded text-gray-300 text-sm font-mono">
                  sk_prod_1234567890abcdef...
                </code>
                <button className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-white text-xs">
                  Copy
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Last used: 2 minutes ago</p>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">Development API Key</h4>
                <span className="text-yellow-400 text-sm">Limited</span>
              </div>
              <div className="flex items-center space-x-3">
                <code className="flex-1 bg-slate-600 px-3 py-2 rounded text-gray-300 text-sm font-mono">
                  sk_dev_abcdef1234567890...
                </code>
                <button className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-white text-xs">
                  Copy
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Rate limit: 1000 requests/hour</p>
            </div>

            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm">
              Generate New API Key
            </button>
          </div>
        </div>

        {/* Webhooks */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Webhook Endpoints</h3>
          <div className="space-y-3">
            {webhookEndpoints.map((webhook, index) => (
              <div key={index} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{webhook.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${webhook.status === 'active'
                    ? 'text-green-400 bg-green-400/10'
                    : 'text-gray-400 bg-gray-400/10'
                    }`}>
                    {webhook.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-blue-600 rounded text-white text-xs font-mono">
                    {webhook.method}
                  </span>
                  <code className="text-gray-300 text-sm font-mono">{webhook.url}</code>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <button className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-white text-xs">
                    Test
                  </button>
                  <button className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-white text-xs">
                    Logs
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm">
            Add Webhook
          </button>
        </div>
      </div>

      {/* Integration Health Monitor */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">System Health Monitor</h3>
        <div className="h-48 bg-slate-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Plug className="h-10 w-10 text-blue-400 mx-auto mb-3" />
            <p className="text-gray-400">Integration Performance Dashboard</p>
            <p className="text-sm text-gray-500">Real-time monitoring of all connected systems</p>
          </div>
        </div>
      </div>
    </div>
  );
}