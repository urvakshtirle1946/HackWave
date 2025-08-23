import React from 'react';
import { Truck, Ship, Plane, Train, MapPin, Clock, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

const transportationData = {
  activeShipments: [
    {
      id: 'TRK-001',
      type: 'Truck',
      origin: 'Shanghai, China',
      destination: 'Los Angeles, USA',
      status: 'In Transit',
      eta: '2024-01-15',
      cost: '$12,500',
      risk: 'Low',
      progress: 65
    },
    {
      id: 'SHP-002',
      type: 'Ship',
      origin: 'Rotterdam, Netherlands',
      destination: 'New York, USA',
      status: 'Loading',
      eta: '2024-01-20',
      cost: '$45,000',
      risk: 'Medium',
      progress: 25
    },
    {
      id: 'PLN-003',
      type: 'Air',
      origin: 'Frankfurt, Germany',
      destination: 'Chicago, USA',
      status: 'In Transit',
      eta: '2024-01-12',
      cost: '$8,200',
      risk: 'Low',
      progress: 80
    }
  ],
  routes: [
    { name: 'Asia-Pacific', efficiency: 92, cost: '$2.1M', shipments: 156 },
    { name: 'Europe-North America', efficiency: 88, cost: '$1.8M', shipments: 89 },
    { name: 'Intra-Europe', efficiency: 95, cost: '$950K', shipments: 234 },
    { name: 'North America', efficiency: 90, cost: '$1.2M', shipments: 167 }
  ],
  alerts: [
    { id: 1, type: 'Delay', message: 'Port congestion in Los Angeles', severity: 'high', time: '2 hours ago' },
    { id: 2, type: 'Weather', message: 'Storm warning for North Atlantic routes', severity: 'medium', time: '4 hours ago' },
    { id: 3, type: 'Cost', message: 'Fuel surcharge increase effective next week', severity: 'low', time: '6 hours ago' }
  ]
};

const getTransportIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'truck': return Truck;
    case 'ship': return Ship;
    case 'air': return Plane;
    case 'train': return Train;
    default: return Truck;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'in transit': return 'text-blue-400';
    case 'loading': return 'text-yellow-400';
    case 'delivered': return 'text-green-400';
    case 'delayed': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

const getRiskColor = (risk: string) => {
  switch (risk.toLowerCase()) {
    case 'low': return 'text-green-400';
    case 'medium': return 'text-yellow-400';
    case 'high': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

export default function Transportation() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Transportation Management</h1>
          <p className="text-white/70">Monitor and optimize your global transportation network</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Add Shipment
          </button>
          <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
            Export Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Active Shipments</p>
              <p className="text-2xl font-bold text-white">24</p>
              <p className="text-sm text-green-400">+3 from yesterday</p>
            </div>
            <div className="p-3 rounded-full bg-blue-600/20">
              <Truck className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">On-Time Delivery</p>
              <p className="text-2xl font-bold text-white">94.2%</p>
              <p className="text-sm text-green-400">+2.1% this month</p>
            </div>
            <div className="p-3 rounded-full bg-green-600/20">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Cost</p>
              <p className="text-2xl font-bold text-white">$6.2M</p>
              <p className="text-sm text-red-400">+8.5% this quarter</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-600/20">
              <DollarSign className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Risk Alerts</p>
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-sm text-yellow-400">2 high priority</p>
            </div>
            <div className="p-3 rounded-full bg-red-600/20">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Shipments */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Active Shipments</h3>
          <div className="space-y-4">
            {transportationData.activeShipments.map((shipment) => {
              const TransportIcon = getTransportIcon(shipment.type);
              return (
                <div key={shipment.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-blue-600/20">
                        <TransportIcon className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{shipment.id}</p>
                        <p className="text-xs text-white/70">{shipment.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                      </p>
                      <p className="text-xs text-white/50">ETA: {shipment.eta}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Route:</span>
                      <span className="text-white">{shipment.origin} → {shipment.destination}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Cost:</span>
                      <span className="text-white">{shipment.cost}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Risk:</span>
                      <span className={getRiskColor(shipment.risk)}>{shipment.risk}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-white/70 mb-1">
                      <span>Progress</span>
                      <span>{shipment.progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${shipment.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Route Performance */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Route Performance</h3>
          <div className="space-y-4">
            {transportationData.routes.map((route) => (
              <div key={route.name} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-white">{route.name}</h4>
                  <span className="text-sm text-green-400">{route.efficiency}%</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Total Cost:</span>
                    <span className="text-white">{route.cost}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Shipments:</span>
                    <span className="text-white">{route.shipments}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${route.efficiency}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
        <h3 className="text-lg font-semibold text-white mb-4">Transportation Alerts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {transportationData.alerts.map((alert) => (
            <div key={alert.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-start space-x-3">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  alert.severity === 'high' ? 'bg-red-500' :
                  alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{alert.type}</p>
                  <p className="text-sm text-white/70 mt-1">{alert.message}</p>
                  <p className="text-xs text-white/50 mt-1">{alert.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
