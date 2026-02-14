import React, { useState, useEffect } from 'react';
import { shipmentsAPI, suppliersAPI, customersAPI } from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Truck, Ship, Plane, Train, Package, Clock, AlertTriangle, 
  CheckCircle, MapPin, TrendingUp, Calendar, Users
} from 'lucide-react';

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

export default function Shipments() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [formData, setFormData] = useState({
    supplierId: '',
    customerId: '',
    originLocationType: 'supplier',
    originLocationId: '',
    destinationLocationType: 'customer',
    destinationLocationId: '',
    mode: 'sea',
    departureTime: '',
    ETA: '',
    status: 'planned',
    riskScore: 0,
  });

  // Chart data states
  const [statusData, setStatusData] = useState<any[]>([]);
  const [modeData, setModeData] = useState<any[]>([]);
  const [riskData, setRiskData] = useState<any[]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true, render: (value: string) => value.slice(0, 8) + '...' },
    { 
      key: 'supplier', 
      label: 'Supplier', 
      sortable: true,
      render: (value: any, row: Shipment) => {
        const supplier = suppliers.find(s => s.id === row.supplierId);
        return supplier?.name || 'Unknown';
      }
    },
    { 
      key: 'customer', 
      label: 'Customer', 
      sortable: true,
      render: (value: any, row: Shipment) => {
        const customer = customers.find(c => c.id === row.customerId);
        return customer?.name || 'Unknown';
      }
    },
    { 
      key: 'mode', 
      label: 'Mode', 
      sortable: true, 
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          {value === 'sea' && <Ship className="h-4 w-4 text-blue-400" />}
          {value === 'air' && <Plane className="h-4 w-4 text-purple-400" />}
          {value === 'road' && <Truck className="h-4 w-4 text-green-400" />}
          {value === 'rail' && <Train className="h-4 w-4 text-orange-400" />}
          <span className="text-sm font-medium">{value.toUpperCase()}</span>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (value: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
          value === 'in_transit' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
          value === 'delayed' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
          'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
        }`}>
          {value === 'in_transit' ? 'In Transit' : value.replace('_', ' ').toUpperCase()}
        </span>
      )
    },
    { 
      key: 'departureTime', 
      label: 'Departure', 
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
        </div>
      )
    },
    { 
      key: 'ETA', 
      label: 'ETA', 
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
        </div>
      )
    },
    { 
      key: 'riskScore', 
      label: 'Risk Score', 
      sortable: true,
      render: (value: number) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value > 70 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
          value > 40 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
          'bg-green-500/20 text-green-400 border border-green-500/30'
        }`}>
          {value}/100
        </span>
      )
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (shipments.length > 0) {
      prepareChartData();
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

    // Risk score distribution
    const riskRanges = [
      { name: 'Low (0-30)', min: 0, max: 30, fill: '#10B981' },
      { name: 'Medium (31-70)', min: 31, max: 70, fill: '#F59E0B' },
      { name: 'High (71-100)', min: 71, max: 100, fill: '#EF4444' }
    ];

    const riskChartData = riskRanges.map(range => ({
      name: range.name,
      value: shipments.filter(s => s.riskScore >= range.min && s.riskScore <= range.max).length,
      fill: range.fill
    }));

    // Timeline data (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const timelineChartData = last7Days.map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      planned: shipments.filter(s => 
        s.departureTime.startsWith(date) && s.status === 'planned'
      ).length,
      inTransit: shipments.filter(s => 
        s.departureTime.startsWith(date) && s.status === 'in_transit'
      ).length,
      completed: shipments.filter(s => 
        s.ETA.startsWith(date) && s.status === 'completed'
      ).length
    }));

    setStatusData(statusChartData);
    setModeData(modeChartData);
    setRiskData(riskChartData);
    setTimelineData(timelineChartData);
  };

  const handleAdd = () => {
    setEditingShipment(null);
    setFormData({
      supplierId: '',
      customerId: '',
      originLocationType: 'supplier',
      originLocationId: '',
      destinationLocationType: 'customer',
      destinationLocationId: '',
      mode: 'sea',
      departureTime: '',
      ETA: '',
      status: 'planned',
      riskScore: 0,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (shipment: Shipment) => {
    setEditingShipment(shipment);
    setFormData({
      supplierId: shipment.supplierId,
      customerId: shipment.customerId,
      originLocationType: shipment.originLocationType,
      originLocationId: shipment.originLocationId,
      destinationLocationType: shipment.destinationLocationType,
      destinationLocationId: shipment.destinationLocationId,
      mode: shipment.mode,
      departureTime: shipment.departureTime.split('T')[0],
      ETA: shipment.ETA.split('T')[0],
      status: shipment.status,
      riskScore: shipment.riskScore,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (shipment: Shipment) => {
    if (window.confirm(`Are you sure you want to delete shipment ${shipment.id.slice(0, 8)}...?`)) {
      try {
        await shipmentsAPI.delete(shipment.id);
        await fetchData();
      } catch (error) {
        console.error('Error deleting shipment:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        departureTime: new Date(formData.departureTime).toISOString(),
        ETA: new Date(formData.ETA).toISOString(),
      };

      if (editingShipment) {
        await shipmentsAPI.update(editingShipment.id, submitData);
      } else {
        await shipmentsAPI.create(submitData);
      }
      setIsModalOpen(false);
      await fetchData();
    } catch (error) {
      console.error('Error saving shipment:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'riskScore' ? parseInt(value) || 0 : value,
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-white/10 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  const totalShipments = shipments.length;
  const activeShipments = shipments.filter(s => s.status === 'in_transit').length;
  const delayedShipments = shipments.filter(s => s.status === 'delayed').length;
  const completedShipments = shipments.filter(s => s.status === 'completed').length;
  const avgRiskScore = Math.round(shipments.reduce((sum, s) => sum + s.riskScore, 0) / totalShipments);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Shipments Management</h1>
          <p className="text-white/70 mt-1">Track and manage all your supply chain shipments</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
        >
          <Package className="h-5 w-5" />
          <span>Add Shipment</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-6 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm font-medium">Total Shipments</p>
              <p className="text-2xl font-bold text-white">{totalShipments}</p>
            </div>
            <Package className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg p-6 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm font-medium">Active Shipments</p>
              <p className="text-2xl font-bold text-white">{activeShipments}</p>
            </div>
            <Truck className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg p-6 border border-red-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-300 text-sm font-medium">Delayed</p>
              <p className="text-2xl font-bold text-white">{delayedShipments}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm font-medium">Avg Risk Score</p>
              <p className="text-2xl font-bold text-white">{avgRiskScore}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span>Shipment Status Distribution</span>
          </h3>
          {statusData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-white/50">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No status data available</p>
                <p className="text-sm mt-1">Data will appear once shipments are added</p>
              </div>
            </div>
          ) : (
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
          )}
        </div>

        {/* Transport Mode Distribution */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Ship className="h-5 w-5 text-blue-400" />
            <span>Transport Mode Distribution</span>
          </h3>
          {modeData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-white/50">
              <div className="text-center">
                <Ship className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No transport mode data available</p>
                <p className="text-sm mt-1">Data will appear once shipments are added</p>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* Risk Analysis and Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Score Distribution */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span>Risk Score Distribution</span>
          </h3>
          {(!riskData || riskData.length === 0 || riskData.every(item => item.value === 0)) ? (
            <div className="flex items-center justify-center h-[300px] text-white/50">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No risk data available</p>
                <p className="text-sm mt-1">Data will appear once shipments are added</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskData}>
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
                <Bar dataKey="value" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Timeline Chart */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            <span>7-Day Shipment Timeline</span>
          </h3>
          {(!timelineData || timelineData.length === 0 || timelineData.every(item => item.planned === 0 && item.inTransit === 0 && item.completed === 0)) ? (
            <div className="flex items-center justify-center h-[300px] text-white/50">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No timeline data available</p>
                <p className="text-sm mt-1">Data will appear once shipments are added</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="date" stroke="#ffffff70" />
                <YAxis stroke="#ffffff70" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Area type="monotone" dataKey="planned" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                <Area type="monotone" dataKey="inTransit" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="completed" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Shipment Details</h3>
        <DataTable
          data={shipments}
          columns={columns}
          title=""
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingShipment ? 'Edit Shipment' : 'Add New Shipment'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Supplier
              </label>
              <select
                name="supplierId"
                value={formData.supplierId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Customer
              </label>
              <select
                name="customerId"
                value={formData.customerId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Origin Location Type
              </label>
              <select
                name="originLocationType"
                value={formData.originLocationType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="supplier">Supplier</option>
                <option value="port">Port</option>
                <option value="warehouse">Warehouse</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Destination Location Type
              </label>
              <select
                name="destinationLocationType"
                value={formData.destinationLocationType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="port">Port</option>
                <option value="warehouse">Warehouse</option>
                <option value="customer">Customer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Origin Location ID
              </label>
              <input
                type="text"
                name="originLocationId"
                value={formData.originLocationId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Location ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Destination Location ID
              </label>
              <input
                type="text"
                name="destinationLocationId"
                value={formData.destinationLocationId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Location ID"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Mode
              </label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sea">Sea</option>
                <option value="air">Air</option>
                <option value="road">Road</option>
                <option value="rail">Rail</option>
                <option value="multimodal">Multimodal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="planned">Planned</option>
                <option value="in_transit">In Transit</option>
                <option value="delayed">Delayed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Departure Date
              </label>
              <input
                type="date"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                ETA
              </label>
              <input
                type="date"
                name="ETA"
                value={formData.ETA}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Risk Score (0-100)
            </label>
            <input
              type="number"
              name="riskScore"
              value={formData.riskScore}
              onChange={handleInputChange}
              min="0"
              max="100"
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0-100"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-white/70 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {editingShipment ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
