import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, MapPin, Truck, Plane, Train, Ship } from 'lucide-react';
import { routesAPI } from '../services/api';

interface Route {
  id: string;
  shipmentId: string;
  fromLocationType: string;
  fromLocationId: string;
  toLocationType: string;
  toLocationId: string;
  sequenceNumber: number;
  mode: string;
  carrierName: string;
  travelTimeEst: number;
  costEst: number;
  shipment?: {
    id: string;
    supplier: { name: string };
    customer: { name: string };
  };
}

export default function Routes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const [filterCarrier, setFilterCarrier] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [formData, setFormData] = useState({
    shipmentId: '',
    fromLocationType: '',
    fromLocationId: '',
    toLocationType: '',
    toLocationId: '',
    sequenceNumber: 1,
    mode: '',
    carrierName: '',
    travelTimeEst: 0,
    costEst: 0,
  });

  // Fetch routes on component mount
  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const data = await routesAPI.getAll();
      setRoutes(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch routes');
      console.error('Error fetching routes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoute = async () => {
    try {
      await routesAPI.create(formData);
      setShowModal(false);
      setFormData({
        shipmentId: '',
        fromLocationType: '',
        fromLocationId: '',
        toLocationType: '',
        toLocationId: '',
        sequenceNumber: 1,
        mode: '',
        carrierName: '',
        travelTimeEst: 0,
        costEst: 0,
      });
      fetchRoutes();
    } catch (err) {
      setError('Failed to create route');
      console.error('Error creating route:', err);
    }
  };

  const handleUpdateRoute = async () => {
    if (!editingRoute) return;
    try {
      await routesAPI.update(editingRoute.id, formData);
      setShowModal(false);
      setEditingRoute(null);
      setFormData({
        shipmentId: '',
        fromLocationType: '',
        fromLocationId: '',
        toLocationType: '',
        toLocationId: '',
        sequenceNumber: 1,
        mode: '',
        carrierName: '',
        travelTimeEst: 0,
        costEst: 0,
      });
      fetchRoutes();
    } catch (err) {
      setError('Failed to update route');
      console.error('Error updating route:', err);
    }
  };

  const handleDeleteRoute = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await routesAPI.delete(id);
        fetchRoutes();
      } catch (err) {
        setError('Failed to delete route');
        console.error('Error deleting route:', err);
      }
    }
  };

  const openEditModal = (route: Route) => {
    setEditingRoute(route);
    setFormData({
      shipmentId: route.shipmentId,
      fromLocationType: route.fromLocationType,
      fromLocationId: route.fromLocationId,
      toLocationType: route.toLocationType,
      toLocationId: route.toLocationId,
      sequenceNumber: route.sequenceNumber,
      mode: route.mode,
      carrierName: route.carrierName,
      travelTimeEst: route.travelTimeEst,
      costEst: route.costEst,
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingRoute(null);
    setFormData({
      shipmentId: '',
      fromLocationType: '',
      fromLocationId: '',
      toLocationType: '',
      toLocationId: '',
      sequenceNumber: 1,
      mode: '',
      carrierName: '',
      travelTimeEst: 0,
      costEst: 0,
    });
    setShowModal(true);
  };

  const getModeIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'air': return Plane;
      case 'road': return Truck;
      case 'rail': return Train;
      case 'sea': return Ship;
      default: return MapPin;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'air': return 'text-blue-400';
      case 'road': return 'text-green-400';
      case 'rail': return 'text-orange-400';
      case 'sea': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.carrierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.mode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = !filterMode || route.mode.toLowerCase() === filterMode.toLowerCase();
    const matchesCarrier = !filterCarrier || route.carrierName.toLowerCase().includes(filterCarrier.toLowerCase());
    
    return matchesSearch && matchesMode && matchesCarrier;
  });

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
          <h1 className="text-2xl font-bold text-white">Routes Management</h1>
          <p className="text-white/70">Manage transportation routes and logistics paths</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Route</span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10 backdrop-blur">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
              type="text"
              placeholder="Search routes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Modes</option>
              <option value="air">Air</option>
              <option value="road">Road</option>
              <option value="rail">Rail</option>
              <option value="sea">Sea</option>
            </select>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by carrier..."
              value={filterCarrier}
              onChange={(e) => setFilterCarrier(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Routes Table */}
      <div className="bg-white/5 rounded-lg border border-white/10 backdrop-blur overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Mode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Carrier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Time Est.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Cost Est.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Shipment</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white/70 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredRoutes.map((route) => {
                const ModeIcon = getModeIcon(route.mode);
                return (
                  <tr key={route.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-white/50" />
                        <div>
                          <div className="text-sm font-medium text-white">
                            {route.fromLocationType} → {route.toLocationType}
                          </div>
                          <div className="text-xs text-white/50">
                            Seq: {route.sequenceNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <ModeIcon className={`h-4 w-4 ${getModeColor(route.mode)}`} />
                        <span className={`text-sm font-medium ${getModeColor(route.mode)}`}>
                          {route.mode}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {route.carrierName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {route.travelTimeEst}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      ${route.costEst.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {route.shipment?.supplier?.name} → {route.shipment?.customer?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(route)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoute(route.id)}
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
        
        {filteredRoutes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-white/50">No routes found</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingRoute ? 'Edit Route' : 'Create New Route'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Shipment ID</label>
                <input
                  type="text"
                  value={formData.shipmentId}
                  onChange={(e) => setFormData({...formData, shipmentId: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Sequence Number</label>
                <input
                  type="number"
                  value={formData.sequenceNumber}
                  onChange={(e) => setFormData({...formData, sequenceNumber: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">From Location Type</label>
                <input
                  type="text"
                  value={formData.fromLocationType}
                  onChange={(e) => setFormData({...formData, fromLocationType: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">From Location ID</label>
                <input
                  type="text"
                  value={formData.fromLocationId}
                  onChange={(e) => setFormData({...formData, fromLocationId: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">To Location Type</label>
                <input
                  type="text"
                  value={formData.toLocationType}
                  onChange={(e) => setFormData({...formData, toLocationType: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">To Location ID</label>
                <input
                  type="text"
                  value={formData.toLocationId}
                  onChange={(e) => setFormData({...formData, toLocationId: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Mode</label>
                <select
                  value={formData.mode}
                  onChange={(e) => setFormData({...formData, mode: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Mode</option>
                  <option value="air">Air</option>
                  <option value="road">Road</option>
                  <option value="rail">Rail</option>
                  <option value="sea">Sea</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Carrier Name</label>
                <input
                  type="text"
                  value={formData.carrierName}
                  onChange={(e) => setFormData({...formData, carrierName: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Travel Time Estimate (hours)</label>
                <input
                  type="number"
                  value={formData.travelTimeEst}
                  onChange={(e) => setFormData({...formData, travelTimeEst: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Cost Estimate ($)</label>
                <input
                  type="number"
                  value={formData.costEst}
                  onChange={(e) => setFormData({...formData, costEst: parseFloat(e.target.value)})}
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
                onClick={editingRoute ? handleUpdateRoute : handleCreateRoute}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingRoute ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
