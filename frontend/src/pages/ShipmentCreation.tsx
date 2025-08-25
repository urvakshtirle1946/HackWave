import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Save, ArrowRight, Truck, Ship, Plane, Train,
  Clock, DollarSign, MapPin, Navigation, Package, Users
} from 'lucide-react';
import { 
  shipmentsAPI, suppliersAPI, customersAPI, routesAPI 
} from '../services/api';
import Modal from '../components/Modal';

interface RouteSegment {
  id?: string;
  fromLocationType: string;
  fromLocation: string;
  toLocationType: string;
  toLocation: string;
  sequenceNumber: number;
  mode: string;
  carrierName: string;
  travelTimeEst: number;
  costEst: number;
}

interface ShipmentForm {
  supplierId: string;
  customerId: string;
  originLocationType: string;
  originLocation: string;
  destinationLocationType: string;
  destinationLocation: string;
  mode: string;
  departureTime: string;
  ETA: string;
  status: string;
  riskScore?: number;
  routes: RouteSegment[];
}

interface Supplier {
  id: string;
  name: string;
  country: string;
}

interface Customer {
  id: string;
  name: string;
  country: string;
}

export default function ShipmentCreation() {
  const [shipment, setShipment] = useState<ShipmentForm>({
    supplierId: '',
    customerId: '',
    originLocationType: 'supplier',
    originLocation: '',
    destinationLocationType: 'customer',
    destinationLocation: '',
    mode: 'multimodal',
    departureTime: '',
    ETA: '',
    status: 'planned',
    riskScore: 0,
    routes: []
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteSegment | null>(null);
  const [routeIndex, setRouteIndex] = useState<number>(-1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [suppliersData, customersData] = await Promise.all([
        suppliersAPI.getAll(),
        customersAPI.getAll(),
      ]);
      
      setSuppliers(suppliersData);
      setCustomers(customersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const addRoute = () => {
    const previousRoute = shipment.routes[shipment.routes.length - 1];
    const newRoute: RouteSegment = {
      fromLocationType: previousRoute ? previousRoute.toLocationType : 'supplier',
      fromLocation: previousRoute ? previousRoute.toLocation : '',
      toLocationType: 'port',
      toLocation: '',
      sequenceNumber: shipment.routes.length + 1,
      mode: 'sea',
      carrierName: '',
      travelTimeEst: 0,
      costEst: 0
    };
    setEditingRoute(newRoute);
    setRouteIndex(-1);
    setShowRouteModal(true);
  };

  const editRoute = (index: number) => {
    setEditingRoute({ ...shipment.routes[index] });
    setRouteIndex(index);
    setShowRouteModal(true);
  };

  const deleteRoute = (index: number) => {
    const updatedRoutes = shipment.routes.filter((_, i) => i !== index);
    // Reorder sequence numbers and update from locations
    const reorderedRoutes: RouteSegment[] = [];
    
    updatedRoutes.forEach((route, i) => {
      if (i === 0) {
        // First route - keep original from location
        reorderedRoutes.push({
          ...route,
          sequenceNumber: i + 1
        });
      } else {
        // Update from location to match previous route's to location
        const previousRoute = reorderedRoutes[i - 1];
        reorderedRoutes.push({
          ...route,
          sequenceNumber: i + 1,
          fromLocationType: previousRoute.toLocationType,
          fromLocation: previousRoute.toLocation
        });
      }
    });
    
    setShipment({ ...shipment, routes: reorderedRoutes });
  };

  const saveRoute = () => {
    if (!editingRoute) return;

    const updatedRoutes = [...shipment.routes];
    
    if (routeIndex >= 0) {
      // Editing existing route
      updatedRoutes[routeIndex] = editingRoute;
    } else {
      // Adding new route
      updatedRoutes.push({
        ...editingRoute,
        sequenceNumber: updatedRoutes.length + 1
      });
    }

    setShipment({ ...shipment, routes: updatedRoutes });
    setShowRouteModal(false);
    setEditingRoute(null);
    setRouteIndex(-1);
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

  const calculateRouteRisk = (route: RouteSegment) => {
    let routeRisk = 0;
    
    // Base risk by transport mode
    switch (route.mode) {
      case 'sea':
        routeRisk += 25;
        break;
      case 'air':
        routeRisk += 15;
        break;
      case 'road':
        routeRisk += 20;
        break;
      case 'rail':
        routeRisk += 10;
        break;
      default:
        routeRisk += 15;
    }
    
    // Risk based on travel time
    if (route.travelTimeEst > 72) routeRisk += 20;
    else if (route.travelTimeEst > 48) routeRisk += 15;
    else if (route.travelTimeEst > 24) routeRisk += 10;
    
    // Risk based on cost
    if (route.costEst > 10000) routeRisk -= 10;
    else if (route.costEst < 1000) routeRisk += 10;
    
    // Risk based on location types
    if (route.fromLocationType === 'port' || route.toLocationType === 'port') {
      routeRisk += 5;
    }
    if (route.fromLocationType === 'warehouse' || route.toLocationType === 'warehouse') {
      routeRisk -= 5;
    }
    
    return Math.max(0, Math.min(100, routeRisk));
  };

  const getRiskColor = (risk: number) => {
    if (risk < 30) return 'text-green-400';
    if (risk < 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const calculateTotalTime = () => {
    return shipment.routes.reduce((total, route) => total + route.travelTimeEst, 0);
  };

  const calculateTotalCost = () => {
    return shipment.routes.reduce((total, route) => total + route.costEst, 0);
  };

  const calculateRiskScore = () => {
    if (shipment.routes.length === 0) return 0;
    
    let totalRisk = 0;
    let routeCount = 0;
    
    shipment.routes.forEach(route => {
      let routeRisk = 0;
      
      // Base risk by transport mode
      switch (route.mode) {
        case 'sea':
          routeRisk += 25; // Higher risk due to weather, piracy, port congestion
          break;
        case 'air':
          routeRisk += 15; // Lower risk but expensive
          break;
        case 'road':
          routeRisk += 20; // Medium risk due to traffic, accidents
          break;
        case 'rail':
          routeRisk += 10; // Lower risk, reliable
          break;
        default:
          routeRisk += 15;
      }
      
      // Risk based on travel time (longer routes = higher risk)
      if (route.travelTimeEst > 72) routeRisk += 20; // > 3 days
      else if (route.travelTimeEst > 48) routeRisk += 15; // > 2 days
      else if (route.travelTimeEst > 24) routeRisk += 10; // > 1 day
      
      // Risk based on cost (higher cost might indicate premium service = lower risk)
      if (route.costEst > 10000) routeRisk -= 10; // Premium service
      else if (route.costEst < 1000) routeRisk += 10; // Budget service
      
      // Risk based on location types
      if (route.fromLocationType === 'port' || route.toLocationType === 'port') {
        routeRisk += 5; // Ports can have congestion
      }
      if (route.fromLocationType === 'warehouse' || route.toLocationType === 'warehouse') {
        routeRisk -= 5; // Warehouses are more controlled
      }
      
      // Ensure risk is within bounds
      routeRisk = Math.max(0, Math.min(100, routeRisk));
      
      totalRisk += routeRisk;
      routeCount++;
    });
    
    return routeCount > 0 ? Math.round(totalRisk / routeCount) : 0;
  };

  const createShipment = async () => {
    try {
      setLoading(true);
      
      // Calculate risk score based on routes
      const calculatedRiskScore = calculateRiskScore();
      
      // Create the shipment first
      const shipmentData = {
        supplierId: shipment.supplierId,
        customerId: shipment.customerId,
        originLocationType: shipment.originLocationType,
        originLocation: shipment.originLocation,
        destinationLocationType: shipment.destinationLocationType,
        destinationLocation: shipment.destinationLocation,
        mode: shipment.mode,
        departureTime: shipment.departureTime,
        ETA: shipment.ETA,
        status: shipment.status,
        riskScore: calculatedRiskScore
      };

      const createdShipment = await shipmentsAPI.create(shipmentData);

      // Create routes for the shipment
      for (const route of shipment.routes) {
        await routesAPI.create({
          ...route,
          shipmentId: createdShipment.id
        });
      }

      // Reset form
      setShipment({
        supplierId: '',
        customerId: '',
        originLocationType: 'supplier',
        originLocation: '',
        destinationLocationType: 'customer',
        destinationLocation: '',
        mode: 'multimodal',
        departureTime: '',
        ETA: '',
        status: 'planned',
        routes: []
      });

      alert('Shipment created successfully!');
    } catch (error) {
      console.error('Error creating shipment:', error);
      alert('Error creating shipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Multi-Route Shipment</h1>
          <p className="text-gray-400">Define a shipment with multiple route segments and carriers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipment Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Shipment Details</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Supplier</label>
                  <select
                    value={shipment.supplierId}
                    onChange={(e) => {
                      const supplier = suppliers.find(s => s.id === e.target.value);
                      setShipment({
                        ...shipment,
                        supplierId: e.target.value,
                        originLocation: supplier?.name || ''
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

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Customer</label>
                  <select
                    value={shipment.customerId}
                    onChange={(e) => {
                      const customer = customers.find(c => c.id === e.target.value);
                      setShipment({
                        ...shipment,
                        customerId: e.target.value,
                        destinationLocation: customer?.name || ''
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

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Departure Time</label>
                  <input
                    type="datetime-local"
                    value={shipment.departureTime}
                    onChange={(e) => setShipment({ ...shipment, departureTime: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">ETA</label>
                  <input
                    type="datetime-local"
                    value={shipment.ETA}
                    onChange={(e) => setShipment({ ...shipment, ETA: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Status</label>
                  <select
                    value={shipment.status}
                    onChange={(e) => setShipment({ ...shipment, status: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="planned">Planned</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delayed">Delayed</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Route Segments */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <Navigation className="h-5 w-5" />
                  <span>Route Segments</span>
                </h2>
                <button
                  onClick={addRoute}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Route</span>
                </button>
              </div>

              {shipment.routes.length === 0 ? (
                <div className="text-center py-8">
                  <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No route segments defined</p>
                  <p className="text-gray-500 text-sm">Add route segments to define the shipment path</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {shipment.routes.map((route, index) => (
                    <div key={index}>
                      {index > 0 && (
                        <div className="flex justify-center mb-2">
                          <div className="w-px h-6 bg-blue-400/30"></div>
                        </div>
                      )}
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                              {route.sequenceNumber}
                            </span>
                            <div className="flex items-center space-x-2">
                              {getModeIcon(route.mode)}
                              <span className={`font-medium ${getModeColor(route.mode)}`}>
                                {route.mode.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => editRoute(index)}
                              className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <Navigation className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteRoute(index)}
                              className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-blue-400" />
                            <span className="text-white">{route.fromLocation}</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 mx-auto" />
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-green-400" />
                            <span className="text-white">{route.toLocation}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mt-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-white">{route.carrierName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-white">{route.travelTimeEst}h</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-white">${route.costEst.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400">Risk:</span>
                            <span className={`font-medium ${getRiskColor(calculateRouteRisk(route))}`}>
                              {calculateRouteRisk(route)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Segments:</span>
                  <span className="text-white font-medium">{shipment.routes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Time:</span>
                  <span className="text-white font-medium">{calculateTotalTime()}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Cost:</span>
                  <span className="text-white font-medium">${calculateTotalCost().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Risk Score:</span>
                  <span className={`font-medium ${
                    calculateRiskScore() < 30 ? 'text-green-400' :
                    calculateRiskScore() < 70 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {calculateRiskScore()}/100
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Risk is calculated based on transport mode, travel time, cost, and location types
                </div>
              </div>

              <button
                onClick={createShipment}
                disabled={loading || !shipment.supplierId || !shipment.customerId || shipment.routes.length === 0}
                className="w-full mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Creating...' : 'Create Shipment'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Route Modal */}
      <Modal
        isOpen={showRouteModal}
        onClose={() => {
          setShowRouteModal(false);
          setEditingRoute(null);
          setRouteIndex(-1);
        }}
        title={routeIndex >= 0 ? 'Edit Route Segment' : 'Add Route Segment'}
        size="lg"
      >
        {editingRoute && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">From Location Type</label>
                <select
                  value={editingRoute.fromLocationType}
                  onChange={(e) => setEditingRoute({ ...editingRoute, fromLocationType: e.target.value, fromLocation: '' })}
                  disabled={routeIndex === -1 && shipment.routes.length > 0}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="supplier">Supplier</option>
                  <option value="port">Port</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">From Location</label>
                <input
                  type="text"
                  value={editingRoute.fromLocation}
                  onChange={(e) => setEditingRoute({ ...editingRoute, fromLocation: e.target.value })}
                  disabled={routeIndex === -1 && shipment.routes.length > 0}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={routeIndex === -1 && shipment.routes.length > 0 ? "Auto-filled from previous route" : "Enter location name"}
                />
                {routeIndex === -1 && shipment.routes.length > 0 && (
                  <p className="text-xs text-blue-400 mt-1">Auto-filled from previous route's destination</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">To Location Type</label>
                <select
                  value={editingRoute.toLocationType}
                  onChange={(e) => setEditingRoute({ ...editingRoute, toLocationType: e.target.value, toLocation: '' })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="supplier">Supplier</option>
                  <option value="port">Port</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">To Location</label>
                <input
                  type="text"
                  value={editingRoute.toLocation}
                  onChange={(e) => setEditingRoute({ ...editingRoute, toLocation: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter location name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Transport Mode</label>
                <select
                  value={editingRoute.mode}
                  onChange={(e) => setEditingRoute({ ...editingRoute, mode: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sea">Sea</option>
                  <option value="air">Air</option>
                  <option value="road">Road</option>
                  <option value="rail">Rail</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Carrier Name</label>
                <input
                  type="text"
                  value={editingRoute.carrierName}
                  onChange={(e) => setEditingRoute({ ...editingRoute, carrierName: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter carrier name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Travel Time (hours)</label>
                <input
                  type="number"
                  min="0"
                  value={editingRoute.travelTimeEst}
                  onChange={(e) => setEditingRoute({ ...editingRoute, travelTimeEst: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Cost ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={editingRoute.costEst}
                  onChange={(e) => setEditingRoute({ ...editingRoute, costEst: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => {
                  setShowRouteModal(false);
                  setEditingRoute(null);
                  setRouteIndex(-1);
                }}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveRoute}
                disabled={!editingRoute.fromLocation || !editingRoute.toLocation || !editingRoute.carrierName}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {routeIndex >= 0 ? 'Update' : 'Add'} Route
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
