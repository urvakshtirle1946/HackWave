import React, { useState } from 'react';
import { AlertTriangle, Shield, TrendingUp, Globe, Factory, Truck } from 'lucide-react';

const riskCategories = [
  { id: 'geopolitical', name: 'Geopolitical', icon: Globe, score: 7.2, trend: '+0.8' },
  { id: 'operational', name: 'Operational', icon: Factory, score: 5.4, trend: '-0.3' },
  { id: 'logistics', name: 'Logistics', icon: Truck, score: 6.8, trend: '+1.2' },
  { id: 'financial', name: 'Financial', icon: TrendingUp, score: 4.1, trend: '-0.5' },
];

const riskFactors = [
  { name: 'Port Congestion', category: 'logistics', severity: 'high', impact: 85, probability: 70 },
  { name: 'Currency Fluctuation', category: 'financial', severity: 'medium', impact: 60, probability: 45 },
  { name: 'Political Instability', category: 'geopolitical', severity: 'high', impact: 90, probability: 30 },
  { name: 'Natural Disasters', category: 'operational', severity: 'medium', impact: 75, probability: 25 },
  { name: 'Supplier Capacity', category: 'operational', severity: 'low', impact: 40, probability: 60 },
];

const riskMitigations = [
  {
    risk: 'Port Congestion',
    strategy: 'Multi-modal Transport',
    costSaving: '$450K',
    implementation: 'In Progress',
    effectiveness: 78
  },
  {
    risk: 'Political Instability',
    strategy: 'Supplier Diversification',
    costSaving: '$1.2M',
    implementation: 'Planned',
    effectiveness: 85
  },
  {
    risk: 'Currency Fluctuation',
    strategy: 'Hedging Contracts',
    costSaving: '$320K',
    implementation: 'Active',
    effectiveness: 92
  },
];

export default function RiskAssessment() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-500 bg-red-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'low': return 'text-green-500 bg-green-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Risk Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {riskCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`bg-slate-800 rounded-lg p-6 border cursor-pointer transition-colors ${selectedCategory === category.id ? 'border-blue-500' : 'border-slate-700 hover:border-slate-600'
                }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-full bg-slate-700">
                  <Icon className="h-6 w-6 text-blue-400" />
                </div>
                <span className="text-xs text-green-400">{category.trend}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{category.name}</h3>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white mr-2">{category.score}</span>
                <span className="text-sm text-gray-400">/10</span>
              </div>
              <div className="mt-3 bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${category.score * 10}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Factors */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
            Risk Factors Analysis
          </h3>
          <div className="space-y-4">
            {riskFactors.map((factor, index) => (
              <div key={index} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">{factor.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(factor.severity)}`}>
                    {factor.severity}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Impact</p>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-white mr-2">{factor.impact}%</span>
                      <div className="flex-1 bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${factor.impact}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Probability</p>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-white mr-2">{factor.probability}%</span>
                      <div className="flex-1 bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${factor.probability}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mitigation Strategies */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-500" />
            Mitigation Strategies
          </h3>
          <div className="space-y-4">
            {riskMitigations.map((mitigation, index) => (
              <div key={index} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{mitigation.risk}</h4>
                  <span className="text-green-400 text-sm font-medium">{mitigation.costSaving}</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{mitigation.strategy}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Effectiveness</p>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-white mr-2">{mitigation.effectiveness}%</span>
                      <div className="w-16 bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${mitigation.effectiveness}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${mitigation.implementation === 'Active' ? 'text-green-400 bg-green-400/10' :
                    mitigation.implementation === 'In Progress' ? 'text-yellow-400 bg-yellow-400/10' :
                      'text-blue-400 bg-blue-400/10'
                    }`}>
                    {mitigation.implementation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Timeline */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Risk Timeline & Trends</h3>
        <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <p className="text-gray-400">Interactive Risk Timeline</p>
            <p className="text-sm text-gray-500">Historical risk data and trend analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
}