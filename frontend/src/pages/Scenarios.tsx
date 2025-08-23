import React, { useState } from 'react';
import { Play, Settings, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';

const scenarios = [
  {
    id: 1,
    name: 'Suez Canal Blockage',
    type: 'Logistics Disruption',
    description: 'Simulates a 7-day canal closure and its impact on Asia-Europe trade routes',
    status: 'ready',
    impact: { cost: '+$2.4M', delay: '14 days', risk: 'High' },
    probability: 15,
    lastRun: '2024-01-15'
  },
  {
    id: 2,
    name: 'Semiconductor Shortage',
    type: 'Supply Shortage',
    description: 'Models impact of critical component shortage on production timeline',
    status: 'running',
    impact: { cost: '+$1.8M', delay: '28 days', risk: 'Critical' },
    probability: 35,
    lastRun: 'Running now'
  },
  {
    id: 3,
    name: 'Port Strike - LA/Long Beach',
    type: 'Labor Disruption',
    description: 'Analyzes effects of potential dock worker strikes on West Coast operations',
    status: 'completed',
    impact: { cost: '+$890K', delay: '10 days', risk: 'Medium' },
    probability: 25,
    lastRun: '2024-01-20'
  },
  {
    id: 4,
    name: 'Natural Disaster - Southeast Asia',
    type: 'Environmental Risk',
    description: 'Tsunami/typhoon impact on key manufacturing hubs in the region',
    status: 'ready',
    impact: { cost: '+$3.2M', delay: '21 days', risk: 'Critical' },
    probability: 8,
    lastRun: '2024-01-10'
  }
];

const simulationResults = {
  timeline: [
    { day: 1, impact: 'Initial disruption detected', severity: 'low' },
    { day: 3, impact: 'Supply chain bottlenecks forming', severity: 'medium' },
    { day: 7, impact: 'Critical shortages in key markets', severity: 'high' },
    { day: 14, impact: 'Alternative routes activated', severity: 'medium' },
    { day: 21, impact: 'Full recovery achieved', severity: 'low' }
  ],
  recommendations: [
    'Activate backup suppliers in Europe and Americas',
    'Implement air freight for critical components',
    'Increase safety stock levels by 30%',
    'Negotiate expedited shipping contracts'
  ]
};

export default function Scenarios() {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(1);
  const [isRunning, setIsRunning] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-blue-400 bg-blue-400/10';
      case 'running': return 'text-yellow-400 bg-yellow-400/10';
      case 'completed': return 'text-green-400 bg-green-400/10';
      case 'error': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'High': return 'text-orange-400';
      case 'Critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Scenario Controls */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Scenario Planning & Simulation</h3>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm">
              <Play size={16} className="mr-2" />
              Run Simulation
            </button>
            <button className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white text-sm">
              <Settings size={16} className="mr-2" />
              Configure
            </button>
          </div>
        </div>

        {/* Scenario List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
              className={`bg-slate-700 rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-600 ${selectedScenario === scenario.id ? 'ring-2 ring-blue-500' : ''
                }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1">{scenario.name}</h4>
                  <p className="text-sm text-blue-400 mb-2">{scenario.type}</p>
                  <p className="text-sm text-gray-400 mb-3">{scenario.description}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(scenario.status)}`}>
                  {scenario.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-1">Cost Impact</p>
                  <p className="text-sm font-medium text-red-400">{scenario.impact.cost}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-1">Delay</p>
                  <p className="text-sm font-medium text-yellow-400">{scenario.impact.delay}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-1">Risk Level</p>
                  <p className={`text-sm font-medium ${getRiskColor(scenario.impact.risk)}`}>
                    {scenario.impact.risk}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Probability</p>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-white mr-2">{scenario.probability}%</span>
                    <div className="w-16 bg-slate-600 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${scenario.probability}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Last Run</p>
                  <p className="text-xs text-gray-300">{scenario.lastRun}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulation Results */}
      {selectedScenario && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timeline */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
              Impact Timeline
            </h3>
            <div className="space-y-4">
              {simulationResults.timeline.map((event, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(event.severity)}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">Day {event.day}</span>
                      <span className={`px-2 py-1 rounded-full text-xs capitalize ${event.severity === 'low' ? 'text-green-400 bg-green-400/10' :
                        event.severity === 'medium' ? 'text-yellow-400 bg-yellow-400/10' :
                          'text-red-400 bg-red-400/10'
                        }`}>
                        {event.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{event.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
              AI Recommendations
            </h3>
            <div className="space-y-3">
              {simulationResults.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-slate-700 rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  </div>
                  <p className="text-sm text-gray-300">{rec}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-600">
              <h4 className="text-sm font-medium text-white mb-3">Estimated Savings</h4>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Implementation Cost:</span>
                <span className="text-sm text-red-400">-$650K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Potential Savings:</span>
                <span className="text-sm text-green-400">+$1.8M</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-600">
                <span className="text-sm font-medium text-white">Net Benefit:</span>
                <span className="text-sm font-bold text-green-400">+$1.15M</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monte Carlo Analysis */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Monte Carlo Analysis</h3>
        <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <DollarSign className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <p className="text-gray-400">Statistical Risk Modeling</p>
            <p className="text-sm text-gray-500">10,000 simulation runs with probability distributions</p>
          </div>
        </div>
      </div>
    </div>
  );
}