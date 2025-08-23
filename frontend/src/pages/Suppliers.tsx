import React, { useState } from 'react';
import { Building2, Star, MapPin, Phone, Mail, TrendingUp } from 'lucide-react';

const suppliers = [
  {
    id: 1,
    name: 'Global Manufacturing Corp',
    rating: 4.8,
    location: 'Shanghai, China',
    category: 'Electronics',
    status: 'active',
    riskScore: 3.2,
    onTimeDelivery: 96.5,
    qualityScore: 94.2,
    sustainabilityRating: 'A+',
    contractExpiry: '2024-12-31',
    contact: { email: 'contact@globalman.com', phone: '+86-21-1234-5678' }
  },
  {
    id: 2,
    name: 'European Logistics Ltd',
    rating: 4.6,
    location: 'Hamburg, Germany',
    category: 'Logistics',
    status: 'active',
    riskScore: 2.1,
    onTimeDelivery: 98.1,
    qualityScore: 91.7,
    sustainabilityRating: 'A',
    contractExpiry: '2025-06-15',
    contact: { email: 'ops@eurolog.de', phone: '+49-40-9876-5432' }
  },
  {
    id: 3,
    name: 'American Steel Works',
    rating: 4.2,
    location: 'Pittsburgh, USA',
    category: 'Raw Materials',
    status: 'under-review',
    riskScore: 5.8,
    onTimeDelivery: 89.3,
    qualityScore: 88.9,
    sustainabilityRating: 'B+',
    contractExpiry: '2024-09-30',
    contact: { email: 'supply@amsteel.com', phone: '+1-412-555-0123' }
  },
  {
    id: 4,
    name: 'Asia Pacific Components',
    rating: 4.4,
    location: 'Singapore',
    category: 'Components',
    status: 'active',
    riskScore: 3.7,
    onTimeDelivery: 93.8,
    qualityScore: 92.4,
    sustainabilityRating: 'A-',
    contractExpiry: '2025-03-20',
    contact: { email: 'info@apcomponents.sg', phone: '+65-6123-4567' }
  }
];

const performanceMetrics = [
  { name: 'Total Suppliers', value: '248', change: '+12', color: 'text-blue-400' },
  { name: 'Active Contracts', value: '186', change: '+8', color: 'text-green-400' },
  { name: 'Avg Rating', value: '4.6', change: '+0.2', color: 'text-yellow-400' },
  { name: 'Risk Exposure', value: '3.4', change: '-0.8', color: 'text-red-400' },
];

export default function Suppliers() {
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'under-review': return 'text-yellow-400 bg-yellow-400/10';
      case 'inactive': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 3) return 'text-green-400';
    if (score < 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const filteredSuppliers = filterCategory === 'all'
    ? suppliers
    : suppliers.filter(s => s.category.toLowerCase() === filterCategory.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric) => (
          <div key={metric.name} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">{metric.name}</p>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <span className={`text-sm ${metric.color}`}>{metric.change}</span>
              </div>
              <div className={`p-3 rounded-full bg-slate-700 ${metric.color}`}>
                <Building2 size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Supplier Directory</h3>
          <div className="flex items-center space-x-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="logistics">Logistics</option>
              <option value="raw materials">Raw Materials</option>
              <option value="components">Components</option>
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm">
              Add Supplier
            </button>
          </div>
        </div>

        {/* Supplier List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              onClick={() => setSelectedSupplier(selectedSupplier === supplier.id ? null : supplier.id)}
              className={`bg-slate-700 rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-600 ${selectedSupplier === supplier.id ? 'ring-2 ring-blue-500' : ''
                }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1">{supplier.name}</h4>
                  <div className="flex items-center text-sm text-gray-400 mb-1">
                    <MapPin size={14} className="mr-1" />
                    {supplier.location}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-400 mr-1" />
                      <span className="text-sm text-white">{supplier.rating}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(supplier.status)}`}>
                      {supplier.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Risk Score</p>
                  <p className={`text-lg font-bold ${getRiskColor(supplier.riskScore)}`}>
                    {supplier.riskScore}
                  </p>
                </div>
              </div>

              {selectedSupplier === supplier.id && (
                <div className="mt-4 pt-4 border-t border-slate-600 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">On-Time Delivery</p>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-white mr-2">{supplier.onTimeDelivery}%</span>
                        <div className="flex-1 bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${supplier.onTimeDelivery}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Quality Score</p>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-white mr-2">{supplier.qualityScore}%</span>
                        <div className="flex-1 bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${supplier.qualityScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Sustainability</p>
                      <span className="text-sm font-medium text-green-400">{supplier.sustainabilityRating}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Contract Expires</p>
                      <span className="text-sm font-medium text-white">{supplier.contractExpiry}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 pt-2">
                    <a href={`mailto:${supplier.contact.email}`} className="flex items-center text-blue-400 hover:text-blue-300 text-sm">
                      <Mail size={14} className="mr-1" />
                      Email
                    </a>
                    <a href={`tel:${supplier.contact.phone}`} className="flex items-center text-blue-400 hover:text-blue-300 text-sm">
                      <Phone size={14} className="mr-1" />
                      Call
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Supplier Performance Chart */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Supplier Performance Trends</h3>
        <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <p className="text-gray-400">Performance Analytics Dashboard</p>
            <p className="text-sm text-gray-500">Comprehensive supplier performance tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
}