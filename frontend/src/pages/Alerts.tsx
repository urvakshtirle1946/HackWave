import React, { useState } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, X, Settings } from 'lucide-react';

const alerts = [
  {
    id: 1,
    type: 'critical',
    title: 'Critical Supply Chain Disruption',
    message: 'Major container ship blockage in Suez Canal affecting 15% of global trade',
    timestamp: '2024-01-22 09:15:00',
    source: 'Logistics Intelligence',
    acknowledged: false,
    actions: ['Activate Backup Routes', 'Contact Alternative Suppliers', 'Update Timeline']
  },
  {
    id: 2,
    type: 'warning',
    title: 'Supplier Performance Alert',
    message: 'Global Manufacturing Corp delivery performance dropped below 90%',
    timestamp: '2024-01-22 08:30:00',
    source: 'Performance Monitor',
    acknowledged: false,
    actions: ['Schedule Review Meeting', 'Request Action Plan', 'Assess Alternatives']
  },
  {
    id: 3,
    type: 'info',
    title: 'Weather Advisory',
    message: 'Severe weather expected in Hamburg port area, minor delays possible',
    timestamp: '2024-01-22 07:45:00',
    source: 'Weather Intelligence',
    acknowledged: true,
    actions: ['Monitor Situation', 'Notify Stakeholders']
  },
  {
    id: 4,
    type: 'success',
    title: 'Risk Mitigation Successful',
    message: 'Alternative shipping route activated successfully, delays minimized',
    timestamp: '2024-01-22 06:20:00',
    source: 'Risk Management',
    acknowledged: true,
    actions: ['Document Lessons Learned', 'Update Procedures']
  },
  {
    id: 5,
    type: 'critical',
    title: 'Geopolitical Risk Escalation',
    message: 'Trade tensions affecting key supplier regions, immediate assessment required',
    timestamp: '2024-01-22 05:15:00',
    source: 'Geopolitical Monitor',
    acknowledged: false,
    actions: ['Risk Assessment', 'Supplier Diversification', 'Legal Review']
  }
];

const alertRules = [
  { name: 'Delivery Performance', threshold: '< 90%', enabled: true, priority: 'high' },
  { name: 'Cost Variance', threshold: '> 15%', enabled: true, priority: 'medium' },
  { name: 'Risk Score Change', threshold: '> 2 points', enabled: true, priority: 'high' },
  { name: 'Weather Disruption', threshold: 'Category 3+', enabled: true, priority: 'medium' },
  { name: 'Geopolitical Events', threshold: 'Any', enabled: true, priority: 'critical' },
];

export default function Alerts() {
  const [filter, setFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'info': return <Info className="h-5 w-5 text-blue-400" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-400" />;
      default: return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const getAlertColor = (type: string, acknowledged: boolean) => {
    const opacity = acknowledged ? '/20' : '/10';
    switch (type) {
      case 'critical': return `border-red-500 bg-red-500${opacity}`;
      case 'warning': return `border-yellow-500 bg-yellow-500${opacity}`;
      case 'info': return `border-blue-500 bg-blue-500${opacity}`;
      case 'success': return `border-green-500 bg-green-500${opacity}`;
      default: return `border-gray-500 bg-gray-500${opacity}`;
    }
  };

  const filteredAlerts = filter === 'all' ? alerts : alerts.filter(alert => alert.type === filter);
  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged).length;

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Alerts</p>
              <p className="text-2xl font-bold text-white">{alerts.length}</p>
            </div>
            <Bell className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Unacknowledged</p>
              <p className="text-2xl font-bold text-red-400">{unacknowledgedCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Critical</p>
              <p className="text-2xl font-bold text-red-400">
                {alerts.filter(a => a.type === 'critical').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Resolved Today</p>
              <p className="text-2xl font-bold text-green-400">
                {alerts.filter(a => a.type === 'success').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Alert Controls */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Alert Management</h3>
          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all">All Alerts</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
            </select>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white text-sm"
            >
              <Settings size={16} className="mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Alert Rules Settings */}
        {showSettings && (
          <div className="mb-6 p-4 bg-slate-700 rounded-lg">
            <h4 className="text-white font-medium mb-4">Alert Rules Configuration</h4>
            <div className="space-y-3">
              {alertRules.map((rule, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        className="rounded"
                      />
                      <span className="text-white">{rule.name}</span>
                      <span className="text-gray-400 text-sm">{rule.threshold}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${rule.priority === 'critical' ? 'text-red-400 bg-red-400/10' :
                    rule.priority === 'high' ? 'text-orange-400 bg-orange-400/10' :
                      'text-yellow-400 bg-yellow-400/10'
                    }`}>
                    {rule.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alert List */}
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 ${getAlertColor(alert.type, alert.acknowledged)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-white font-medium">{alert.title}</h4>
                      {!alert.acknowledged && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{alert.message}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span>{alert.timestamp}</span>
                      <span>•</span>
                      <span>{alert.source}</span>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {alert.actions.map((action, index) => (
                        <button
                          key={index}
                          className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded-lg text-white text-xs"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!alert.acknowledged && (
                    <button className="p-1 text-green-400 hover:text-green-300">
                      <CheckCircle size={20} />
                    </button>
                  )}
                  <button className="p-1 text-gray-400 hover:text-gray-300">
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Analytics */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Alert Analytics</h3>
        <div className="h-48 bg-slate-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Bell className="h-10 w-10 text-blue-400 mx-auto mb-3" />
            <p className="text-gray-400">Alert Frequency & Response Metrics</p>
            <p className="text-sm text-gray-500">Visual analysis of alert patterns and response times</p>
          </div>
        </div>
      </div>
    </div>
  );
}