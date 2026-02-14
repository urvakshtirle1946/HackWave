import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Truck, Ship, Plane, Train, Package, Clock, AlertTriangle, 
  CheckCircle, MapPin, TrendingUp, Calendar, Users, Navigation,
  Eye, EyeOff, RefreshCw, Filter, Search, Route, Globe, Info
} from 'lucide-react';
import { shipmentTrackingApi } from '../services/shipmentTrackingApi';

// Import the Shipment type from the tracking API types
import type { Shipment as TrackingShipment } from '../types/shipmentTracking';

// Use the tracking API type
type Shipment = TrackingShipment;

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
  // Tracking API locations
  'Dubai, UAE': { lat: 25.2048, lng: 55.2708, name: 'Dubai, UAE' },
  'Hamburg, Germany': { lat: 53.5511, lng: 9.9937, name: 'Hamburg, Germany' },
  'New York, USA': { lat: 40.7128, lng: -74.0060, name: 'New York, USA' },
  'London, UK': { lat: 51.5074, lng: -0.1278, name: 'London, UK' },
  'Paris, France': { lat: 48.8566, lng: 2.3522, name: 'Paris, France' },
  'Berlin, Germany': { lat: 52.5200, lng: 13.4050, name: 'Berlin, Germany' },
  'Warsaw, Poland': { lat: 52.2297, lng: 21.0122, name: 'Warsaw, Poland' },
  'Tokyo, Japan': { lat: 35.6762, lng: 139.6503, name: 'Tokyo, Japan' },
  'Seattle, USA': { lat: 47.6062, lng: -122.3321, name: 'Seattle, USA' },
  'Sydney, Australia': { lat: -33.8688, lng: 151.2093, name: 'Sydney, Australia' },
  'Singapore': { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
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
        // Add origin and destination coordinates if available
        if (shipment.originLocation) {
          const originCoords = getLocationCoordinates(shipment.originLocation);
          allCoordinates.push([originCoords.lat, originCoords.lng]);
        }
        if (shipment.destinationLocation) {
          const destCoords = getLocationCoordinates(shipment.destinationLocation);
          allCoordinates.push([destCoords.lat, destCoords.lng]);
        }
        
        // Add current location if available
        if (shipment.currentLocation) {
          allCoordinates.push([shipment.currentLocation.latitude, shipment.currentLocation.longitude]);
        }
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
        
        const shipmentsData = await shipmentTrackingApi.getAllShipments();
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
        const shipmentsData = await shipmentTrackingApi.getAllShipments();
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
      (shipment.supplier?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shipment.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shipment.originLocation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shipment.destinationLocation || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterMode === 'all' || shipment.status === filterMode;
    
    return matchesSearch && matchesFilter;
  });

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
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
                      {shipment.originLocation && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3 text-blue-400" />
                          <span className="text-white">{shipment.originLocation}</span>
                        </div>
                      )}
                      {shipment.destinationLocation && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3 text-green-400" />
                          <span className="text-white">{shipment.destinationLocation}</span>
                        </div>
                      )}
                      {shipment.currentLocation && (
                        <div className="flex items-center space-x-2">
                          <Navigation className="h-3 w-3 text-yellow-400" />
                          <span className="text-white text-xs">Current: {shipment.currentLocation.latitude.toFixed(2)}, {shipment.currentLocation.longitude.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                      <span className="flex items-center space-x-1">
                        {getModeIcon(shipment.mode)}
                        <span>{shipment.mode}</span>
                      </span>
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
                  const isSelected = selectedShipment?.id === shipment.id;
                  const originCoords = shipment.originLocation ? getLocationCoordinates(shipment.originLocation) : null;
                  const destCoords = shipment.destinationLocation ? getLocationCoordinates(shipment.destinationLocation) : null;
                  
                  return (
                    <React.Fragment key={shipment.id}>
                      {/* Origin Marker */}
                      {originCoords && (
                        <Marker
                          position={[originCoords.lat, originCoords.lng]}
                          icon={createCustomIcon(shipment.mode, isSelected)}
                        >
                          <Popup>
                            <div className="text-black">
                              <h3 className="font-bold">Origin</h3>
                              <p>{shipment.originLocation}</p>
                              {shipment.supplier?.name && (
                                <p className="text-sm text-gray-600">Supplier: {shipment.supplier.name}</p>
                              )}
                            </div>
                          </Popup>
                        </Marker>
                      )}
                      
                      {/* Destination Marker */}
                      {destCoords && (
                        <Marker
                          position={[destCoords.lat, destCoords.lng]}
                          icon={createCustomIcon(shipment.mode, isSelected)}
                        >
                          <Popup>
                            <div className="text-black">
                              <h3 className="font-bold">Destination</h3>
                              <p>{shipment.destinationLocation}</p>
                              {shipment.customer?.name && (
                                <p className="text-sm text-gray-600">Customer: {shipment.customer.name}</p>
                              )}
                            </div>
                          </Popup>
                        </Marker>
                      )}
                      
                      {/* Current Location Marker */}
                      {shipment.currentLocation && (
                        <Marker
                          position={[shipment.currentLocation.latitude, shipment.currentLocation.longitude]}
                          icon={createCustomIcon(shipment.mode, isSelected)}
                        >
                          <Popup>
                            <div className="text-black">
                              <h3 className="font-bold">Current Location</h3>
                              <p className="text-sm">Status: {shipment.currentLocation.status}</p>
                              {shipment.currentLocation.speed && (
                                <p className="text-sm">Speed: {shipment.currentLocation.speed} km/h</p>
                              )}
                              <p className="text-xs text-gray-500">
                                Updated: {new Date(shipment.currentLocation.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </Popup>
                        </Marker>
                      )}
                      
                      {/* Route Line from Origin to Destination */}
                      {originCoords && destCoords && (
                        <Polyline
                          positions={[
                            [originCoords.lat, originCoords.lng],
                            [destCoords.lat, destCoords.lng]
                          ]}
                          color={isSelected ? '#3b82f6' : '#6b7280'}
                          weight={isSelected ? 3 : 2}
                          opacity={0.4}
                        />
                      )}
                      
                      {/* Route Line from Origin to Current Location */}
                      {originCoords && shipment.currentLocation && (
                        <Polyline
                          positions={[
                            [originCoords.lat, originCoords.lng],
                            [shipment.currentLocation.latitude, shipment.currentLocation.longitude]
                          ]}
                          color={isSelected ? '#10b981' : '#6b7280'}
                          weight={isSelected ? 3 : 2}
                          opacity={0.6}
                          dashArray="5, 5"
                        />
                      )}
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
                {selectedShipment.supplier?.name ? (
                  <p className="text-white">{selectedShipment.supplier.name}</p>
                ) : (
                  <p className="text-white text-sm">Supplier ID: {selectedShipment.supplierId}</p>
                )}
                {selectedShipment.originLocation && (
                  <p className="text-sm text-gray-400">{selectedShipment.originLocation}</p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Customer</h3>
                {selectedShipment.customer?.name ? (
                  <p className="text-white">{selectedShipment.customer.name}</p>
                ) : (
                  <p className="text-white text-sm">Customer ID: {selectedShipment.customerId}</p>
                )}
                {selectedShipment.destinationLocation && (
                  <p className="text-sm text-gray-400">{selectedShipment.destinationLocation}</p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Timeline</h3>
                <p className="text-white text-sm">Departure: {new Date(selectedShipment.departureTime).toLocaleString()}</p>
                <p className="text-white text-sm">ETA: {new Date(selectedShipment.ETA).toLocaleString()}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Summary</h3>
                <p className="text-white text-sm">Mode: {selectedShipment.mode.toUpperCase()}</p>
                <p className="text-white text-sm">Status: {selectedShipment.status.replace('_', ' ').toUpperCase()}</p>
                {selectedShipment.originLocation && selectedShipment.destinationLocation && (
                  <p className="text-white text-sm">
                    Distance: {(() => {
                      const origin = getLocationCoordinates(selectedShipment.originLocation);
                      const dest = getLocationCoordinates(selectedShipment.destinationLocation);
                      return calculateDistance(origin.lat, origin.lng, dest.lat, dest.lng);
                    })()} km
                  </p>
                )}
              </div>
            </div>
            
            {/* Current Location Details */}
            {selectedShipment.currentLocation && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Navigation className="h-5 w-5" />
                  <span>Current Location</span>
                </h3>
                
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1">Coordinates</p>
                      <p className="text-white">
                        {selectedShipment.currentLocation.latitude.toFixed(4)}, {selectedShipment.currentLocation.longitude.toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Status</p>
                      <p className="text-white">{selectedShipment.currentLocation.status.replace('_', ' ').toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Last Updated</p>
                      <p className="text-white">{new Date(selectedShipment.currentLocation.timestamp).toLocaleString()}</p>
                    </div>
                    {selectedShipment.currentLocation.speed !== undefined && (
                      <div>
                        <p className="text-gray-400 mb-1">Speed</p>
                        <p className="text-white">{selectedShipment.currentLocation.speed} km/h</p>
                      </div>
                    )}
                    {selectedShipment.currentLocation.heading !== undefined && (
                      <div>
                        <p className="text-gray-400 mb-1">Heading</p>
                        <p className="text-white">{selectedShipment.currentLocation.heading}°</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
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
