import React, { useState } from 'react';
import { Server, Database, Network, Shield, Activity, AlertTriangle, CheckCircle, Clock, Settings, RefreshCw } from 'lucide-react';

const infrastructureData = {
  systems: [
    {
      id: 1,
      name: 'ERP System',
      type: 'Database',
      status: 'healthy',
      uptime: '99.98%',
      responseTime: '45ms',
      lastUpdate: '2 minutes ago',
      alerts: 0,
      performance: 95
    },
    {
      id: 2,
      name: 'WMS Platform',
      type: 'Application',
      status: 'warning',
      uptime: '99.85%',
      responseTime: '120ms',
      lastUpdate: '5 minutes ago',
      alerts: 2,
      performance: 78
    },
    {
      id: 3,
      name: 'TMS Integration',
      type: 'API',
      status: 'healthy',
      uptime: '99.99%',
      responseTime: '32ms',
      lastUpdate: '1 minute ago',
      alerts: 0,
      performance: 98
    },
    {
      id: 4,
      name: 'Analytics Engine',
      type: 'Processing',
      status: 'critical',
      uptime: '98.5%',
      responseTime: '450ms',
      lastUpdate: '15 minutes ago',
      alerts: 5,
      performance: 45
    },
    {
      id: 5,
      name: 'Security Gateway',
      type: 'Network',
      status: 'healthy',
      uptime: '99.99%',
      responseTime: '12ms',
      lastUpdate: '30 seconds ago',
      alerts: 0,
      performance: 99
    },
    {
      id: 6,
      name: 'Data Warehouse',
      type: 'Database',
      status: 'warning',
      uptime: '99.92%',
      responseTime: '180ms',
      lastUpdate: '3 minutes ago',
      alerts: 1,
      performance: 82
    }
  ],
  metrics: {
    overallHealth: 87,
    totalSystems: 6,
    healthySystems: 3,
    warningSystems: 2,
    criticalSystems: 1,
    averageResponseTime: '138ms',
    totalUptime: '99.88%'
  },
  recentEvents: [
    { id: 1, type: 'warning', message: 'WMS Platform experiencing high latency', time: '5 minutes ago', system: 'WMS Platform' },
    { id: 2, type: 'critical', message: 'Analytics Engine service unavailable', time: '15 minutes ago', system: 'Analytics Engine' },
    { id: 3, type: 'info', message: 'Scheduled maintenance completed', time: '1 hour ago', system: 'All Systems' },
    { id: 4, type: 'success', message: 'Security patches applied successfully', time: '2 hours ago', system: 'Security Gateway' }
  ]
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy': return 'text-green-400';
    case 'warning': return 'text-yellow-400';
    case 'critical': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy': return CheckCircle;
    case 'warning': return AlertTriangle;
    case 'critical': return AlertTriangle;
    default: return Clock;
  }
};

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'database': return Database;
    case 'application': return Server;
    case 'api': return Network;
    case 'processing': return Activity;
    case 'network': return Shield;
    default: return Server;
  }
};

const getPerformanceColor = (performance: number) => {
  if (performance >= 90) return 'text-green-400';
  if (performance >= 70) return 'text-yellow-400';
  return 'text-red-400';
};

export default function Infrastructure() {
  const [selectedSystem, setSelectedSystem] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Infrastructure Management</h1>
          <p className="text-white/70">Monitor and manage your supply chain infrastructure systems</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Overall Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Overall Health</p>
              <p className="text-2xl font-bold text-white">{infrastructureData.metrics.overallHealth}%</p>
              <p className="text-sm text-green-400">Good</p>
            </div>
            <div className="p-3 rounded-full bg-green-600/20">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Systems</p>
              <p className="text-2xl font-bold text-white">{infrastructureData.metrics.totalSystems}</p>
              <p className="text-sm text-white/70">Active</p>
            </div>
            <div className="p-3 rounded-full bg-blue-600/20">
              <Server className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Avg Response Time</p>
              <p className="text-2xl font-bold text-white">{infrastructureData.metrics.averageResponseTime}</p>
              <p className="text-sm text-green-400">Optimal</p>
            </div>
            <div className="p-3 rounded-full bg-purple-600/20">
              <Activity className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Uptime</p>
              <p className="text-2xl font-bold text-white">{infrastructureData.metrics.totalUptime}</p>
              <p className="text-sm text-green-400">This month</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-600/20">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
          <div className="space-y-4">
            {infrastructureData.systems.map((system) => {
              const StatusIcon = getStatusIcon(system.status);
              const TypeIcon = getTypeIcon(system.type);
              return (
                <div 
                  key={system.id} 
                  className={`bg-white/5 rounded-lg p-4 border border-white/10 cursor-pointer transition-all hover:bg-white/10 ${
                    selectedSystem === system.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedSystem(system.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-blue-600/20">
                        <TypeIcon className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{system.name}</p>
                        <p className="text-xs text-white/70">{system.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusIcon className={`h-4 w-4 ${getStatusColor(system.status)}`} />
                      {system.alerts > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {system.alerts}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-white/70">Uptime:</span>
                      <span className="text-white ml-1">{system.uptime}</span>
                    </div>
                    <div>
                      <span className="text-white/70">Response:</span>
                      <span className="text-white ml-1">{system.responseTime}</span>
                    </div>
                    <div>
                      <span className="text-white/70">Performance:</span>
                      <span className={`ml-1 ${getPerformanceColor(system.performance)}`}>
                        {system.performance}%
                      </span>
                    </div>
                    <div>
                      <span className="text-white/70">Updated:</span>
                      <span className="text-white ml-1">{system.lastUpdate}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-white/70 mb-1">
                      <span>Performance</span>
                      <span>{system.performance}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          system.performance >= 90 ? 'bg-green-500' :
                          system.performance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${system.performance}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Events</h3>
          <div className="space-y-4">
            {infrastructureData.recentEvents.map((event) => (
              <div key={event.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start space-x-3">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    event.type === 'critical' ? 'bg-red-500' :
                    event.type === 'warning' ? 'bg-yellow-500' :
                    event.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-white">{event.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-white/70">{event.system}</span>
                      <span className="text-xs text-white/50">{event.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health Summary */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
        <h3 className="text-lg font-semibold text-white mb-4">System Health Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{infrastructureData.metrics.healthySystems}</div>
            <p className="text-sm text-white/70">Healthy Systems</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{infrastructureData.metrics.warningSystems}</div>
            <p className="text-sm text-white/70">Warning Systems</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">{infrastructureData.metrics.criticalSystems}</div>
            <p className="text-sm text-white/70">Critical Systems</p>
          </div>
        </div>
      </div>
    </div>
  );
}
