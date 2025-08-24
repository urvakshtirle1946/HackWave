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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from 'recharts';
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  MapPin,
  Clock,
  DollarSign,
  Package,
  Truck,
  Ship,
  Plane,
  Train,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface RiskData {
  name: string;
  value: number;
  [key: string]: any;
}

export default function RiskAssessment() {
  const [loading, setLoading] = useState(true);
  const [riskDistribution, setRiskDistribution] = useState<RiskData[]>([]);
  const [riskTrends, setRiskTrends] = useState<RiskData[]>([]);
  const [transportModeRisks, setTransportModeRisks] = useState<RiskData[]>([]);
  const [regionalRisks, setRegionalRisks] = useState<RiskData[]>([]);
  const [riskCategories, setRiskCategories] = useState<RiskData[]>([]);
  const [highRiskShipments, setHighRiskShipments] = useState<any[]>([]);

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#FF0000', '#8B0000'];

  useEffect(() => {
    const generateMockRiskData = () => {
      // Generate risk distribution data
      const distributionData = [
        { name: 'Low Risk (0-30)', value: 45, color: '#00C49F', count: 180 },
        { name: 'Medium Risk (31-60)', value: 35, color: '#FFBB28', count: 140 },
        { name: 'High Risk (61-80)', value: 15, color: '#FF8042', count: 60 },
        { name: 'Critical Risk (81-90)', value: 4, color: '#FF0000', count: 16 },
        { name: 'Extreme Risk (91-100)', value: 1, color: '#8B0000', count: 4 }
      ];
      setRiskDistribution(distributionData);

      // Generate risk trends over time
      const trendsData = [];
      const now = new Date();
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const baseRisk = 35 + Math.random() * 20;
        
        trendsData.push({
          name: monthName,
          avgRisk: Math.round(baseRisk),
          highRiskCount: Math.round(Math.random() * 15 + 5),
          criticalRiskCount: Math.round(Math.random() * 5 + 1),
          incidents: Math.round(Math.random() * 8 + 2)
        });
      }
      setRiskTrends(trendsData);

      // Generate transport mode risk data
      const transportData = [
        { name: 'Road Transport', riskScore: 42, incidents: 8, delayRate: 12, costImpact: 15000 },
        { name: 'Air Cargo', riskScore: 28, incidents: 3, delayRate: 8, costImpact: 25000 },
        { name: 'Sea Freight', riskScore: 65, incidents: 15, delayRate: 25, costImpact: 35000 },
        { name: 'Rail Transport', riskScore: 35, incidents: 5, delayRate: 10, costImpact: 12000 }
      ];
      setTransportModeRisks(transportData);

      // Generate regional risk data
      const regionalData = [
        { name: 'North America', riskScore: 38, incidents: 12, severity: 'Medium' },
        { name: 'Europe', riskScore: 45, incidents: 18, severity: 'Medium' },
        { name: 'Asia Pacific', riskScore: 72, incidents: 35, severity: 'High' },
        { name: 'Latin America', riskScore: 58, incidents: 22, severity: 'Medium' },
        { name: 'Middle East', riskScore: 81, incidents: 28, severity: 'Critical' }
      ];
      setRegionalRisks(regionalData);

      // Generate risk categories data
      const categoriesData = [
        { name: 'Weather & Natural Disasters', value: 25, impact: 'High', frequency: 'Medium' },
        { name: 'Supply Chain Disruptions', value: 30, impact: 'Critical', frequency: 'High' },
        { name: 'Transportation Delays', value: 35, impact: 'Medium', frequency: 'High' },
        { name: 'Quality Issues', value: 20, impact: 'Medium', frequency: 'Low' },
        { name: 'Regulatory Changes', value: 15, impact: 'High', frequency: 'Low' },
        { name: 'Cyber Security', value: 10, impact: 'Critical', frequency: 'Low' }
      ];
      setRiskCategories(categoriesData);

      // Generate high-risk shipments data
      const shipmentsData = [
        {
          id: 'SH001',
          origin: 'Shanghai, China',
          destination: 'Los Angeles, USA',
          mode: 'Sea',
          riskScore: 89,
          riskFactors: ['Weather', 'Port Congestion', 'Customs Delay'],
          eta: '2024-02-15',
          status: 'High Risk'
        },
        {
          id: 'SH002',
          origin: 'Mumbai, India',
          destination: 'London, UK',
          mode: 'Air',
          riskScore: 76,
          riskFactors: ['Supply Chain Disruption', 'Labor Strike'],
          eta: '2024-02-12',
          status: 'High Risk'
        },
        {
          id: 'SH003',
          origin: 'Rotterdam, Netherlands',
          destination: 'Chicago, USA',
          mode: 'Sea',
          riskScore: 82,
          riskFactors: ['Weather', 'Port Congestion'],
          eta: '2024-02-20',
          status: 'Critical Risk'
        },
        {
          id: 'SH004',
          origin: 'Dubai, UAE',
          destination: 'Sydney, Australia',
          mode: 'Air',
          riskScore: 71,
          riskFactors: ['Regulatory Changes', 'Customs Delay'],
          eta: '2024-02-18',
          status: 'High Risk'
        }
      ];
      setHighRiskShipments(shipmentsData);

      setLoading(false);
    };

    // Simulate API call delay
    setTimeout(generateMockRiskData, 1000);
  }, []);

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-green-400';
    if (score <= 60) return 'text-yellow-400';
    if (score <= 80) return 'text-orange-400';
    if (score <= 90) return 'text-red-400';
    return 'text-red-600';
  };

  const getRiskBgColor = (score: number) => {
    if (score <= 30) return 'bg-green-500/20';
    if (score <= 60) return 'bg-yellow-500/20';
    if (score <= 80) return 'bg-orange-500/20';
    if (score <= 90) return 'bg-red-500/20';
    return 'bg-red-600/20';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTransportIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'road': return <Truck className="h-4 w-4 text-yellow-400" />;
      case 'air': return <Plane className="h-4 w-4 text-purple-400" />;
      case 'sea': return <Ship className="h-4 w-4 text-blue-400" />;
      case 'rail': return <Train className="h-4 w-4 text-orange-400" />;
      default: return <Package className="h-4 w-4 text-gray-400" />;
    }
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

  const totalShipments = riskDistribution.reduce((sum, item) => sum + item.count, 0);
  const avgRiskScore = riskTrends.reduce((sum, month) => sum + month.avgRisk, 0) / riskTrends.length;
  const highRiskPercentage = (riskDistribution.slice(2).reduce((sum, item) => sum + item.count, 0) / totalShipments) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Risk Assessment & Management</h1>
        <div className="flex items-center space-x-2 text-sm text-white/70">
          <AlertTriangle className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg p-6 border border-green-500/30 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-300 mb-1">Total Shipments</p>
              <p className="text-2xl font-bold text-white">{totalShipments}</p>
              <div className="flex items-center mt-2">
                <CheckCircle className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-sm text-green-400">Active Monitoring</span>
              </div>
            </div>
            <Package className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg p-6 border border-yellow-500/30 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-300 mb-1">Average Risk Score</p>
              <p className="text-2xl font-bold text-white">{Math.round(avgRiskScore)}</p>
              <div className="flex items-center mt-2">
                <AlertCircle className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm text-yellow-400">Moderate Risk</span>
              </div>
            </div>
            <Shield className="h-8 w-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-lg p-6 border border-orange-500/30 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-300 mb-1">High Risk Shipments</p>
              <p className="text-2xl font-bold text-white">{Math.round(highRiskPercentage)}%</p>
              <div className="flex items-center mt-2">
                <AlertTriangle className="h-4 w-4 text-orange-400 mr-1" />
                <span className="text-sm text-orange-400">Requires Attention</span>
              </div>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg p-6 border border-red-500/30 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-300 mb-1">Critical Incidents</p>
              <p className="text-2xl font-bold text-white">{riskDistribution.slice(3).reduce((sum, item) => sum + item.count, 0)}</p>
              <div className="flex items-center mt-2">
                <XCircle className="h-4 w-4 text-red-400 mr-1" />
                <span className="text-sm text-red-400">Immediate Action</span>
              </div>
            </div>
            <XCircle className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Trends Over Time */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Risk Trends Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={riskTrends}>
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
                dataKey="avgRisk" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Bar dataKey="incidents" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transport Mode Risk Analysis */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Transport Mode Risk Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transportModeRisks}>
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
              <Bar dataKey="riskScore" fill="#EF4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="incidents" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Categories Radar Chart */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Risk Categories Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={riskCategories}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="name" stroke="#9CA3AF" />
              <PolarRadiusAxis stroke="#374151" />
              <Radar 
                name="Risk Level" 
                dataKey="value" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.3} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Risk Analysis */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
        <h3 className="text-lg font-semibold text-white mb-4">Regional Risk Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={regionalRisks} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9CA3AF" />
            <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={120} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Bar dataKey="riskScore" fill="#EF4444" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
          {regionalRisks.map((region) => (
            <div key={region.name} className="text-center">
              <div className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(region.severity)}`}>
                {region.severity}
              </div>
              <p className="text-xs text-white/70 mt-1">{region.name}</p>
              <p className="text-xs text-white/50">{region.incidents} incidents</p>
            </div>
          ))}
        </div>
      </div>

      {/* High Risk Shipments */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">High Risk Shipments</h3>
          <div className="flex items-center space-x-2 text-sm text-white/70">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>High Risk</span>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Critical Risk</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 text-sm font-medium text-white/70">Shipment ID</th>
                <th className="text-left py-3 text-sm font-medium text-white/70">Route</th>
                <th className="text-left py-3 text-sm font-medium text-white/70">Mode</th>
                <th className="text-left py-3 text-sm font-medium text-white/70">Risk Score</th>
                <th className="text-left py-3 text-sm font-medium text-white/70">Risk Factors</th>
                <th className="text-left py-3 text-sm font-medium text-white/70">ETA</th>
                <th className="text-left py-3 text-sm font-medium text-white/70">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {highRiskShipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 text-sm text-white font-mono">{shipment.id}</td>
                  <td className="py-3 text-sm text-white/70">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-blue-400" />
                      <span>{shipment.origin} → {shipment.destination}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-white">
                    <div className="flex items-center space-x-2">
                      {getTransportIcon(shipment.mode)}
                      <span className="capitalize">{shipment.mode}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskBgColor(shipment.riskScore)} ${getRiskColor(shipment.riskScore)}`}>
                      {shipment.riskScore}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-white/70">
                    <div className="flex flex-wrap gap-1">
                      {shipment.riskFactors.map((factor, index) => (
                        <span key={index} className="px-2 py-1 bg-white/10 rounded text-xs">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 text-sm text-white/70">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-yellow-400" />
                      <span>{shipment.eta}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      shipment.status === 'Critical Risk' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {shipment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Mitigation Strategies */}
      <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg p-6 border border-indigo-500/30 backdrop-blur">
        <h3 className="text-lg font-semibold text-white mb-4">Risk Mitigation Strategies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Shield className="h-6 w-6 text-blue-400" />
            </div>
            <h4 className="text-white font-medium mb-2">Preventive Measures</h4>
            <p className="text-blue-300 text-sm">Implement early warning systems and predictive analytics to identify risks before they occur</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Activity className="h-6 w-6 text-green-400" />
            </div>
            <h4 className="text-white font-medium mb-2">Real-time Monitoring</h4>
            <p className="text-green-300 text-sm">Continuous tracking of shipments and immediate alerts for any deviations from planned routes</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full mx-auto mb-3 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
            </div>
            <h4 className="text-white font-medium mb-2">Contingency Planning</h4>
            <p className="text-yellow-300 text-sm">Develop backup routes and alternative suppliers to minimize impact of disruptions</p>
          </div>
        </div>
      </div>
    </div>
  );
}