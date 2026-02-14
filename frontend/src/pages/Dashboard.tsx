
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  Package,
  Truck,
  Ship,
  Plane,
  Train,
  Building2,
  Users,
  Warehouse,
  BarChart3,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import Chatbot from '../components/Chatbot';
import { 
  suppliersAPI, 
  customersAPI, 
  shipmentsAPI, 
  disruptionsAPI, 
  inventoryAPI,
  portHubsAPI,
  warehousesAPI,
  roadFleetAPI,
  airCargoAPI,
  railCargoAPI
} from '../services/api';

interface DashboardStats {
  totalSuppliers: number;
  totalCustomers: number;
  totalShipments: number;
  activeDisruptions: number;
  lowStockItems: number;
  totalPortHubs: number;
  totalWarehouses: number;
  totalVehicles: number;
  totalFlights: number;
  totalTrains: number;
}

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSuppliers: 0,
    totalCustomers: 0,
    totalShipments: 0,
    activeDisruptions: 0,
    lowStockItems: 0,
    totalPortHubs: 0,
    totalWarehouses: 0,
    totalVehicles: 0,
    totalFlights: 0,
    totalTrains: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentShipments, setRecentShipments] = useState<any[]>([]);
  const [recentDisruptions, setRecentDisruptions] = useState<any[]>([]);
  const [shipmentStatusData, setShipmentStatusData] = useState<ChartData[]>([]);
  const [weeklyShipments, setWeeklyShipments] = useState<ChartData[]>([]);
  const [transportModeData, setTransportModeData] = useState<ChartData[]>([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [
          suppliers,
          customers,
          shipments,
          disruptions,
          inventory,
          portHubs,
          warehouses,
          roadFleet,
          airCargo,
          railCargo
        ] = await Promise.all([
          suppliersAPI.getAll(),
          customersAPI.getAll(),
          shipmentsAPI.getAll(),
          disruptionsAPI.getActive(),
          inventoryAPI.getLowStock(),
          portHubsAPI.getAll(),
          warehousesAPI.getAll(),
          roadFleetAPI.getAll(),
          airCargoAPI.getAll(),
          railCargoAPI.getAll()
        ]);

        setStats({
          totalSuppliers: suppliers.length || 0,
          totalCustomers: customers.length || 0,
          totalShipments: shipments.length || 0,
          activeDisruptions: disruptions.length || 0,
          lowStockItems: inventory.length || 0,
          totalPortHubs: portHubs.length || 0,
          totalWarehouses: warehouses.length || 0,
          totalVehicles: roadFleet.length || 0,
          totalFlights: airCargo.length || 0,
          totalTrains: railCargo.length || 0,
        });

        // Get recent shipments (last 5)
        const recentShipmentsData = shipments.slice(0, 5);
        setRecentShipments(recentShipmentsData);

        // Get recent disruptions (last 5)
        const recentDisruptionsData = disruptions.slice(0, 5);
        setRecentDisruptions(recentDisruptionsData);

        // Process shipment status data for charts
        const statusCounts = shipments.reduce((acc: any, shipment: any) => {
          const status = shipment.status?.replace('_', ' ') || 'Unknown';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        
        const statusData = Object.entries(statusCounts).map(([name, value]) => ({
          name,
          value: value as number
        }));
        setShipmentStatusData(statusData);

        // Process weekly shipment data (last 4 weeks)
        const weeklyData = [];
        const now = new Date();
        for (let i = 3; i >= 0; i--) {
          const date = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
          const weekName = `Week ${Math.ceil((date.getDate() + date.getDay()) / 7)}`;
          const weekShipments = shipments.filter((shipment: any) => {
            const shipmentDate = new Date(shipment.departureTime);
            const weekStart = new Date(date.getTime() - (date.getDay() * 24 * 60 * 60 * 1000));
            const weekEnd = new Date(weekStart.getTime() + (6 * 24 * 60 * 60 * 1000));
            return shipmentDate >= weekStart && shipmentDate <= weekEnd;
          }).length;
          
          weeklyData.push({
            name: weekName,
            shipments: weekShipments
          });
        }
        setWeeklyShipments(weeklyData);

        // Process transport mode data
        const modeCounts = shipments.reduce((acc: any, shipment: any) => {
          const mode = shipment.mode || 'Unknown';
          acc[mode] = (acc[mode] || 0) + 1;
          return acc;
        }, {});
        
        const modeData = Object.entries(modeCounts).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value: value as number
        }));
        setTransportModeData(modeData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const kpiData = [
    { 
      name: 'Total Suppliers', 
      value: stats.totalSuppliers.toString(), 
      change: '+2', 
      trend: 'up', 
      icon: Building2, 
      color: 'text-blue-500',
      bgGradient: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30'
    },
    { 
      name: 'Total Customers', 
      value: stats.totalCustomers.toString(), 
      change: '+5', 
      trend: 'up', 
      icon: Users, 
      color: 'text-green-500',
      bgGradient: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/30'
    },
    { 
      name: 'Active Shipments', 
      value: stats.totalShipments.toString(), 
      change: '+12', 
      trend: 'up', 
      icon: Package, 
      color: 'text-purple-500',
      bgGradient: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-500/30'
    },
    { 
      name: 'Active Disruptions', 
      value: stats.activeDisruptions.toString(), 
      change: '-3', 
      trend: 'down', 
      icon: AlertTriangle, 
      color: 'text-red-500',
      bgGradient: 'from-red-500/20 to-red-600/20',
      borderColor: 'border-red-500/30'
    },
  ];

  const infrastructureData = [
    { name: 'Port Hubs', value: stats.totalPortHubs, icon: Ship, color: 'text-blue-400' },
    { name: 'Warehouses', value: stats.totalWarehouses, icon: Warehouse, color: 'text-green-400' },
    { name: 'Road Fleet', value: stats.totalVehicles, icon: Truck, color: 'text-yellow-400' },
    { name: 'Air Cargo', value: stats.totalFlights, icon: Plane, color: 'text-purple-400' },
    { name: 'Rail Cargo', value: stats.totalTrains, icon: Train, color: 'text-orange-400' },
  ];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-green-500';
      case 'in_transit':
        return 'text-blue-500';
      case 'delayed':
        return 'text-red-500';
      case 'planned':
        return 'text-yellow-500';
      default:
        return 'text-white/50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-white/50';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="h-6 bg-white/10 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-white/10 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Chatbot />
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.name} className={`bg-gradient-to-r ${kpi.bgGradient} rounded-lg p-6 border ${kpi.borderColor} backdrop-blur`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80 mb-1">{kpi.name}</p>
                  <p className="text-2xl font-bold text-white">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                    )}
                    <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-white/20 ${kpi.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Shipments Trend */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Weekly Shipments Trend</h3>
          </div>
          {weeklyShipments.length === 0 || weeklyShipments.every(item => item.shipments === 0) ? (
            <div className="flex items-center justify-center h-[250px] text-white/50">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No shipment data available</p>
                <p className="text-sm mt-1">Data will appear once shipments are added</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyShipments}>
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
                <Bar dataKey="shipments" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Transport Mode Distribution */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Transport Mode Distribution</h3>
          </div>
          {transportModeData.length === 0 ? (
            <div className="flex items-center justify-center h-[250px] text-white/50">
              <div className="text-center">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No transport mode data available</p>
                <p className="text-sm mt-1">Data will appear once shipments are added</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={transportModeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {transportModeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Infrastructure Overview */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Infrastructure Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            {infrastructureData.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full bg-white/10 ${item.color}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">{item.name}</p>
                      <p className="text-xl font-bold text-white">{item.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Disruptions */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Disruptions</h3>
          <div className="space-y-3">
            {recentDisruptions.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                <p className="text-white/70">No active disruptions</p>
                <p className="text-sm text-white/50">All systems are running smoothly</p>
              </div>
            ) : (
              recentDisruptions.map((disruption) => (
                <div key={disruption.id} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                  <div className={`w-3 h-3 rounded-full mt-2 ${getSeverityColor(disruption.severity).replace('text-', 'bg-')}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{disruption.type}</p>
                    <p className="text-sm text-white/70 mt-1">{disruption.description}</p>
                    <p className="text-xs text-white/50 mt-1">
                      {new Date(disruption.startTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Shipments with Enhanced UI */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Shipments</h3>
          <div className="flex items-center space-x-2 text-sm text-white/70">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Completed</span>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>In Transit</span>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Delayed</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 text-sm font-medium text-white/70">ID</th>
                <th className="text-left py-3 text-sm font-medium text-white/70">Mode</th>
                <th className="text-left py-3 text-sm font-medium text-white/70">Status</th>
                <th className="text-left py-3 text-sm font-medium text-white/70">Departure</th>
                <th className="text-left py-3 text-sm font-medium text-white/70">ETA</th>
                <th className="text-left py-3 text-sm font-medium text-white/70">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {recentShipments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-white/50">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No shipments found</p>
                  </td>
                </tr>
              ) : (
                recentShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 text-sm text-white font-mono">{shipment.id.slice(0, 8)}...</td>
                    <td className="py-3 text-sm text-white capitalize">
                      <div className="flex items-center space-x-2">
                        {shipment.mode === 'road' && <Truck className="h-4 w-4 text-yellow-400" />}
                        {shipment.mode === 'air' && <Plane className="h-4 w-4 text-purple-400" />}
                        {shipment.mode === 'sea' && <Ship className="h-4 w-4 text-blue-400" />}
                        {shipment.mode === 'rail' && <Train className="h-4 w-4 text-orange-400" />}
                        <span>{shipment.mode}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        shipment.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        shipment.status === 'in_transit' ? 'bg-blue-500/20 text-blue-400' :
                        shipment.status === 'delayed' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {shipment.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-white/70">
                      {new Date(shipment.departureTime).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-sm text-white/70">
                      {new Date(shipment.ETA).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        shipment.riskScore > 70 ? 'bg-red-500/20 text-red-400' :
                        shipment.riskScore > 40 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {shipment.riskScore}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}