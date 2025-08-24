import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ComposedChart
} from 'recharts';
import { 
  Package, Truck, Ship, Plane, Train, Clock, AlertTriangle, 
  CheckCircle, MapPin, TrendingUp, Calendar, Users, Download,
  Filter, Search, RefreshCw, FileText, BarChart3, PieChart as PieChartIcon
} from 'lucide-react';
import { shipmentsAPI, suppliersAPI, customersAPI } from '../services/api';

interface Shipment {
  id: string;
  supplierId: string;
  customerId: string;
  originLocationType: string;
  originLocationId: string;
  destinationLocationType: string;
  destinationLocationId: string;
  mode: string;
  departureTime: string;
  ETA: string;
  status: string;
  riskScore: number;
  supplier?: { name: string };
  customer?: { name: string };
}

interface ReportData {
  totalShipments: number;
  completedShipments: number;
  delayedShipments: number;
  inTransitShipments: number;
  avgDeliveryTime: number;
  totalRevenue: number;
  avgRiskScore: number;
  onTimeDeliveryRate: number;
}

export default function ShipmentHistory() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMode, setFilterMode] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [reportData, setReportData] = useState<ReportData>({
    totalShipments: 0,
    completedShipments: 0,
    delayedShipments: 0,
    inTransitShipments: 0,
    avgDeliveryTime: 0,
    totalRevenue: 0,
    avgRiskScore: 0,
    onTimeDeliveryRate: 0
  });

  // Chart data states
  const [statusData, setStatusData] = useState<any[]>([]);
  const [modeData, setModeData] = useState<any[]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (shipments.length > 0) {
      prepareChartData();
      calculateReportData();
    }
  }, [shipments]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [shipmentsData, suppliersData, customersData] = await Promise.all([
        shipmentsAPI.getAll(),
        suppliersAPI.getAll(),
        customersAPI.getAll(),
      ]);
      setShipments(shipmentsData);
      setSuppliers(suppliersData);
      setCustomers(customersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    // Status distribution
    const statusCount = shipments.reduce((acc, shipment) => {
      acc[shipment.status] = (acc[shipment.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusChartData = Object.entries(statusCount).map(([status, count]) => ({
      name: status.replace('_', ' ').toUpperCase(),
      value: count,
      fill: status === 'completed' ? '#10B981' : 
            status === 'in_transit' ? '#3B82F6' : 
            status === 'delayed' ? '#EF4444' : '#F59E0B'
    }));

    // Transport mode distribution
    const modeCount = shipments.reduce((acc, shipment) => {
      acc[shipment.mode] = (acc[shipment.mode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const modeChartData = Object.entries(modeCount).map(([mode, count]) => ({
      name: mode.toUpperCase(),
      value: count,
      fill: mode === 'sea' ? '#3B82F6' : 
            mode === 'air' ? '#8B5CF6' : 
            mode === 'road' ? '#10B981' : 
            mode === 'rail' ? '#F59E0B' : '#6B7280'
    }));

    // Timeline data (last 12 months)
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toISOString().slice(0, 7); // YYYY-MM format
    }).reverse();

    const timelineChartData = last12Months.map(month => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      completed: shipments.filter(s => 
        s.ETA.startsWith(month) && s.status === 'completed'
      ).length,
      delayed: shipments.filter(s => 
        s.ETA.startsWith(month) && s.status === 'delayed'
      ).length,
      inTransit: shipments.filter(s => 
        s.departureTime.startsWith(month) && s.status === 'in_transit'
      ).length
    }));

    // Performance by supplier
    const supplierPerformance = suppliers.map(supplier => {
      const supplierShipments = shipments.filter(s => s.supplierId === supplier.id);
      const completed = supplierShipments.filter(s => s.status === 'completed').length;
      const total = supplierShipments.length;
      const avgRisk = supplierShipments.reduce((sum, s) => sum + s.riskScore, 0) / total || 0;
      
      return {
        supplier: supplier.name,
        completed,
        total,
        successRate: total > 0 ? (completed / total) * 100 : 0,
        avgRisk: Math.round(avgRisk)
      };
    }).filter(p => p.total > 0).slice(0, 10);

    // Revenue data (mock data based on shipments)
    const revenueChartData = last12Months.map(month => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      revenue: shipments.filter(s => s.ETA.startsWith(month)).length * 1500 + Math.random() * 5000,
      shipments: shipments.filter(s => s.ETA.startsWith(month)).length
    }));

    setStatusData(statusChartData);
    setModeData(modeChartData);
    setTimelineData(timelineChartData);
    setPerformanceData(supplierPerformance);
    setRevenueData(revenueChartData);
  };

  const calculateReportData = () => {
    const total = shipments.length;
    const completed = shipments.filter(s => s.status === 'completed').length;
    const delayed = shipments.filter(s => s.status === 'delayed').length;
    const inTransit = shipments.filter(s => s.status === 'in_transit').length;
    const avgRisk = shipments.reduce((sum, s) => sum + s.riskScore, 0) / total || 0;
    const onTimeRate = total > 0 ? ((total - delayed) / total) * 100 : 0;
    const avgDeliveryTime = 72; // Mock average delivery time in hours
    const totalRevenue = total * 1500 + Math.random() * 50000; // Mock revenue

    setReportData({
      totalShipments: total,
      completedShipments: completed,
      delayedShipments: delayed,
      inTransitShipments: inTransit,
      avgDeliveryTime,
      totalRevenue,
      avgRiskScore: Math.round(avgRisk),
      onTimeDeliveryRate: Math.round(onTimeRate)
    });
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = searchTerm === '' || 
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customer?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus;
    const matchesMode = filterMode === 'all' || shipment.mode === filterMode;
    
    const matchesDateRange = !dateRange.start || !dateRange.end || 
      (shipment.departureTime >= dateRange.start && shipment.departureTime <= dateRange.end);
    
    return matchesSearch && matchesStatus && matchesMode && matchesDateRange;
  });

  const exportReport = (format: 'csv' | 'pdf') => {
    // Mock export functionality
    const data = filteredShipments.map(s => ({
      ID: s.id,
      Supplier: s.supplier?.name || 'Unknown',
      Customer: s.customer?.name || 'Unknown',
      Mode: s.mode.toUpperCase(),
      Status: s.status.replace('_', ' ').toUpperCase(),
      Departure: new Date(s.departureTime).toLocaleDateString(),
      ETA: new Date(s.ETA).toLocaleDateString(),
      RiskScore: s.riskScore
    }));

    if (format === 'csv') {
      const csvContent = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shipment-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in_transit': return 'text-blue-400';
      case 'delayed': return 'text-red-400';
      case 'planned': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'sea': return <Ship className="h-4 w-4" />;
      case 'air': return <Plane className="h-4 w-4" />;
      case 'road': return <Truck className="h-4 w-4" />;
      case 'rail': return <Train className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Shipment History & Reports</h1>
            <p className="text-gray-400">Comprehensive analytics and reporting for shipment performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => exportReport('csv')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => exportReport('pdf')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-6 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total Shipments</p>
                <p className="text-2xl font-bold text-white">{reportData.totalShipments}</p>
              </div>
              <Package className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg p-6 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">On-Time Rate</p>
                <p className="text-2xl font-bold text-white">{reportData.onTimeDeliveryRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-white">${reportData.totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-lg p-6 border border-orange-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm font-medium">Avg Risk Score</p>
                <p className="text-2xl font-bold text-white">{reportData.avgRiskScore}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Status Distribution */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5 text-green-400" />
              <span>Shipment Status Distribution</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value})`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Transport Mode Distribution */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              <span>Transport Mode Distribution</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={modeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#ffffff70" />
                <YAxis stroke="#ffffff70" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timeline and Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Timeline Chart */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-400" />
              <span>12-Month Shipment Timeline</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="month" stroke="#ffffff70" />
                <YAxis stroke="#ffffff70" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Area type="monotone" dataKey="completed" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="inTransit" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="delayed" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span>Monthly Revenue & Shipments</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="month" stroke="#ffffff70" />
                <YAxis yAxisId="left" stroke="#ffffff70" />
                <YAxis yAxisId="right" orientation="right" stroke="#ffffff70" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Bar yAxisId="left" dataKey="shipments" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search shipments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in_transit">In Transit</option>
              <option value="delayed">Delayed</option>
              <option value="planned">Planned</option>
            </select>
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Modes</option>
              <option value="sea">Sea</option>
              <option value="air">Air</option>
              <option value="road">Road</option>
              <option value="rail">Rail</option>
            </select>
            <div className="flex space-x-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Shipment ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Mode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Departure</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">ETA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Risk Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {shipment.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {shipment.supplier?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {shipment.customer?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getModeIcon(shipment.mode)}
                        <span className="text-sm font-medium text-white">{shipment.mode.toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        shipment.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        shipment.status === 'in_transit' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        shipment.status === 'delayed' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {shipment.status === 'in_transit' ? 'In Transit' : shipment.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {new Date(shipment.departureTime).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {new Date(shipment.ETA).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        shipment.riskScore > 70 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        shipment.riskScore > 40 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {shipment.riskScore}/100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredShipments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-white/50">No shipments found matching the criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
