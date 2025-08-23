import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, } from 'lucide-react';

const analyticsCards = [
  { title: 'Total Revenue Impact', value: '$12.4M', change: '+8.2%', trend: 'up' },
  { title: 'Cost Savings', value: '$2.1M', change: '+15.7%', trend: 'up' },
  { title: 'Efficiency Gain', value: '23%', change: '+5.1%', trend: 'up' },
  { title: 'Risk Reduction', value: '34%', change: '+12.3%', trend: 'up' },
];

const reportTypes = [
  { name: 'Supply Chain Performance', description: 'Comprehensive performance metrics and KPIs', lastGenerated: '2 hours ago' },
  { name: 'Risk Assessment Summary', description: 'Detailed risk analysis and mitigation strategies', lastGenerated: '1 day ago' },
  { name: 'Supplier Scorecard', description: 'Individual supplier performance evaluations', lastGenerated: '3 hours ago' },
  { name: 'Cost Analysis Report', description: 'Detailed cost breakdown and optimization opportunities', lastGenerated: '6 hours ago' },
];

const trends = [
  { metric: 'On-Time Delivery', current: 94.2, previous: 91.8, change: 2.4 },
  { metric: 'Quality Score', current: 92.7, previous: 89.3, change: 3.4 },
  { metric: 'Cost Efficiency', current: 87.5, previous: 83.2, change: 4.3 },
  { metric: 'Supplier Rating', current: 4.6, previous: 4.3, change: 0.3 },
];

export default function Analytics() {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('performance');

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards.map((card) => (
          <div key={card.title} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-slate-700">
                <BarChart3 className="h-6 w-6 text-blue-400" />
              </div>
              <span className={`text-sm ${card.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {card.change}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-white">Analytics Dashboard</h3>

          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>

            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="performance">Performance</option>
              <option value="risk">Risk Analysis</option>
              <option value="cost">Cost Analysis</option>
              <option value="supplier">Supplier Metrics</option>
            </select>

            <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm">
              <Download size={16} className="mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Chart */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Trends</h3>
          <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-400">Interactive Performance Chart</p>
              <p className="text-sm text-gray-500">Real-time analytics visualization</p>
            </div>
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Key Metrics Comparison</h3>
          <div className="space-y-4">
            {trends.map((trend, index) => (
              <div key={index} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{trend.metric}</h4>
                  <span className="text-green-400 text-sm font-medium">
                    +{trend.change}%
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Previous</span>
                      <span>{trend.previous}%</span>
                    </div>
                    <div className="bg-slate-600 rounded-full h-2 mb-2">
                      <div
                        className="bg-gray-500 h-2 rounded-full"
                        style={{ width: `${trend.previous}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Current</span>
                      <span>{trend.current}%</span>
                    </div>
                    <div className="bg-slate-600 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${trend.current}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Generated Reports</h3>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm">
            Generate New Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTypes.map((report, index) => (
            <div key={index} className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-2">{report.name}</h4>
                  <p className="text-gray-400 text-sm mb-3">{report.description}</p>
                  <p className="text-xs text-gray-500">Last generated: {report.lastGenerated}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-white">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Predictive Analytics */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Predictive Analytics</h3>
        <div className="h-48 bg-slate-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="h-10 w-10 text-blue-400 mx-auto mb-3" />
            <p className="text-gray-400">AI-Powered Forecasting</p>
            <p className="text-sm text-gray-500">Machine learning predictions and trend analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
}