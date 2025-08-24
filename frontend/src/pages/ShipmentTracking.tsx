import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Truck, Ship, Plane, Train, Package, Clock, AlertTriangle, 
  CheckCircle, MapPin, TrendingUp, Calendar, Users, Navigation,
  Eye, EyeOff, RefreshCw, Filter, Search
} from 'lucide-react';
import { shipmentsAPI, suppliersAPI, customersAPI } from '../services/api';
// Define types locally to avoid import issues
interface ShipmentLocation {
  id: string;
  shipmentId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  status: string;
  speed?: number;
  heading?: number;
}

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

// Generate mock location data for shipments (in real app, this would come from GPS tracking)
const generateMockLocation = (shipment: Shipment) => {
  // Generate coordinates based on shipment ID for consistency
  const seed = parseInt(shipment.id.replace(/[^0-9]/g, '')) || 0;
  const baseLat = 25.2048 + (seed % 10) * 0.1;
  const baseLng = 55.2708 + (seed % 10) * 0.1;
  
  return {
    latitude: baseLat + (Math.random() - 0.5) * 0.01,
    longitude: baseLng + (Math.random() - 0.5) * 0.01,
    speed: Math.floor(Math.random() * 80) + 20,
    heading: Math.floor(Math.random() * 360),
    timestamp: new Date().toISOString()
  };
};

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different transport modes
const createCustomIcon = (mode: string) => {
  const iconColors = {
    sea: '#3b82f6',
    air: '#8b5cf6',
    road: '#10b981',
    rail: '#f59e0b'
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${iconColors[mode as keyof typeof iconColors] || '#6b7280'};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 10px;
        font-weight: bold;
      ">
        ${mode === 'sea' ? '🚢' : mode === 'air' ? '✈️' : mode === 'road' ? '🚛' : '🚂'}
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Component to handle map updates
function MapUpdater({ shipments }: { shipments: Shipment[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (shipments.length > 0) {
      const locations = shipments.map(s => {
        const location = generateMockLocation(s);
        return [location.latitude, location.longitude] as [number, number];
      });
      
      if (locations.length > 0) {
        const bounds = L.latLngBounds(locations);
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [shipments, map]);

  return null;
}

export default function ShipmentTracking() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [showAllMarkers, setShowAllMarkers] = useState(true);
  const [filterMode, setFilterMode] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [shipmentsData, suppliersData, customersData] = await Promise.all([
          shipmentsAPI.getAll(),
          suppliersAPI.getAll(),
          customersAPI.getAll(),
        ]);

        // Enrich shipments with supplier and customer data
        const enrichedShipments = shipmentsData.map((shipment: Shipment) => ({
          ...shipment,
          supplier: suppliersData.find((s: any) => s.id === shipment.supplierId),
          customer: customersData.find((c: any) => c.id === shipment.customerId),
        }));

        setShipments(enrichedShipments);
        setSuppliers(suppliersData);
        setCustomers(customersData);
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
        const [shipmentsData, suppliersData, customersData] = await Promise.all([
          shipmentsAPI.getAll(),
          suppliersAPI.getAll(),
          customersAPI.getAll(),
        ]);

        const enrichedShipments = shipmentsData.map((shipment: Shipment) => ({
          ...shipment,
          supplier: suppliersData.find((s: any) => s.id === shipment.supplierId),
          customer: customersData.find((c: any) => c.id === shipment.customerId),
        }));

        setShipments(enrichedShipments);
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

  const filteredShipments = shipments.filter(shipment => {
    const matchesMode = filterMode === 'all' || shipment.mode === filterMode;
    const matchesSearch = searchTerm === '' || 
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customer?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesMode && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in_transit': return 'text-blue-400';
      case 'delayed': return 'text-red-400';
      case 'planned': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore < 30) return 'text-green-400';
    if (riskScore < 60) return 'text-yellow-400';
    return 'text-red-400';
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
      <div className="min-h-screen bg-black text-white p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-400 mb-2">Error Loading Data</h2>
            <p className="text-gray-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-400 mb-2">Shipment Tracking</h1>
        <p className="text-gray-400">Real-time tracking of all shipments across the supply chain</p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search shipments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filter by Mode */}
        <select
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value)}
          className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Modes</option>
          <option value="sea">Sea</option>
          <option value="air">Air</option>
          <option value="road">Road</option>
          <option value="rail">Rail</option>
        </select>

        {/* Toggle Markers */}
        <button
          onClick={() => setShowAllMarkers(!showAllMarkers)}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white hover:bg-gray-800 focus:outline-none focus:border-blue-500"
        >
          {showAllMarkers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span>{showAllMarkers ? 'Hide Markers' : 'Show Markers'}</span>
        </button>

        {/* Auto Refresh */}
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border focus:outline-none focus:border-blue-500 ${
            autoRefresh 
              ? 'bg-blue-600 border-blue-500 text-white' 
              : 'bg-gray-900 border-gray-700 text-white hover:bg-gray-800'
          }`}
        >
          <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
          <span>Auto Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div className="h-96 rounded-lg overflow-hidden">
              <MapContainer
                center={[25.2048, 55.2708]}
                zoom={4}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {showAllMarkers && filteredShipments.map((shipment) => {
                  const location = generateMockLocation(shipment);
                  return (
                    <Marker
                      key={shipment.id}
                      position={[location.latitude, location.longitude]}
                      icon={createCustomIcon(shipment.mode)}
                      eventHandlers={{
                        click: () => setSelectedShipment(shipment)
                      }}
                    >
                      <Popup>
                        <div className="text-black">
                          <h3 className="font-bold text-lg">{shipment.id}</h3>
                          <p className="text-sm text-gray-600">
                            {shipment.supplier?.name} → {shipment.customer?.name}
                          </p>
                          <p className="text-sm">
                            Status: <span className={getStatusColor(shipment.status)}>{shipment.status}</span>
                          </p>
                          <p className="text-sm">
                            ETA: {new Date(shipment.ETA).toLocaleDateString()}
                          </p>
                          <p className="text-sm">
                            Speed: {location.speed} km/h
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
                
                <MapUpdater shipments={filteredShipments} />
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Shipment List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-blue-400">Active Shipments</h2>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredShipments.map((shipment) => (
              <div
                key={shipment.id}
                onClick={() => setSelectedShipment(shipment)}
                className={`p-4 bg-gray-900 border rounded-lg cursor-pointer transition-all hover:bg-gray-800 ${
                  selectedShipment?.id === shipment.id 
                    ? 'border-blue-500 bg-blue-900/20' 
                    : 'border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getModeIcon(shipment.mode)}
                    <span className="font-semibold text-white">{shipment.id}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                    {shipment.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="text-sm text-gray-400 space-y-1">
                  <p>{shipment.supplier?.name} → {shipment.customer?.name}</p>
                  <p>ETA: {new Date(shipment.ETA).toLocaleDateString()}</p>
                  <p>Risk: <span className={getRiskColor(shipment.riskScore)}>{shipment.riskScore}%</span></p>
                  
                  <div className="flex items-center space-x-1 text-xs">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {generateMockLocation(shipment).latitude.toFixed(4)}, {generateMockLocation(shipment).longitude.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Shipment Details */}
      {selectedShipment && (
        <div className="mt-6 bg-gray-900 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-blue-400">
              Shipment Details: {selectedShipment.id}
            </h2>
            <button
              onClick={() => setSelectedShipment(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Route</h3>
              <p className="text-white">{selectedShipment.supplier?.name}</p>
              <p className="text-gray-400 text-sm">→</p>
              <p className="text-white">{selectedShipment.customer?.name}</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Transport Mode</h3>
              <div className="flex items-center space-x-2">
                {getModeIcon(selectedShipment.mode)}
                <span className="text-white capitalize">{selectedShipment.mode}</span>
              </div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Timeline</h3>
              <p className="text-white text-sm">Departure: {new Date(selectedShipment.departureTime).toLocaleDateString()}</p>
              <p className="text-white text-sm">ETA: {new Date(selectedShipment.ETA).toLocaleDateString()}</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Status & Risk</h3>
              <p className={`text-sm ${getStatusColor(selectedShipment.status)}`}>
                {selectedShipment.status.replace('_', ' ')}
              </p>
              <p className={`text-sm ${getRiskColor(selectedShipment.riskScore)}`}>
                Risk: {selectedShipment.riskScore}%
              </p>
            </div>
          </div>
          
          <div className="mt-4 bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Current Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Coordinates:</span>
                <p className="text-white">
                  {generateMockLocation(selectedShipment).latitude.toFixed(6)}, {generateMockLocation(selectedShipment).longitude.toFixed(6)}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Last Update:</span>
                <p className="text-white">
                  {new Date().toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Speed:</span>
                <p className="text-white">{generateMockLocation(selectedShipment).speed} km/h</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
