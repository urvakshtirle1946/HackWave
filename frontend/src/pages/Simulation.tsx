import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  ScatterChart,
  Scatter
} from 'recharts';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Clock,
  DollarSign,
  Package,
  Truck,
  Ship,
  Plane,
  Train,
  CheckCircle,
  AlertTriangle,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';

interface SimulationData {
  name: string;
  value: number;
  [key: string]: any;
}

export default function Simulation() {
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [currentScenario, setCurrentScenario] = useState('baseline');
  const [simulationResults, setSimulationResults] = useState<SimulationData[]>([]);
  const [scenarioComparison, setScenarioComparison] = useState<SimulationData[]>([]);
  const [costAnalysis, setCostAnalysis] = useState<SimulationData[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<SimulationData[]>([]);
  const [optimizationResults, setOptimizationResults] = useState<SimulationData[]>([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    const generateMockSimulationData = () => {
      // Generate simulation results data
      const resultsData = [];
      const now = new Date();
      for (let i = 0; i < 24; i++) {
        const hour = i;
        const baseEfficiency = 75 + Math.random() * 20;
        const baseCost = 1000 + Math.random() * 500;
        
        resultsData.push({
          name: `${hour}:00`,
          efficiency: Math.round(baseEfficiency),
          cost: Math.round(baseCost),
          throughput: Math.round(50 + Math.random() * 30),
          delays: Math.round(Math.random() * 10)
        });
      }
      setSimulationResults(resultsData);

      // Generate scenario comparison data
      const comparisonData = [
        { name: 'Baseline', cost: 100, efficiency: 75, throughput: 100, risk: 50 },
        { name: 'Optimized Routes', cost: 85, efficiency: 88, throughput: 115, risk: 35 },
        { name: 'Multi-modal', cost: 92, efficiency: 82, throughput: 125, risk: 40 },
        { name: 'AI-Powered', cost: 78, efficiency: 92, throughput: 140, risk: 25 },
        { name: 'Green Initiative', cost: 95, efficiency: 78, throughput: 110, risk: 30 }
      ];
      setScenarioComparison(comparisonData);

      // Generate cost analysis data
      const costData = [];
      for (let i = 0; i < 12; i++) {
        const month = i + 1;
        const baseCost = 80000 + Math.random() * 40000;
        
        costData.push({
          name: `Month ${month}`,
          baseline: Math.round(baseCost),
          optimized: Math.round(baseCost * 0.85 + Math.random() * 10000),
          savings: Math.round(baseCost * 0.15 + Math.random() * 5000)
        });
      }
      setCostAnalysis(costData);

      // Generate performance metrics data
      const performanceData = [
        { name: 'On-Time Delivery', baseline: 75, optimized: 92, target: 95 },
        { name: 'Cost per Shipment', baseline: 100, optimized: 78, target: 70 },
        { name: 'Inventory Turnover', baseline: 4, optimized: 6.5, target: 8 },
        { name: 'Order Accuracy', baseline: 88, optimized: 96, target: 99 },
        { name: 'Lead Time', baseline: 100, baseline: 72, target: 60 }
      ];
      setPerformanceMetrics(performanceData);

      // Generate optimization results data
      const optimizationData = [
        { name: 'Route Optimization', current: 100, optimized: 78, savings: 22, roi: 340 },
        { name: 'Inventory Management', current: 100, optimized: 82, savings: 18, roi: 280 },
        { name: 'Supplier Consolidation', current: 100, optimized: 85, savings: 15, roi: 220 },
        { name: 'Automation', current: 100, optimized: 72, savings: 28, roi: 420 },
        { name: 'Predictive Analytics', current: 100, optimized: 88, savings: 12, roi: 180 }
      ];
      setOptimizationResults(optimizationData);

      setLoading(false);
    };

    // Simulate API call delay
    setTimeout(generateMockSimulationData, 1000);
  }, []);

  const handleStartSimulation = () => {
    setIsRunning(true);
    // Simulate simulation running
    setTimeout(() => setIsRunning(false), 5000);
  };

  const handleStopSimulation = () => {
    setIsRunning(false);
  };

  const handleResetSimulation = () => {
    // Reset simulation data
    setIsRunning(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-6 border border-white/10 h-80">
                <div className="h-6 bg-white/10 rounded w-1/2 mb-4"></div>
                <div className="h-48 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Supply Chain Simulation & Optimization</h1>
        <div className="flex items-center space-x-2 text-sm text-white/70">
          <Activity className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Simulation Controls */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Simulation Controls</h3>
          <div className="flex items-center space-x-4">
            <select
              value={currentScenario}
              onChange={(e) => setCurrentScenario(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="baseline">Baseline Scenario</option>
              <option value="optimized">Optimized Routes</option>
              <option value="multimodal">Multi-modal Transport</option>
              <option value="ai">AI-Powered Optimization</option>
              <option value="green">Green Initiative</option>
            </select>
            <button
              onClick={handleStartSimulation}
              disabled={isRunning}
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg text-white text-sm"
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? 'Running...' : 'Start Simulation'}
            </button>
            <button
              onClick={handleStopSimulation}
              disabled={!isRunning}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-lg text-white text-sm"
            >
              <Pause className="h-4 w-4 mr-2" />
              Stop
            </button>
            <button
              onClick={handleResetSimulation}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-white/70">Current Scenario</span>
            </div>
            <p className="text-lg font-semibold text-white capitalize">{currentScenario.replace('-', ' ')}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-green-400" />
              <span className="text-sm text-white/70">Simulation Time</span>
            </div>
            <p className="text-lg font-semibold text-white">{isRunning ? 'Running...' : 'Ready'}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-white/70">Performance</span>
            </div>
            <p className="text-lg font-semibold text-white">92.5%</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-sm text-white/70">Cost Savings</span>
            </div>
            <p className="text-lg font-semibold text-white">$2.4M</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Simulation Results */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Real-time Simulation Results</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={simulationResults}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="efficiency" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Bar dataKey="throughput" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Scenario Comparison */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Scenario Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scenarioComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Legend />
              <Bar dataKey="efficiency" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cost" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Analysis Over Time */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Cost Analysis Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={costAnalysis}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value: any) => [`$${(value / 1000).toFixed(0)}K`, '']}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="baseline" 
                stroke="#EF4444" 
                fill="#EF4444" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="optimized" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics vs Targets */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Performance vs Targets</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Legend />
              <Bar dataKey="baseline" fill="#6B7280" radius={[4, 4, 0, 0]} />
              <Bar dataKey="optimized" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Optimization Results */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
        <h3 className="text-lg font-semibold text-white mb-4">Optimization Results & ROI</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={optimizationResults}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Legend />
            <Bar dataKey="current" fill="#6B7280" radius={[4, 4, 0, 0]} />
            <Bar dataKey="optimized" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Line 
              type="monotone" 
              dataKey="roi" 
              stroke="#F59E0B" 
              strokeWidth={3}
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
          {optimizationResults.map((item) => (
            <div key={item.name} className="text-center">
              <div className="text-lg font-bold text-white mb-1">{item.savings}%</div>
              <p className="text-xs text-white/70">{item.name}</p>
              <p className="text-xs text-green-400">ROI: {item.roi}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
        <h3 className="text-lg font-semibold text-white mb-4">What-If Scenario Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-6 border border-blue-500/30">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Truck className="h-8 w-8 text-blue-400" />
              </div>
              <h4 className="text-white font-medium mb-2">Route Optimization</h4>
              <p className="text-blue-300 text-sm mb-3">Optimize delivery routes using AI algorithms</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Cost Impact:</span>
                  <span className="text-green-400">-$15K/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Time Savings:</span>
                  <span className="text-green-400">+2.5 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">ROI:</span>
                  <span className="text-green-400">340%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg p-6 border border-green-500/30">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Package className="h-8 w-8 text-green-400" />
              </div>
              <h4 className="text-white font-medium mb-2">Inventory Optimization</h4>
              <p className="text-green-300 text-sm mb-3">Implement just-in-time inventory management</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Cost Impact:</span>
                  <span className="text-green-400">-$8K/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Storage Savings:</span>
                  <span className="text-green-400">+25%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">ROI:</span>
                  <span className="text-green-400">280%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-purple-400" />
              </div>
              <h4 className="text-white font-medium mb-2">Predictive Analytics</h4>
              <p className="text-purple-300 text-sm mb-3">Use ML to predict demand and optimize supply</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Cost Impact:</span>
                  <span className="text-green-400">-$12K/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Accuracy:</span>
                  <span className="text-green-400">+15%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">ROI:</span>
                  <span className="text-green-400">180%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Insights */}
      <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg p-6 border border-indigo-500/30 backdrop-blur">
        <h3 className="text-lg font-semibold text-white mb-4">Simulation Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-medium mb-3">Key Findings</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Route optimization can reduce transportation costs by 22%</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Multi-modal transport increases throughput by 25%</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>AI-powered optimization improves efficiency by 17%</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Predictive analytics reduces stockouts by 30%</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">Implementation Priority</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <span className="text-white text-sm">Route Optimization</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">High Priority</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <span className="text-white text-sm">Inventory Management</span>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">Medium Priority</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <span className="text-white text-sm">Predictive Analytics</span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">Low Priority</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
