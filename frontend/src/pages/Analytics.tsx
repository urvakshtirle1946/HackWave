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
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Truck, 
  Ship, 
  Plane, 
  Train,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Warehouse
} from 'lucide-react';
import { 
  shipmentsAPI, 
  disruptionsAPI, 
  inventoryAPI,
  suppliersAPI,
  customersAPI
} from '../services/api';

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [shipmentData, setShipmentData] = useState<ChartData[]>([]);
  const [disruptionData, setDisruptionData] = useState<ChartData[]>([]);
  const [inventoryData, setInventoryData] = useState<ChartData[]>([]);
  const [monthlyShipments, setMonthlyShipments] = useState<ChartData[]>([]);
  const [transportModeData, setTransportModeData] = useState<ChartData[]>([]);
  const [riskDistribution, setRiskDistribution] = useState<ChartData[]>([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        const [shipments, disruptions, inventory, suppliers, customers] = await Promise.all([
          shipmentsAPI.getAll(),
          disruptionsAPI.getAll(),
          inventoryAPI.getAll(),
          suppliersAPI.getAll(),
          customersAPI.getAll()
        ]);

        // Process shipment data by status
        const statusCounts = shipments.reduce((acc: any, shipment: any) => {
          const status = shipment.status?.replace('_', ' ') || 'Unknown';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        
        const shipmentStatusData = Object.entries(statusCounts).map(([name, value]) => ({
          name,
          value: value as number
        }));
        setShipmentData(shipmentStatusData);

        // Process disruption data by type
        const disruptionCounts = disruptions.reduce((acc: any, disruption: any) => {
          const type = disruption.type || 'Unknown';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});
        
        const disruptionTypeData = Object.entries(disruptionCounts).map(([name, value]) => ({
          name,
          value: value as number
        }));
        setDisruptionData(disruptionTypeData);

        // Process inventory data by category
        const categoryCounts = inventory.reduce((acc: any, item: any) => {
          const category = item.category || 'Unknown';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});
        
        const inventoryCategoryData = Object.entries(categoryCounts).map(([name, value]) => ({
          name,
          value: value as number
        }));
        setInventoryData(inventoryCategoryData);

        // Process monthly shipment data (last 6 months)
        const monthlyData = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthName = date.toLocaleDateString('en-US', { month: 'short' });
          const monthShipments = shipments.filter((shipment: any) => {
            const shipmentDate = new Date(shipment.departureTime);
            return shipmentDate.getMonth() === date.getMonth() && 
                   shipmentDate.getFullYear() === date.getFullYear();
          }).length;
          
          monthlyData.push({
            name: monthName,
            shipments: monthShipments,
            completed: shipments.filter((s: any) => 
              s.status === 'completed' && 
              new Date(s.departureTime).getMonth() === date.getMonth() &&
              new Date(s.departureTime).getFullYear() === date.getFullYear()
            ).length,
            delayed: shipments.filter((s: any) => 
              s.status === 'delayed' && 
              new Date(s.departureTime).getMonth() === date.getMonth() &&
              new Date(s.departureTime).getFullYear() === date.getFullYear()
            ).length
          });
        }
        setMonthlyShipments(monthlyData);

        // Process transport mode data
        const modeCounts = shipments.reduce((acc: any, shipment: any) => {
          const mode = shipment.mode || 'Unknown';
          acc[mode] = (acc[mode] || 0) + 1;
          return acc;
        }, {});
        
        const transportModeData = Object.entries(modeCounts).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value: value as number
        }));
        setTransportModeData(transportModeData);

        // Process risk distribution
        const riskRanges = [
          { name: 'Low (0-30)', min: 0, max: 30, color: '#00C49F' },
          { name: 'Medium (31-70)', min: 31, max: 70, color: '#FFBB28' },
          { name: 'High (71-100)', min: 71, max: 100, color: '#FF8042' }
        ];
        
        const riskData = riskRanges.map(range => ({
          name: range.name,
          value: shipments.filter((s: any) => 
            s.riskScore >= range.min && s.riskScore <= range.max
          ).length,
          color: range.color
        }));
        setRiskDistribution(riskData);

      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

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
        <h1 className="text-2xl font-bold text-white">Analytics & Reports</h1>
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
              <p className="text-sm text-blue-300 mb-1">Total Shipments</p>
              <p className="text-2xl font-bold text-white">{shipmentData.reduce((sum, item) => sum + item.value, 0)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-sm text-green-400">+12%</span>
              </div>
            </div>
            <Package className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg p-6 border border-green-500/30 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-300 mb-1">Active Disruptions</p>
              <p className="text-2xl font-bold text-white">{disruptionData.reduce((sum, item) => sum + item.value, 0)}</p>
              <div className="flex items-center mt-2">
                <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                <span className="text-sm text-red-400">-5%</span>
              </div>
            </div>
            <AlertTriangle className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-300 mb-1">Inventory Items</p>
              <p className="text-2xl font-bold text-white">{inventoryData.reduce((sum, item) => sum + item.value, 0)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-sm text-green-400">+8%</span>
              </div>
            </div>
            <Warehouse className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-lg p-6 border border-orange-500/30 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-300 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-white">$2.4M</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-sm text-green-400">+15%</span>
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-orange-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Shipments Trend */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Shipments Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyShipments}>
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
                dataKey="shipments" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="delayed" 
                stroke="#EF4444" 
                strokeWidth={3}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Transport Mode Distribution */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Transport Mode Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipment Status Distribution */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Shipment Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={shipmentData}>
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
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disruption Types */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Disruption Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={disruptionData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={80} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="value" fill="#EF4444" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Categories */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">Inventory Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={inventoryData}>
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
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg p-6 border border-indigo-500/30 backdrop-blur">
        <h3 className="text-lg font-semibold text-white mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-3 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
            <h4 className="text-white font-medium mb-2">Shipment Growth</h4>
            <p className="text-blue-300 text-sm">Shipments increased by 12% this month compared to last month</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full mx-auto mb-3 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <h4 className="text-white font-medium mb-2">On-Time Delivery</h4>
            <p className="text-green-300 text-sm">87% of shipments are delivered on time, above industry average</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full mx-auto mb-3 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
            </div>
            <h4 className="text-white font-medium mb-2">Risk Management</h4>
            <p className="text-yellow-300 text-sm">15% of shipments have high risk scores requiring attention</p>
          </div>
        </div>
      </div>
    </div>
  );
}