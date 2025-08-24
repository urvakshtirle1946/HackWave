import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock, Plus, X } from 'lucide-react';
import { simulationAPI } from '../services/api';

interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'completed' | 'queued' | 'paused' | 'failed';
  progress: number;
  duration: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  costImpact: string;
  completion: string;
  scenarioType: string;
  scenarioParams?: any;
  result?: any;
}

interface SimulationResult {
  metrics: Array<{
    name: string;
    current: number;
    simulated: number;
    change: number;
  }>;
  recommendations: Array<{
    id: number;
    type: 'warning' | 'info' | 'success';
    message: string;
    impact: string;
  }>;
}

const defaultScenarios = [
  {
    id: 'port-closure',
    name: 'Port Closure Simulation',
    description: 'Simulate major port closure impact on supply chain',
    scenarioType: 'port_closure',
    scenarioParams: {
      portName: 'Port of Singapore',
      closureDuration: 48,
      reason: 'Technical Issues'
    }
  },
  {
    id: 'weather-event',
    name: 'Weather Event Simulation',
    description: 'Simulate severe weather impact on transportation',
    scenarioType: 'weather_event',
    scenarioParams: {
      eventType: 'Tropical Storm',
      location: 'Singapore',
      duration: 24
    }
  },
  {
    id: 'geopolitical-crisis',
    name: 'Geopolitical Crisis Simulation',
    description: 'Simulate trade tensions and route disruptions',
    scenarioType: 'geopolitical_crisis',
    scenarioParams: {
      crisisType: 'Trade Tensions',
      region: 'Asia-Pacific',
      duration: 72
    }
  },
  {
    id: 'demand-surge',
    name: 'Demand Surge Simulation',
    description: 'Test capacity during peak demand periods',
    scenarioType: 'demand_surge',
    scenarioParams: {
      demandIncrease: 50,
      duration: 30
    }
  }
];

export default function Simulation() {
  const [scenarios, setScenarios] = useState<SimulationScenario[]>([]);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewScenarioModal, setShowNewScenarioModal] = useState(false);
  const [newScenario, setNewScenario] = useState({
    name: '',
    description: '',
    scenarioType: '',
    scenarioParams: {}
  });

  // Initialize with default scenarios
  useEffect(() => {
    const initialScenarios = defaultScenarios.map(scenario => ({
      ...scenario,
      status: 'queued' as const,
      progress: 0,
      duration: '0h 0m',
      riskLevel: 'Medium' as const,
      costImpact: '$0',
      completion: '0%'
    }));
    setScenarios(initialScenarios);
  }, []);

  const runSimulation = async (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    try {
      setLoading(true);
      setError(null);
      
      // Update scenario status to running
      setScenarios(prev => prev.map(s => 
        s.id === scenarioId 
          ? { ...s, status: 'running', progress: 0, completion: '0%' }
          : s
      ));

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setScenarios(prev => prev.map(s => {
          if (s.id === scenarioId && s.status === 'running' && s.progress < 90) {
            return { ...s, progress: s.progress + Math.random() * 10, completion: `${Math.min(s.progress + 10, 90)}%` };
          }
          return s;
        }));
      }, 1000);

      // Call the AI agent simulation API
      const result = await simulationAPI.runScenario(scenario.scenarioType, scenario.scenarioParams);
      
      clearInterval(progressInterval);

      // Update scenario with results
      setScenarios(prev => prev.map(s => 
        s.id === scenarioId 
          ? { 
              ...s, 
              status: 'completed', 
              progress: 100, 
              completion: '100%',
              result: result.data,
              duration: `${Math.floor(Math.random() * 3) + 1}h ${Math.floor(Math.random() * 60)}m`,
              costImpact: `$${(Math.random() * 3 + 0.5).toFixed(1)}M`
            }
          : s
      ));

      setActiveScenario(null);
    } catch (err) {
      console.error('Simulation error:', err);
      setError('Failed to run simulation');
      
      setScenarios(prev => prev.map(s => 
        s.id === scenarioId 
          ? { ...s, status: 'failed', progress: 0, completion: '0%' }
          : s
      ));
    } finally {
      setLoading(false);
    }
  };

  const pauseSimulation = (scenarioId: string) => {
    setScenarios(prev => prev.map(s => 
      s.id === scenarioId 
        ? { ...s, status: 'paused' }
        : s
    ));
  };

  const resumeSimulation = (scenarioId: string) => {
    setScenarios(prev => prev.map(s => 
      s.id === scenarioId 
        ? { ...s, status: 'running' }
        : s
    ));
  };

  const stopSimulation = (scenarioId: string) => {
    setScenarios(prev => prev.map(s => 
      s.id === scenarioId 
        ? { ...s, status: 'queued', progress: 0, completion: '0%' }
        : s
    ));
  };

  const resetAllSimulations = () => {
    setScenarios(prev => prev.map(s => ({
      ...s,
      status: 'queued',
      progress: 0,
      completion: '0%',
      result: undefined
    })));
  };

  const addNewScenario = () => {
    if (!newScenario.name || !newScenario.description || !newScenario.scenarioType) {
      setError('Please fill in all required fields');
      return;
    }

    const scenario: SimulationScenario = {
      id: `custom-${Date.now()}`,
      name: newScenario.name,
      description: newScenario.description,
      scenarioType: newScenario.scenarioType,
      scenarioParams: newScenario.scenarioParams,
      status: 'queued',
      progress: 0,
      duration: '0h 0m',
      riskLevel: 'Medium',
      costImpact: '$0',
      completion: '0%'
    };

    setScenarios(prev => [...prev, scenario]);
    setShowNewScenarioModal(false);
    setNewScenario({ name: '', description: '', scenarioType: '', scenarioParams: {} });
    setError(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-blue-400';
      case 'completed': return 'text-green-400';
      case 'queued': return 'text-yellow-400';
      case 'paused': return 'text-orange-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return Play;
      case 'completed': return CheckCircle;
      case 'queued': return Clock;
      case 'paused': return Pause;
      case 'failed': return AlertTriangle;
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

  const completedScenarios = scenarios.filter(s => s.status === 'completed' && s.result);
  const latestResult = completedScenarios[completedScenarios.length - 1]?.result;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Supply Chain Simulation</h1>
          <p className="text-white/70">Test scenarios and optimize your supply chain performance</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowNewScenarioModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Scenario</span>
          </button>
          <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

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
          {scenarios.map((scenario) => {
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
                      className={`h-2 rounded-full transition-all duration-300 ${
                        scenario.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'
                      }`}
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
                      <button 
                        onClick={() => pauseSimulation(scenario.id)}
                        className="flex-1 px-2 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors"
                      >
                        Pause
                      </button>
                      <button 
                        onClick={() => stopSimulation(scenario.id)}
                        className="flex-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                      >
                        Stop
                      </button>
                    </>
                  )}
                  {scenario.status === 'paused' && (
                    <button 
                      onClick={() => resumeSimulation(scenario.id)}
                      className="w-full px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                      Resume
                    </button>
                  )}
                  {scenario.status === 'queued' && (
                    <button 
                      onClick={() => runSimulation(scenario.id)}
                      disabled={loading}
                      className="w-full px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Starting...' : 'Start'}
                    </button>
                  )}
                  {scenario.status === 'failed' && (
                    <button 
                      onClick={() => runSimulation(scenario.id)}
                      className="w-full px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                    >
                      Retry
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
        {latestResult && (
          <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
            <h3 className="text-lg font-semibold text-white mb-4">Latest Simulation Results</h3>
            <div className="space-y-4">
              {latestResult.summary && (
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-sm font-medium text-white mb-2">Scenario Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">Scenario:</span>
                      <span className="text-white">{latestResult.summary.scenarioName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Affected Shipments:</span>
                      <span className="text-white">{latestResult.summary.affectedShipments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Total Delay:</span>
                      <span className="text-white">{latestResult.summary.totalDelay} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Cost Increase:</span>
                      <span className="text-white">${latestResult.summary.totalCostIncrease?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Risk Level:</span>
                      <span className={getRiskColor(latestResult.summary.riskLevel)}>{latestResult.summary.riskLevel}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {latestResult.recommendations && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-white">Recommendations</h4>
                  {latestResult.recommendations.map((rec: any, index: number) => (
                    <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-sm text-white">{rec.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Simulation Controls */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Simulation Controls</h3>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => {
                const queuedScenarios = scenarios.filter(s => s.status === 'queued');
                queuedScenarios.forEach(s => runSimulation(s.id));
              }}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              <span>Run All</span>
            </button>
            <button 
              onClick={() => {
                const runningScenarios = scenarios.filter(s => s.status === 'running');
                runningScenarios.forEach(s => pauseSimulation(s.id));
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
            >
              <Pause className="h-4 w-4" />
              <span>Pause All</span>
            </button>
            <button 
              onClick={resetAllSimulations}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
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

      {/* New Scenario Modal */}
      {showNewScenarioModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Create New Scenario</h3>
              <button 
                onClick={() => setShowNewScenarioModal(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Scenario Name</label>
                <input
                  type="text"
                  value={newScenario.name}
                  onChange={(e) => setNewScenario({...newScenario, name: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter scenario name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
                <textarea
                  value={newScenario.description}
                  onChange={(e) => setNewScenario({...newScenario, description: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  rows={3}
                  placeholder="Describe the scenario"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Scenario Type</label>
                <select
                  value={newScenario.scenarioType}
                  onChange={(e) => setNewScenario({...newScenario, scenarioType: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Scenario Type</option>
                  <option value="port_closure">Port Closure</option>
                  <option value="weather_event">Weather Event</option>
                  <option value="geopolitical_crisis">Geopolitical Crisis</option>
                  <option value="demand_surge">Demand Surge</option>
                  <option value="custom">Custom Scenario</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewScenarioModal(false)}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addNewScenario}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Scenario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
