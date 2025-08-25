import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Truck, Ship, Plane, Train, Package, Clock, AlertTriangle, 
  CheckCircle, MapPin, TrendingUp, Calendar, Users, Navigation,
  Eye, EyeOff, RefreshCw, Filter, Search, Route, Globe, Info
} from 'lucide-react';
import { shipmentsAPI } from '../services/api';

// Define types based on the API response
interface Route {
  id: string;
  shipmentId: string;
  fromLocationType: string;
  toLocationType: string;
  sequenceNumber: number;
  mode: string;
  carrierName: string;
  travelTimeEst: number;
  costEst: number;
  fromLocation: string;
  toLocation: string;
}

interface Supplier {
  id: string;
  name: string;
  country: string;
  industry: string;
  reliabilityScore: number;
}

interface Customer {
  id: string;
  name: string;
  country: string;
  industry: string;
  demandForecast: number;
}

interface Shipment {
  id: string;
  supplierId: string;
  customerId: string;
  originLocationType: string;
  destinationLocationType: string;
  mode: string;
  departureTime: string;
  ETA: string;
  status: string;
  riskScore: number;
  destinationLocation: string;
  originLocation: string;
  supplier: Supplier;
  customer: Customer;
  routes: Route[];
  disruptions: any[];
}

// Mock location coordinates for different countries/cities
const locationCoordinates: { [key: string]: { lat: number; lng: number; name: string } } = {
  'India': { lat: 20.5937, lng: 78.9629, name: 'India' },
  'China': { lat: 35.8617, lng: 104.1954, name: 'China' },
  'Gujrat, India': { lat: 22.2587, lng: 71.1924, name: 'Gujarat, India' },
  'Guangdong, China': { lat: 23.1291, lng: 113.2644, name: 'Guangdong, China' },
  'Indore': { lat: 22.7196, lng: 75.8577, name: 'Indore, India' },
  'Mumbai': { lat: 19.0760, lng: 72.8777, name: 'Mumbai, India' },
  'Chennai': { lat: 13.0827, lng: 80.2707, name: 'Chennai, India' },
  'Gyanendra Singh': { lat: 22.2587, lng: 71.1924, name: 'Gujarat, India' },
  'Harsh Baghel': { lat: 23.1291, lng: 113.2644, name: 'Guangdong, China' },
};

// Generate coordinates for locations
const getLocationCoordinates = (locationName: string) => {
  // Try exact match first
  if (locationCoordinates[locationName]) {
    return locationCoordinates[locationName];
  }
  
  // Try partial matches
  for (const [key, coords] of Object.entries(locationCoordinates)) {
    if (locationName.includes(key) || key.includes(locationName)) {
      return coords;
    }
  }
  
  // Default fallback
  return { lat: 20.5937, lng: 78.9629, name: locationName };
};

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different transport modes
const createCustomIcon = (mode: string, isActive: boolean = false) => {
  const iconColors = {
    sea: isActive ? '#1d4ed8' : '#3b82f6',
    air: isActive ? '#7c3aed' : '#8b5cf6',
    road: isActive ? '#059669' : '#10b981',
    rail: isActive ? '#d97706' : '#f59e0b'
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${iconColors[mode as keyof typeof iconColors] || '#6b7280'};
        width: ${isActive ? '24px' : '20px'};
        height: ${isActive ? '24px' : '20px'};
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: ${isActive ? '12px' : '10px'};
        font-weight: bold;
        animation: ${isActive ? 'pulse 2s infinite' : 'none'};
      ">
        ${mode === 'sea' ? '🚢' : mode === 'air' ? '✈️' : mode === 'road' ? '🚛' : '🚂'}
      </div>
    `,
    iconSize: [isActive ? 24 : 20, isActive ? 24 : 20],
    iconAnchor: [isActive ? 12 : 10, isActive ? 12 : 10]
  });
};

// Component to handle map updates
function MapUpdater({ shipments, selectedShipment }: { shipments: Shipment[]; selectedShipment: Shipment | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (shipments.length > 0) {
      const allCoordinates: [number, number][] = [];
      
      shipments.forEach(shipment => {
        // Add origin and destination coordinates
        const originCoords = getLocationCoordinates(shipment.originLocation);
        const destCoords = getLocationCoordinates(shipment.destinationLocation);
        
        allCoordinates.push([originCoords.lat, originCoords.lng]);
        allCoordinates.push([destCoords.lat, destCoords.lng]);
        
        // Add route coordinates
        shipment.routes.forEach(route => {
          const fromCoords = getLocationCoordinates(route.fromLocation);
          const toCoords = getLocationCoordinates(route.toLocation);
          
          allCoordinates.push([fromCoords.lat, fromCoords.lng]);
          allCoordinates.push([toCoords.lat, toCoords.lng]);
        });
      });
      
      if (allCoordinates.length > 0) {
        const bounds = L.latLngBounds(allCoordinates);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [shipments, selectedShipment, map]);

  return null;
}

export default function ShipmentTracking() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [showAllMarkers, setShowAllMarkers] = useState(true);
  const [filterMode, setFilterMode] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShortestRoute, setShowShortestRoute] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const shipmentsData = await shipmentsAPI.getAll();
        setShipments(shipmentsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load shipments');
        console.error('Error loading shipments:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Set up auto-refresh
  useEffect(() => {
    if (!autoRefresh) {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      return;
    }

    refreshIntervalRef.current = setInterval(async () => {
      try {
        const shipmentsData = await shipmentsAPI.getAll();
        setShipments(shipmentsData);
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    }, 30000); // Refresh every 30 seconds

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [autoRefresh]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in_transit': return 'text-blue-400';
      case 'delayed': return 'text-red-400';
      case 'planned': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_transit': return <Navigation className="h-4 w-4" />;
      case 'delayed': return <AlertTriangle className="h-4 w-4" />;
      case 'planned': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      shipment.supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.originLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destinationLocation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterMode === 'all' || shipment.status === filterMode;
    
    return matchesSearch && matchesFilter;
  });

  const calculateTotalDistance = (routes: Route[]) => {
    let totalDistance = 0;
    routes.forEach(route => {
      const fromCoords = getLocationCoordinates(route.fromLocation);
      const toCoords = getLocationCoordinates(route.toLocation);
      
      // Simple distance calculation (Haversine formula would be more accurate)
      const latDiff = Math.abs(toCoords.lat - fromCoords.lat);
      const lngDiff = Math.abs(toCoords.lng - fromCoords.lng);
      totalDistance += Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // Rough km conversion
    });
    return Math.round(totalDistance);
  };

  const calculateTotalCost = (routes: Route[]) => {
    return routes.reduce((total, route) => total + route.costEst, 0);
  };

  const calculateTotalTime = (routes: Route[]) => {
    return routes.reduce((total, route) => total + route.travelTimeEst, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading shipments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-4" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Shipment Tracking</h1>
              <p className="text-gray-400">Real-time tracking of all shipments and routes</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  autoRefresh ? 'bg-green-600 text-white' : 'bg-white/10 text-gray-400'
                }`}
              >
                <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                <span>Auto-refresh</span>
              </button>
              <button
                onClick={() => setShowShortestRoute(!showShortestRoute)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  showShortestRoute ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400'
                }`}
              >
                <Route className="h-4 w-4" />
                <span>Shortest Route</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Controls */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search shipments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="planned">Planned</option>
            <option value="in_transit">In Transit</option>
            <option value="delayed">Delayed</option>
            <option value="completed">Completed</option>
          </select>
          
          <button
            onClick={() => setShowAllMarkers(!showAllMarkers)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
          >
            {showAllMarkers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showAllMarkers ? 'Hide All' : 'Show All'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shipments List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Shipments ({filteredShipments.length})</span>
              </h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredShipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    onClick={() => setSelectedShipment(selectedShipment?.id === shipment.id ? null : shipment)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedShipment?.id === shipment.id
                        ? 'bg-blue-600/20 border-blue-500'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(shipment.status)}
                        <span className={`text-sm font-medium ${getStatusColor(shipment.status)}`}>
                          {shipment.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">#{shipment.id.slice(-8)}</span>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3 text-blue-400" />
                        <span className="text-white">{shipment.originLocation}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3 text-green-400" />
                        <span className="text-white">{shipment.destinationLocation}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                      <span>{shipment.routes.length} routes</span>
                      <span>Risk: {shipment.riskScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
              <MapContainer
                center={[20.5937, 78.9629]}
                zoom={4}
                style={{ height: '600px', width: '100%' }}
                ref={mapRef}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                <MapUpdater shipments={filteredShipments} selectedShipment={selectedShipment} />
                
                {/* Render all shipments */}
                {showAllMarkers && filteredShipments.map((shipment) => {
                  const originCoords = getLocationCoordinates(shipment.originLocation);
                  const destCoords = getLocationCoordinates(shipment.destinationLocation);
                  const isSelected = selectedShipment?.id === shipment.id;
                  
                  return (
                    <React.Fragment key={shipment.id}>
                      {/* Origin Marker */}
                      <Marker
                        position={[originCoords.lat, originCoords.lng]}
                        icon={createCustomIcon('road', isSelected)}
                      >
                        <Popup>
                          <div className="text-black">
                            <h3 className="font-bold">Origin</h3>
                            <p>{shipment.originLocation}</p>
                            <p className="text-sm text-gray-600">Supplier: {shipment.supplier.name}</p>
                          </div>
                        </Popup>
                      </Marker>
                      
                      {/* Destination Marker */}
                      <Marker
                        position={[destCoords.lat, destCoords.lng]}
                        icon={createCustomIcon('road', isSelected)}
                      >
                        <Popup>
                          <div className="text-black">
                            <h3 className="font-bold">Destination</h3>
                            <p>{shipment.destinationLocation}</p>
                            <p className="text-sm text-gray-600">Customer: {shipment.customer.name}</p>
                          </div>
                        </Popup>
                      </Marker>
                      
                      {/* Route Lines */}
                      {shipment.routes.map((route, index) => {
                        const fromCoords = getLocationCoordinates(route.fromLocation);
                        const toCoords = getLocationCoordinates(route.toLocation);
                        
                        return (
                          <React.Fragment key={route.id}>
                            {/* Route Line */}
                            <Polyline
                              positions={[
                                [fromCoords.lat, fromCoords.lng],
                                [toCoords.lat, toCoords.lng]
                              ]}
                              color={isSelected ? '#3b82f6' : '#6b7280'}
                              weight={isSelected ? 4 : 2}
                              opacity={isSelected ? 0.8 : 0.4}
                            />
                            
                            {/* Route Markers */}
                            <Marker
                              position={[fromCoords.lat, fromCoords.lng]}
                              icon={createCustomIcon(route.mode, isSelected)}
                            >
                              <Popup>
                                <div className="text-black">
                                  <h3 className="font-bold">Route {route.sequenceNumber}</h3>
                                  <p><strong>From:</strong> {route.fromLocation}</p>
                                  <p><strong>To:</strong> {route.toLocation}</p>
                                  <p><strong>Mode:</strong> {route.mode.toUpperCase()}</p>
                                  <p><strong>Carrier:</strong> {route.carrierName}</p>
                                  <p><strong>Time:</strong> {route.travelTimeEst}h</p>
                                  <p><strong>Cost:</strong> ${route.costEst}</p>
                                </div>
                              </Popup>
                            </Marker>
                            
                            <Marker
                              position={[toCoords.lat, toCoords.lng]}
                              icon={createCustomIcon(route.mode, isSelected)}
                            >
                              <Popup>
                                <div className="text-black">
                                  <h3 className="font-bold">Route {route.sequenceNumber}</h3>
                                  <p><strong>From:</strong> {route.fromLocation}</p>
                                  <p><strong>To:</strong> {route.toLocation}</p>
                                  <p><strong>Mode:</strong> {route.mode.toUpperCase()}</p>
                                  <p><strong>Carrier:</strong> {route.carrierName}</p>
                                  <p><strong>Time:</strong> {route.travelTimeEst}h</p>
                                  <p><strong>Cost:</strong> ${route.costEst}</p>
                                </div>
                              </Popup>
                            </Marker>
                          </React.Fragment>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Selected Shipment Details */}
        {selectedShipment && (
          <div className="mt-6 bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Info className="h-5 w-5" />
                <span>Shipment Details</span>
              </h2>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedShipment.status)}`}>
                  {selectedShipment.status.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-xs text-gray-400">Risk: {selectedShipment.riskScore}%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Supplier</h3>
                <p className="text-white">{selectedShipment.supplier.name}</p>
                <p className="text-sm text-gray-400">{selectedShipment.supplier.country}</p>
                <p className="text-xs text-gray-500">Reliability: {selectedShipment.supplier.reliabilityScore}%</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Customer</h3>
                <p className="text-white">{selectedShipment.customer.name}</p>
                <p className="text-sm text-gray-400">{selectedShipment.customer.country}</p>
                <p className="text-xs text-gray-500">Demand: {selectedShipment.customer.demandForecast}%</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Timeline</h3>
                <p className="text-white">Departure: {new Date(selectedShipment.departureTime).toLocaleDateString()}</p>
                <p className="text-white">ETA: {new Date(selectedShipment.ETA).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Summary</h3>
                <p className="text-white">Total Distance: {calculateTotalDistance(selectedShipment.routes)} km</p>
                <p className="text-white">Total Cost: ${calculateTotalCost(selectedShipment.routes).toLocaleString()}</p>
                <p className="text-white">Total Time: {calculateTotalTime(selectedShipment.routes)}h</p>
              </div>
            </div>
            
            {/* Route Details */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Route className="h-5 w-5" />
                <span>Route Segments ({selectedShipment.routes.length})</span>
              </h3>
              
              <div className="space-y-3">
                {selectedShipment.routes.map((route, index) => (
                  <div key={route.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
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
                      <span className="text-sm text-gray-400">{route.carrierName}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-blue-400" />
                        <span className="text-white">{route.fromLocation}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <Navigation className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-green-400" />
                        <span className="text-white">{route.toLocation}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-white">{route.travelTimeEst}h</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-gray-400" />
                        <span className="text-white">${route.costEst}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-white">{route.fromLocationType} → {route.toLocationType}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
