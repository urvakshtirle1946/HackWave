import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Settings, BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const simulationScenarios = [
  {
    id: 1,
    name: 'Supply Chain Disruption',
    description: 'Simulate major supplier failure impact',
    status: 'running',
    progress: 75,
    duration: '2h 15m',
    riskLevel: 'High',
    costImpact: '$2.1M',
    completion: '85%'
  },
  {
    id: 2,
    name: 'Demand Surge',
    description: 'Test capacity during peak demand',
    status: 'completed',
    progress: 100,
    duration: '1h 45m',
    riskLevel: 'Medium',
    costImpact: '$850K',
    completion: '100%'
  },
  {
    id: 3,
    name: 'Transportation Optimization',
    description: 'Optimize routes and reduce costs',
    status: 'queued',
    progress: 0,
    duration: '3h 30m',
    riskLevel: 'Low',
    costImpact: '$1.2M',
    completion: '0%'
  },
  {
    id: 4,
    name: 'Inventory Rebalancing',
    description: 'Balance inventory across locations',
    status: 'paused',
    progress: 45,
    duration: '1h 20m',
    riskLevel: 'Medium',
    costImpact: '$650K',
    completion: '45%'
  }
];

const simulationResults = {
  metrics: [
    { name: 'Service Level', current: 94.2, simulated: 91.8, change: -2.4 },
    { name: 'Lead Time', current: 12.5, simulated: 15.2, change: +2.7 },
    { name: 'Inventory Cost', current: 2.1, simulated: 2.8, change: +0.7 },
    { name: 'Transportation Cost', current: 1.8, simulated: 1.5, change: -0.3 }
  ],
  recommendations: [
    { id: 1, type: 'warning', message: 'Increase safety stock by 15% to maintain service levels', impact: 'High' },
    { id: 2, type: 'info', message: 'Consider alternative suppliers in Asia-Pacific region', impact: 'Medium' },
    { id: 3, type: 'success', message: 'Optimize transportation routes could save $300K annually', impact: 'High' }
  ]
};

export default function Simulation() {
  const [activeScenario, setActiveScenario] = useState<number | null>(1);
  const [isSimulating, setIsSimulating] = useState(true);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-blue-400';
      case 'completed': return 'text-green-400';
      case 'queued': return 'text-yellow-400';
      case 'paused': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return Play;
      case 'completed': return CheckCircle;
      case 'queued': return Clock;
      case 'paused': return Pause;
      default: return Clock;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Supply Chain Simulation</h1>
          <p className="text-white/70">Test scenarios and optimize your supply chain performance</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Play className="h-4 w-4" />
            <span>New Simulation</span>
          </button>
          <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Simulation Status */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Active Simulations</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isSimulating ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-sm text-white/70">
              {isSimulating ? 'Simulation Engine Active' : 'Simulation Engine Idle'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {simulationScenarios.map((scenario) => {
            const StatusIcon = getStatusIcon(scenario.status);
            return (
              <div key={scenario.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-white">{scenario.name}</h4>
                  <StatusIcon className={`h-4 w-4 ${getStatusColor(scenario.status)}`} />
                </div>
                
                <p className="text-xs text-white/70 mb-3">{scenario.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70">Progress:</span>
                    <span className="text-white">{scenario.completion}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${scenario.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70">Duration:</span>
                    <span className="text-white">{scenario.duration}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70">Risk:</span>
                    <span className={getRiskColor(scenario.riskLevel)}>{scenario.riskLevel}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70">Cost Impact:</span>
                    <span className="text-white">{scenario.costImpact}</span>
                  </div>
                </div>
                
                <div className="mt-3 flex space-x-2">
                  {scenario.status === 'running' && (
                    <>
                      <button className="flex-1 px-2 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors">
                        Pause
                      </button>
                      <button className="flex-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
                        Stop
                      </button>
                    </>
                  )}
                  {scenario.status === 'paused' && (
                    <button className="w-full px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                      Resume
                    </button>
                  )}
                  {scenario.status === 'queued' && (
                    <button className="w-full px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
                      Start
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulation Results */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Simulation Results</h3>
          <div className="space-y-4">
            {simulationResults.metrics.map((metric) => (
              <div key={metric.name} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-white">{metric.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-white/70">Current: {metric.current}</span>
                    <span className="text-sm text-white/70">→</span>
                    <span className="text-sm text-white">Simulated: {metric.simulated}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {metric.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-red-400" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-green-400 transform rotate-180" />
                  )}
                  <span className={`text-sm ${metric.change > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">AI Recommendations</h3>
          <div className="space-y-4">
            {simulationResults.recommendations.map((rec) => (
              <div key={rec.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start space-x-3">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    rec.type === 'warning' ? 'bg-yellow-500' :
                    rec.type === 'info' ? 'bg-blue-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-white">{rec.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-white/70">Impact: {rec.impact}</span>
                      <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simulation Controls */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
        <h3 className="text-lg font-semibold text-white mb-4">Simulation Controls</h3>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Play className="h-4 w-4" />
            <span>Run All</span>
          </button>
          <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2">
            <Pause className="h-4 w-4" />
            <span>Pause All</span>
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
            <RotateCcw className="h-4 w-4" />
            <span>Reset All</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Export Results</span>
          </button>
        </div>
      </div>
    </div>
  );
}
