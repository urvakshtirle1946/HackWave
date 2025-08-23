import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3, Calculator } from 'lucide-react';

const costMetrics = [
  { name: 'Total Supply Chain Cost', value: '$12.4M', change: '+2.3%', trend: 'up' },
  { name: 'Cost Per Unit', value: '$24.67', change: '-1.8%', trend: 'down' },
  { name: 'Operational Efficiency', value: '87.3%', change: '+4.2%', trend: 'up' },
  { name: 'Cost Savings YTD', value: '$2.1M', change: '+18.5%', trend: 'up' },
];

const costBreakdown = [
  { category: 'Transportation', amount: 4200000, percentage: 35, trend: '+3.2%' },
  { category: 'Warehousing', amount: 2400000, percentage: 20, trend: '-1.5%' },
  { category: 'Procurement', amount: 3000000, percentage: 25, trend: '+2.1%' },
  { category: 'Labor', amount: 1800000, percentage: 15, trend: '+5.8%' },
  { category: 'Technology', amount: 600000, percentage: 5, trend: '-2.3%' },
];

const optimizationOpportunities = [
  {
    category: 'Route Optimization',
    currentCost: '$850K',
    optimizedCost: '$720K',
    savings: '$130K',
    implementation: 'Easy',
    timeframe: '2-4 weeks'
  },
  {
    category: 'Supplier Consolidation',
    currentCost: '$1.2M',
    optimizedCost: '$950K',
    savings: '$250K',
    implementation: 'Medium',
    timeframe: '8-12 weeks'
  },
  {
    category: 'Inventory Management',
    currentCost: '$2.1M',
    optimizedCost: '$1.7M',
    savings: '$400K',
    implementation: 'Hard',
    timeframe: '16-24 weeks'
  },
  {
    category: 'Automation Integration',
    currentCost: '$650K',
    optimizedCost: '$480K',
    savings: '$170K',
    implementation: 'Medium',
    timeframe: '12-16 weeks'
  }
];

export default function CostAnalysis() {
  const [selectedPeriod, setSelectedPeriod] = useState('ytd');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getImplementationColor = (level: string) => {
    switch (level) {
      case 'Easy': return 'text-green-400 bg-green-400/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'Hard': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const totalOptimizationSavings = optimizationOpportunities.reduce(
    (sum, opp) => sum + parseInt(opp.savings.replace('$', '').replace('K', '000')), 0
  );

  return (
    <div className="space-y-6">
      {/* Cost Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {costMetrics.map((metric) => (
          <div key={metric.name} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">{metric.name}</p>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <div className="flex items-center mt-2">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${metric.trend === 'up' && metric.name === 'Cost Savings YTD'
                    ? 'text-green-500'
                    : metric.trend === 'down' && metric.name === 'Cost Per Unit'
                      ? 'text-green-500'
                      : metric.trend === 'up'
                        ? 'text-red-500'
                        : 'text-green-500'
                    }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-slate-700">
                <DollarSign className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Cost Analysis Dashboard</h3>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="mtd">Month to Date</option>
              <option value="qtd">Quarter to Date</option>
              <option value="ytd">Year to Date</option>
              <option value="custom">Custom Range</option>
            </select>
            <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm">
              <Calculator size={16} className="mr-2" />
              Calculate ROI
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-blue-400" />
            Cost Breakdown by Category
          </h3>
          <div className="space-y-4">
            {costBreakdown.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedCategory(selectedCategory === item.category ? null : item.category)}
                className={`bg-slate-700 rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-600 ${selectedCategory === item.category ? 'ring-2 ring-blue-500' : ''
                  }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">{item.category}</h4>
                  <div className="text-right">
                    <span className="text-white font-bold">{formatCurrency(item.amount)}</span>
                    <span className={`ml-2 text-sm ${item.trend.startsWith('+') ? 'text-red-400' : 'text-green-400'
                      }`}>
                      {item.trend}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-slate-600 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-8">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimization Opportunities */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingDown className="h-5 w-5 mr-2 text-green-400" />
            Cost Optimization Opportunities
          </h3>
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="text-center">
              <p className="text-green-400 font-medium">Total Potential Savings</p>
              <p className="text-2xl font-bold text-green-400">
                ${(totalOptimizationSavings / 1000).toFixed(0)}K
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {optimizationOpportunities.map((opp, index) => (
              <div key={index} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">{opp.category}</h4>
                  <span className="text-green-400 font-bold">{opp.savings}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Current Cost</p>
                    <p className="text-sm text-white">{opp.currentCost}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Optimized Cost</p>
                    <p className="text-sm text-green-400">{opp.optimizedCost}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getImplementationColor(opp.implementation)}`}>
                      {opp.implementation}
                    </span>
                    <span className="text-xs text-gray-400">{opp.timeframe}</span>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-xs">
                    Implement
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cost Trends Chart */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Cost Trends & Projections</h3>
        <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <p className="text-gray-400">Interactive Cost Analytics</p>
            <p className="text-sm text-gray-500">Historical trends and future projections</p>
          </div>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">ROI Impact Calculator</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-700 rounded-lg p-4 text-center">
            <Calculator className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <h4 className="text-white font-medium mb-2">Investment Required</h4>
            <p className="text-2xl font-bold text-blue-400">$1.2M</p>
            <p className="text-sm text-gray-400">One-time implementation cost</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <h4 className="text-white font-medium mb-2">Annual Savings</h4>
            <p className="text-2xl font-bold text-green-400">$950K</p>
            <p className="text-sm text-gray-400">Recurring yearly benefit</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4 text-center">
            <DollarSign className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <h4 className="text-white font-medium mb-2">Payback Period</h4>
            <p className="text-2xl font-bold text-yellow-400">15.2</p>
            <p className="text-sm text-gray-400">Months to break even</p>
          </div>
        </div>
      </div>
    </div>
  );
}