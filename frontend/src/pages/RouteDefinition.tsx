import React, { useState, useEffect } from 'react';
import { 
  Route, MapPin, Plus, Trash2, Edit, Eye, Save, ArrowRight,
  Truck, Ship, Plane, Train, Clock, DollarSign, Navigation
} from 'lucide-react';
import { routesAPI, suppliersAPI, customersAPI } from '../services/api';
import Modal from '../components/Modal';

interface RouteDefinition {
  id?: string;
  name: string;
  description: string;
  origin: { type: string; id: string; name: string; };
  destination: { type: string; id: string; name: string; };
  mode: string;
  totalTime: number;
  totalCost: number;
  status: string;
}

export default function RouteDefinition() {
  const [routes, setRoutes] = useState<RouteDefinition[]>([]);
  const [currentRoute, setCurrentRoute] = useState<RouteDefinition | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [routesData, suppliersData, customersData] = await Promise.all([
        routesAPI.getAll(),
        suppliersAPI.getAll(),
        customersAPI.getAll(),
      ]);
      
      // Enrich routes with supplier and customer names
      const enrichedRoutes = routesData.map((route: any) => ({
        ...route,
        origin: {
          ...route.origin,
          name: route.origin?.name || suppliersData.find((s: any) => s.id === route.origin?.id)?.name || 'Unknown Origin'
        },
        destination: {
          ...route.destination,
          name: route.destination?.name || customersData.find((c: any) => c.id === route.destination?.id)?.name || 'Unknown Destination'
        }
      }));
      
      setRoutes(enrichedRoutes);
      setSuppliers(suppliersData);
      setCustomers(customersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const createNewRoute = () => {
    const newRoute: RouteDefinition = {
      name: '',
      description: '',
      origin: { type: 'supplier', id: '', name: '' },
      destination: { type: 'customer', id: '', name: '' },
      mode: 'multimodal',
      totalTime: 0,
      totalCost: 0,
      status: 'draft'
    };
    setCurrentRoute(newRoute);
    setShowModal(true);
  };

  const saveRoute = async () => {
    if (!currentRoute) return;
    
    try {
      setLoading(true);
      if (currentRoute.id) {
        await routesAPI.update(currentRoute.id, currentRoute);
      } else {
        await routesAPI.create(currentRoute);
      }
      setShowModal(false);
      setCurrentRoute(null);
      fetchData();
    } catch (error) {
      console.error('Error saving route:', error);
    } finally {
      setLoading(false);
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'sea': return <Ship className="h-4 w-4" />;
      case 'air': return <Plane className="h-4 w-4" />;
      case 'road': return <Truck className="h-4 w-4" />;
      case 'rail': return <Train className="h-4 w-4" />;
      default: return <Navigation className="h-4 w-4" />;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'sea': return 'text-blue-400';
      case 'air': return 'text-purple-400';
      case 'road': return 'text-green-400';
      case 'rail': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Route Definition</h1>
            <p className="text-gray-400">Design and manage transportation routes</p>
          </div>
          <button
            onClick={createNewRoute}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Route</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <div key={route.id} className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/20 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getModeIcon(route.mode || 'multimodal')}
                  <div>
                    <h3 className="text-lg font-semibold text-white">{route.name || 'Unnamed Route'}</h3>
                    <p className="text-sm text-gray-400">{route.description || 'No description'}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  route.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  route.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {route.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    <span className="text-white">{route.origin?.name || 'Unknown Origin'}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-green-400" />
                    <span className="text-white">{route.destination?.name || 'Unknown Destination'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-white">{route.totalTime || 0}h</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-white">${(route.totalCost || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    setCurrentRoute(route);
                    setShowModal(true);
                  }}
                  className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setCurrentRoute(route);
                    setShowModal(true);
                  }}
                  className="p-2 text-green-400 hover:text-green-300 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {routes.length === 0 && (
          <div className="text-center py-12">
            <Route className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">No routes found</h3>
            <p className="text-gray-500">Create your first route to get started</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setCurrentRoute(null);
        }}
        title={currentRoute?.id ? 'Edit Route' : 'Create New Route'}
        size="lg"
      >
        {currentRoute && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Route Name</label>
                <input
                  type="text"
                  value={currentRoute.name}
                  onChange={(e) => setCurrentRoute({ ...currentRoute, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter route name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Mode</label>
                <select
                  value={currentRoute.mode}
                  onChange={(e) => setCurrentRoute({ ...currentRoute, mode: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sea">Sea</option>
                  <option value="air">Air</option>
                  <option value="road">Road</option>
                  <option value="rail">Rail</option>
                  <option value="multimodal">Multimodal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Description</label>
              <textarea
                value={currentRoute.description}
                onChange={(e) => setCurrentRoute({ ...currentRoute, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Route description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span>Origin</span>
                </h3>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Supplier</label>
                  <select
                    value={currentRoute.origin.id}
                    onChange={(e) => {
                      const supplier = suppliers.find(s => s.id === e.target.value);
                      setCurrentRoute({
                        ...currentRoute,
                        origin: { 
                          ...currentRoute.origin, 
                          id: e.target.value,
                          name: supplier?.name || ''
                        }
                      });
                    }}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name} - {supplier.country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-green-400" />
                  <span>Destination</span>
                </h3>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Customer</label>
                  <select
                    value={currentRoute.destination.id}
                    onChange={(e) => {
                      const customer = customers.find(c => c.id === e.target.value);
                      setCurrentRoute({
                        ...currentRoute,
                        destination: { 
                          ...currentRoute.destination, 
                          id: e.target.value,
                          name: customer?.name || ''
                        }
                      });
                    }}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Total Time (hours)</label>
                <input
                  type="number"
                  value={currentRoute.totalTime}
                  onChange={(e) => setCurrentRoute({ ...currentRoute, totalTime: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Total Cost ($)</label>
                <input
                  type="number"
                  value={currentRoute.totalCost}
                  onChange={(e) => setCurrentRoute({ ...currentRoute, totalCost: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setCurrentRoute(null);
                }}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveRoute}
                disabled={loading || !currentRoute.name}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : 'Save Route'}</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
