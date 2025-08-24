import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, AlertTriangle, Package, TrendingUp, TrendingDown, Warehouse, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { inventoryAPI, warehousesAPI } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

interface InventoryItem {
  id: string;
  warehouseId: string;
  productName: string;
  sku: string;
  quantity: number;
  reorderPoint: number;
  lastUpdated: string;
  warehouse?: {
    name: string;
    location: string;
  };
}

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWarehouse, setFilterWarehouse] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    warehouseId: '',
    productName: '',
    sku: '',
    quantity: 0,
    reorderPoint: 0,
  });

  // Chart data states
  const [warehouseData, setWarehouseData] = useState<any[]>([]);
  const [stockLevelData, setStockLevelData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);

  // Fetch inventory and warehouses on component mount
  useEffect(() => {
    fetchInventory();
    fetchWarehouses();
  }, []);

  useEffect(() => {
    if (inventory.length > 0 && warehouses.length > 0) {
      prepareChartData();
    }
  }, [inventory, warehouses]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await inventoryAPI.getAll();
      setInventory(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch inventory');
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const data = await warehousesAPI.getAll();
      setWarehouses(data);
    } catch (err) {
      console.error('Error fetching warehouses:', err);
    }
  };

  const prepareChartData = () => {
    // Warehouse distribution
    const warehouseCount = inventory.reduce((acc, item) => {
      const warehouse = warehouses.find(w => w.id === item.warehouseId);
      const warehouseName = warehouse?.name || 'Unknown';
      acc[warehouseName] = (acc[warehouseName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const warehouseChartData = Object.entries(warehouseCount).map(([name, count]) => ({
      name,
      value: count,
      fill: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));

    // Stock level distribution
    const stockLevels = inventory.map(item => {
      const status = getStockStatus(item);
      return {
        name: item.productName,
        quantity: item.quantity,
        reorderPoint: item.reorderPoint,
        status,
        fill: status === 'low' ? '#EF4444' : 
              status === 'high' ? '#F59E0B' : '#10B981'
      };
    }).sort((a, b) => b.quantity - a.quantity).slice(0, 10);

    // Category analysis (by product name patterns)
    const categoryCount = inventory.reduce((acc, item) => {
      const category = item.productName.split(' ')[0] || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryChartData = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([category, count]) => ({
        category,
        count,
        fill: `hsl(${Math.random() * 360}, 70%, 50%)`
      }));

    // Trend data (mock data for demonstration)
    const trendChartData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
      totalItems: Math.floor(Math.random() * 100) + 50,
      lowStock: Math.floor(Math.random() * 20) + 5,
      value: Math.floor(Math.random() * 100000) + 50000
    }));

    setWarehouseData(warehouseChartData);
    setStockLevelData(stockLevels);
    setCategoryData(categoryChartData);
    setTrendData(trendChartData);
  };

  const handleCreateItem = async () => {
    try {
      await inventoryAPI.create(formData);
      setShowModal(false);
      setFormData({
        warehouseId: '',
        productName: '',
        sku: '',
        quantity: 0,
        reorderPoint: 0,
      });
      fetchInventory();
    } catch (err) {
      setError('Failed to create inventory item');
      console.error('Error creating inventory item:', err);
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;
    try {
      await inventoryAPI.update(editingItem.id, formData);
      setShowModal(false);
      setEditingItem(null);
      setFormData({
        warehouseId: '',
        productName: '',
        sku: '',
        quantity: 0,
        reorderPoint: 0,
      });
      fetchInventory();
    } catch (err) {
      setError('Failed to update inventory item');
      console.error('Error updating inventory item:', err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      try {
        await inventoryAPI.delete(id);
        fetchInventory();
      } catch (err) {
        setError('Failed to delete inventory item');
        console.error('Error deleting inventory item:', err);
      }
    }
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    try {
      await inventoryAPI.updateQuantity(id, newQuantity);
      fetchInventory();
    } catch (err) {
      setError('Failed to update quantity');
      console.error('Error updating quantity:', err);
    }
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      warehouseId: item.warehouseId,
      productName: item.productName,
      sku: item.sku,
      quantity: item.quantity,
      reorderPoint: item.reorderPoint,
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      warehouseId: '',
      productName: '',
      sku: '',
      quantity: 0,
      reorderPoint: 0,
    });
    setShowModal(true);
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.reorderPoint) return 'low';
    if (item.quantity >= item.reorderPoint * 2) return 'high';
    return 'normal';
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'text-red-400';
      case 'high': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

  const getStockStatusIcon = (status: string) => {
    switch (status) {
      case 'low': return AlertTriangle;
      case 'high': return TrendingUp;
      default: return Package;
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWarehouse = !filterWarehouse || item.warehouseId === filterWarehouse;
    const matchesLowStock = !showLowStock || item.quantity <= item.reorderPoint;
    
    return matchesSearch && matchesWarehouse && matchesLowStock;
  });

  const lowStockItems = inventory.filter(item => item.quantity <= item.reorderPoint);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Inventory Management</h1>
          <p className="text-white/70">Manage warehouse inventory and stock levels</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-6 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm font-medium">Total Items</p>
              <p className="text-2xl font-bold text-white">{inventory.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg p-6 border border-red-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-300 text-sm font-medium">Low Stock Items</p>
              <p className="text-2xl font-bold text-white">{lowStockItems.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm font-medium">Warehouses</p>
              <p className="text-2xl font-bold text-white">{warehouses.length}</p>
            </div>
            <Warehouse className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg p-6 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm font-medium">Total Value</p>
              <p className="text-2xl font-bold text-white">
                ${inventory.reduce((sum, item) => sum + (item.quantity * 100), 0).toLocaleString()}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Warehouse Distribution */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Warehouse className="h-5 w-5 text-blue-400" />
            <span>Inventory by Warehouse</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={warehouseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {warehouseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Level Analysis */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-green-400" />
            <span>Top 10 Items by Quantity</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockLevelData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis type="number" stroke="#ffffff70" />
              <YAxis dataKey="name" type="category" stroke="#ffffff70" width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
              />
              <Bar dataKey="quantity" fill="#10B981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <PieChartIcon className="h-5 w-5 text-purple-400" />
            <span>Product Categories</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="category" stroke="#ffffff70" />
              <YAxis stroke="#ffffff70" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
              />
              <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Trends */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-orange-400" />
            <span>Monthly Inventory Trends</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
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
              <Area type="monotone" dataKey="totalItems" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
              <Area type="monotone" dataKey="lowStock" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Items</p>
              <p className="text-white text-2xl font-bold">{inventory.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Low Stock Items</p>
              <p className="text-white text-2xl font-bold">{lowStockItems.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Warehouses</p>
              <p className="text-white text-2xl font-bold">{warehouses.length}</p>
            </div>
            <Package className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10 backdrop-blur">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <select
              value={filterWarehouse}
              onChange={(e) => setFilterWarehouse(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Warehouses</option>
              {warehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <label className="flex items-center space-x-2 text-white/70">
              <input
                type="checkbox"
                checked={showLowStock}
                onChange={(e) => setShowLowStock(e.target.checked)}
                className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
              />
              <span>Show Low Stock Only</span>
            </label>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterWarehouse('');
                setShowLowStock(false);
              }}
              className="px-4 py-2 text-white/70 hover:text-white transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white/5 rounded-lg border border-white/10 backdrop-blur overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Warehouse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Reorder Point</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white/70 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredInventory.map((item) => {
                const stockStatus = getStockStatus(item);
                const StatusIcon = getStockStatusIcon(stockStatus);
                const warehouse = warehouses.find(w => w.id === item.warehouseId);
                
                return (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{item.productName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {warehouse?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-white">{item.quantity}</span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {item.reorderPoint}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className={`h-4 w-4 ${getStockStatusColor(stockStatus)}`} />
                        <span className={`text-sm font-medium ${getStockStatusColor(stockStatus)}`}>
                          {stockStatus === 'low' ? 'Low Stock' : 
                           stockStatus === 'high' ? 'High Stock' : 'Normal'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredInventory.length === 0 && (
          <div className="text-center py-8">
            <p className="text-white/50">No inventory items found</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Warehouse</label>
                <select
                  value={formData.warehouseId}
                  onChange={(e) => setFormData({...formData, warehouseId: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map(warehouse => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">SKU</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Reorder Point</label>
                <input
                  type="number"
                  value={formData.reorderPoint}
                  onChange={(e) => setFormData({...formData, reorderPoint: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingItem ? handleUpdateItem : handleCreateItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingItem ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
