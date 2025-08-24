import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, Truck, Ship, Plane, Train, MapPin, Calendar, 
  Clock, AlertTriangle, CheckCircle, ArrowRight, Save,
  Plus, Trash2, Route, Building, User
} from 'lucide-react';
import { shipmentsAPI, suppliersAPI, customersAPI, portHubsAPI, warehousesAPI } from '../services/api';
import Modal from '../components/Modal';

interface ShipmentFormData {
  companyName: string;
  shipmentType: string;
  origin: { type: string; id: string; name: string; };
  destination: { type: string; id: string; name: string; };
  routeDefinition: { mode: string; stops: any[]; };
  goodsType: string;
  goodsDescription: string;
  weight: number;
  volume: number;
  expectedDeliveryDate: string;
  priority: string;
  specialRequirements: string;
  supplierId: string;
  customerId: string;
}

export default function ShipmentCreation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ShipmentFormData>({
    companyName: '',
    shipmentType: 'standard',
    origin: { type: 'supplier', id: '', name: '' },
    destination: { type: 'customer', id: '', name: '' },
    routeDefinition: { mode: 'multimodal', stops: [] },
    goodsType: '',
    goodsDescription: '',
    weight: 0,
    volume: 0,
    expectedDeliveryDate: '',
    priority: 'normal',
    specialRequirements: '',
    supplierId: '',
    customerId: ''
  });

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [portHubs, setPortHubs] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showRouteModal, setShowRouteModal] = useState(false);

  const totalSteps = 4;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [suppliersData, customersData, portHubsData, warehousesData] = await Promise.all([
        suppliersAPI.getAll(),
        customersAPI.getAll(),
        portHubsAPI.getAll(),
        warehousesAPI.getAll(),
      ]);
      setSuppliers(suppliersData);
      setCustomers(customersData);
      setPortHubs(portHubsData);
      setWarehouses(warehousesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const shipmentData = {
        supplierId: formData.supplierId,
        customerId: formData.customerId,
        originLocationType: formData.origin.type,
        originLocationId: formData.origin.id,
        destinationLocationType: formData.destination.type,
        destinationLocationId: formData.destination.id,
        mode: formData.routeDefinition.mode,
        departureTime: new Date().toISOString(),
        ETA: new Date(formData.expectedDeliveryDate).toISOString(),
        status: 'planned',
        riskScore: Math.floor(Math.random() * 30) + 10,
      };
      await shipmentsAPI.create(shipmentData);
      navigate('/app/shipment-tracking');
    } catch (error) {
      console.error('Error creating shipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => currentStep < totalSteps && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const getStepValidation = () => {
    switch (currentStep) {
      case 1: return formData.companyName && formData.supplierId && formData.customerId;
      case 2: return formData.origin.id && formData.destination.id;
      case 3: return formData.goodsType && formData.expectedDeliveryDate && formData.weight > 0;
      case 4: return true;
      default: return false;
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              i + 1 < currentStep ? 'bg-green-500 border-green-500 text-white' : 
              i + 1 === currentStep ? 'bg-blue-500 border-blue-500 text-white' : 
              'border-gray-400 text-gray-400'
            }`}>
              {i + 1 < currentStep ? <CheckCircle className="h-5 w-5" /> : i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div className={`w-20 h-1 mx-2 ${
                i + 1 < currentStep ? 'bg-green-500' : 'bg-gray-400'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-400">
        <span>Basic Info</span>
        <span>Route Planning</span>
        <span>Goods Details</span>
        <span>Review</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Company Name</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter company name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Shipment Type</label>
          <select
            value={formData.shipmentType}
            onChange={(e) => handleInputChange('shipmentType', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="standard">Standard</option>
            <option value="express">Express</option>
            <option value="fragile">Fragile</option>
            <option value="refrigerated">Refrigerated</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Supplier</label>
          <select
            value={formData.supplierId}
            onChange={(e) => handleInputChange('supplierId', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            value={formData.customerId}
            onChange={(e) => handleInputChange('customerId', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-400" />
            <span>Origin</span>
          </h3>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Location Type</label>
            <select
              value={formData.origin.type}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                origin: { ...prev.origin, type: e.target.value, id: '', name: '' }
              }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="supplier">Supplier</option>
              <option value="port">Port</option>
              <option value="warehouse">Warehouse</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Location</label>
            <select
              value={formData.origin.id}
              onChange={(e) => {
                let selectedLocation: any;
                if (formData.origin.type === 'supplier') {
                  selectedLocation = suppliers.find(s => s.id === e.target.value);
                } else if (formData.origin.type === 'port') {
                  selectedLocation = portHubs.find(p => p.id === e.target.value);
                } else if (formData.origin.type === 'warehouse') {
                  selectedLocation = warehouses.find(w => w.id === e.target.value);
                }
                
                setFormData(prev => ({
                  ...prev,
                  origin: { 
                    ...prev.origin, 
                    id: e.target.value,
                    name: selectedLocation?.name || ''
                  }
                }));
              }}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Location</option>
              {formData.origin.type === 'supplier' && suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} - {supplier.country}
                </option>
              ))}
              {formData.origin.type === 'port' && portHubs.map((port) => (
                <option key={port.id} value={port.id}>
                  {port.name} - {port.country}
                </option>
              ))}
              {formData.origin.type === 'warehouse' && warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name} - {warehouse.country}
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
            <label className="block text-sm font-medium text-white mb-2">Location Type</label>
            <select
              value={formData.destination.type}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                destination: { ...prev.destination, type: e.target.value, id: '', name: '' }
              }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="customer">Customer</option>
              <option value="port">Port</option>
              <option value="warehouse">Warehouse</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Location</label>
            <select
              value={formData.destination.id}
              onChange={(e) => {
                let selectedLocation: any;
                if (formData.destination.type === 'customer') {
                  selectedLocation = customers.find(c => c.id === e.target.value);
                } else if (formData.destination.type === 'port') {
                  selectedLocation = portHubs.find(p => p.id === e.target.value);
                } else if (formData.destination.type === 'warehouse') {
                  selectedLocation = warehouses.find(w => w.id === e.target.value);
                }
                
                setFormData(prev => ({
                  ...prev,
                  destination: { 
                    ...prev.destination, 
                    id: e.target.value,
                    name: selectedLocation?.name || ''
                  }
                }));
              }}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Location</option>
              {formData.destination.type === 'customer' && customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.country}
                </option>
              ))}
              {formData.destination.type === 'port' && portHubs.map((port) => (
                <option key={port.id} value={port.id}>
                  {port.name} - {port.country}
                </option>
              ))}
              {formData.destination.type === 'warehouse' && warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name} - {warehouse.country}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Goods Type</label>
          <input
            type="text"
            value={formData.goodsType}
            onChange={(e) => handleInputChange('goodsType', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Electronics, Clothing, Food"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Weight (kg)</label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Volume (m³)</label>
          <input
            type="number"
            value={formData.volume}
            onChange={(e) => handleInputChange('volume', parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Transport Mode</label>
          <select
            value={formData.routeDefinition.mode}
            onChange={(e) => handleInputChange('routeDefinition', { ...formData.routeDefinition, mode: e.target.value })}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="sea">Sea</option>
            <option value="air">Air</option>
            <option value="road">Road</option>
            <option value="rail">Rail</option>
            <option value="multimodal">Multimodal</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Expected Delivery Date</label>
          <input
            type="date"
            value={formData.expectedDeliveryDate}
            onChange={(e) => handleInputChange('expectedDeliveryDate', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Goods Description</label>
        <textarea
          value={formData.goodsDescription}
          onChange={(e) => handleInputChange('goodsDescription', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Detailed description of the goods being shipped..."
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Shipment Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Basic Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Company:</span>
                  <span className="text-white">{formData.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white capitalize">{formData.shipmentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Priority:</span>
                  <span className="text-white capitalize">{formData.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transport Mode:</span>
                  <span className="text-white capitalize">{formData.routeDefinition.mode}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Route</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Origin:</span>
                  <span className="text-white">{formData.origin.name || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Destination:</span>
                  <span className="text-white">{formData.destination.name || 'Not selected'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Goods Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white">{formData.goodsType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Weight:</span>
                  <span className="text-white">{formData.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Volume:</span>
                  <span className="text-white">{formData.volume} m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ETA:</span>
                  <span className="text-white">{formData.expectedDeliveryDate}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Parties</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Supplier:</span>
                  <span className="text-white">
                    {suppliers.find(s => s.id === formData.supplierId)?.name || 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Customer:</span>
                  <span className="text-white">
                    {customers.find(c => c.id === formData.customerId)?.name || 'Not selected'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {formData.goodsDescription && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Description</h4>
            <p className="text-sm text-white">{formData.goodsDescription}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Shipment</h1>
          <p className="text-gray-400">Set up a new shipment with detailed route planning and tracking</p>
        </div>

        {renderStepIndicator()}

        <div className="bg-white/5 rounded-lg p-8 border border-white/10">
          {renderCurrentStep()}

          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 text-white/70 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex space-x-4">
              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  disabled={!getStepValidation()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !getStepValidation()}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Creating...' : 'Create Shipment'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
