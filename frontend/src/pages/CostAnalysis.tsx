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
  ComposedChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Truck, 
  Ship, 
  Plane, 
  Train,
  Calendar,
  AlertTriangle,
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon
} from 'lucide-react';

interface CostData {
  name: string;
  value: number;
  [key: string]: any;
}

export default function CostAnalysis() {
  const [loading, setLoading] = useState(true);
  const [monthlyCosts, setMonthlyCosts] = useState<CostData[]>([]);
  const [transportModeCosts, setTransportModeCosts] = useState<CostData[]>([]);
  const [costBreakdown, setCostBreakdown] = useState<CostData[]>([]);
  const [costTrends, setCostTrends] = useState<CostData[]>([]);
  const [regionalCosts, setRegionalCosts] = useState<CostData[]>([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    const generateMockCostData = () => {
      // Generate monthly cost data for the last 12 months
      const monthlyData = [];
      const now = new Date();
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const baseCost = 150000 + Math.random() * 50000;
        
        monthlyData.push({
          name: monthName,
          totalCost: Math.round(baseCost),
          transportCost: Math.round(baseCost * 0.4 + Math.random() * 10000),
          warehousingCost: Math.round(baseCost * 0.25 + Math.random() * 8000),
          laborCost: Math.round(baseCost * 0.2 + Math.random() * 6000),
          fuelCost: Math.round(baseCost * 0.15 + Math.random() * 4000)
        });
      }
      setMonthlyCosts(monthlyData);

      // Generate transport mode cost data
      const transportData = [
        { name: 'Road Transport', value: 45000, percentage: 40, trend: 'up', change: '+8%' },
        { name: 'Air Cargo', value: 35000, percentage: 31, trend: 'down', change: '-5%' },
        { name: 'Sea Freight', value: 20000, percentage: 18, trend: 'up', change: '+12%' },
        { name: 'Rail Transport', value: 8000, percentage: 7, trend: 'stable', change: '0%' },
        { name: 'Warehousing', value: 5000, percentage: 4, trend: 'up', change: '+3%' }
      ];
      setTransportModeCosts(transportData);

      // Generate cost breakdown data
      const breakdownData = [
        { name: 'Transportation', value: 108000, color: '#0088FE' },
        { name: 'Warehousing', value: 67500, color: '#00C49F' },
        { name: 'Labor', value: 54000, color: '#FFBB28' },
        { name: 'Fuel', value: 40500, color: '#FF8042' },
        { name: 'Insurance', value: 27000, color: '#8884D8' },
        { name: 'Other', value: 13500, color: '#82CA9D' }
      ];
      setCostBreakdown(breakdownData);

      // Generate cost trends data
      const trendsData = [
        { name: 'Q1', operational: 120000, maintenance: 25000, fuel: 18000, total: 163000 },
        { name: 'Q2', operational: 135000, maintenance: 28000, fuel: 22000, total: 185000 },
        { name: 'Q3', operational: 142000, maintenance: 30000, fuel: 25000, total: 197000 },
        { name: 'Q4', operational: 158000, maintenance: 32000, fuel: 28000, total: 218000 }
      ];
      setCostTrends(trendsData);

      // Generate regional cost data
      const regionalData = [
        { name: 'North America', value: 45000, trend: 'up', change: '+15%' },
        { name: 'Europe', value: 38000, trend: 'down', change: '-8%' },
        { name: 'Asia Pacific', value: 32000, trend: 'up', change: '+22%' },
        { name: 'Latin America', value: 18000, trend: 'stable', change: '0%' },
        { name: 'Middle East', value: 15000, trend: 'up', change: '+18%' }
      ];
      setRegionalCosts(regionalData);

      setLoading(false);
    };

    // Simulate API call delay
    setTimeout(generateMockCostData, 1000);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDownIcon className="h-4 w-4 text-red-500" />;
      default:
        return <MinusIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
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

  const totalAnnualCost = monthlyCosts.reduce((sum, month) => sum + month.totalCost, 0);
  const avgMonthlyCost = Math.round(totalAnnualCost / 12);
  const costChange = ((monthlyCosts[monthlyCosts.length - 1]?.totalCost || 0) - (monthlyCosts[monthlyCosts.length - 2]?.totalCost || 0)) / (monthlyCosts[monthlyCosts.length - 2]?.totalCost || 1) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Cost Analysis & Optimization</h1>
        <div className="flex items-center space-x-2 text-sm text-white/70">
          <Calendar className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-6 border border-blue-500/30 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-300 mb-1">Total Annual Cost</p>
              <p className="text-2xl font-bold text-white">${(totalAnnualCost / 1000000).toFixed(1)}M</p>
              <div className="flex items-center mt-2">
                {costChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                )}
                <span className={`text-sm ${costChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {costChange > 0 ? '+' : ''}{costChange.toFixed(1)}%
                </span>
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg p-6 border border-green-500/30 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-300 mb-1">Average Monthly Cost</p>
              <p className="text-2xl font-bold text-white">${(avgMonthlyCost / 1000).toFixed(0)}K</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-sm text-green-400">+5.2%</span>
              </div>
            </div>
            <Package className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-300 mb-1">Transport Cost</p>
              <p className="text-2xl font-bold text-white">${(transportModeCosts[0]?.value / 1000).toFixed(0)}K</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-sm text-green-400">+8.0%</span>
              </div>
            </div>
            <Truck className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-lg p-6 border border-orange-500/30 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-300 mb-1">Cost per Shipment</p>
              <p className="text-2xl font-bold text-white">$2,450</p>
              <div className="flex items-center mt-2">
                <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                <span className="text-sm text-red-400">-3.1%</span>
              </div>
            </div>
            <Package className="h-8 w-8 text-orange-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Cost Trends */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={monthlyCosts}>
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
              <Bar dataKey="transportCost" fill="#3B82F6" stackId="a" />
              <Bar dataKey="warehousingCost" fill="#10B981" stackId="a" />
              <Bar dataKey="laborCost" fill="#F59E0B" stackId="a" />
              <Bar dataKey="fuelCost" fill="#EF4444" stackId="a" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Breakdown by Category */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Cost Breakdown by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {costBreakdown.map((entry, index) => (
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
                formatter={(value: any) => [`$${(value / 1000).toFixed(0)}K`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quarterly Cost Trends */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Quarterly Cost Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={costTrends}>
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
              <Line 
                type="monotone" 
                dataKey="operational" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="maintenance" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="fuel" 
                stroke="#F59E0B" 
                strokeWidth={3}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Transport Mode Cost Analysis */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Transport Mode Cost Analysis</h3>
          <div className="space-y-4">
            {transportModeCosts.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <div>
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-white/70">{item.percentage}% of total</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-white">${(item.value / 1000).toFixed(0)}K</span>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(item.trend)}
                    <span className={`text-sm ${getTrendColor(item.trend)}`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Cost Analysis */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
        <h3 className="text-lg font-semibold text-white mb-4">Regional Cost Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={regionalCosts} layout="horizontal">
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
              formatter={(value: any) => [`$${(value / 1000).toFixed(0)}K`, '']}
            />
            <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
          {regionalCosts.map((region) => (
            <div key={region.name} className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-2">
                {getTrendIcon(region.trend)}
                <span className={`text-sm ${getTrendColor(region.trend)}`}>
                  {region.change}
                </span>
              </div>
              <p className="text-xs text-white/70">{region.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Optimization Insights */}
      <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg p-6 border border-indigo-500/30 backdrop-blur">
        <h3 className="text-lg font-semibold text-white mb-4">Cost Optimization Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-3 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-blue-400" />
            </div>
            <h4 className="text-white font-medium mb-2">Fuel Cost Reduction</h4>
            <p className="text-blue-300 text-sm">Optimize routes and use fuel-efficient vehicles to reduce fuel costs by 15-20%</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Package className="h-6 w-6 text-green-400" />
            </div>
            <h4 className="text-white font-medium mb-2">Bulk Consolidation</h4>
            <p className="text-green-300 text-sm">Consolidate shipments to reduce transportation costs by up to 25%</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full mx-auto mb-3 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
            </div>
            <h4 className="text-white font-medium mb-2">Warehouse Optimization</h4>
            <p className="text-yellow-300 text-sm">Implement automated systems to reduce labor costs by 30%</p>
          </div>
        </div>
      </div>
    </div>
  );
}