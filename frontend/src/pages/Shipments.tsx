import React, { useState, useEffect } from 'react';
import { shipmentsAPI, suppliersAPI, customersAPI } from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

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
    { key: 'mode', label: 'Mode', sortable: true, render: (value: string) => value.toUpperCase() },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-xs ${
          value === 'completed' ? 'bg-green-500/20 text-green-400' :
          value === 'in_transit' ? 'bg-blue-500/20 text-blue-400' :
          value === 'delayed' ? 'bg-red-500/20 text-red-400' :
          'bg-yellow-500/20 text-yellow-400'
        }`}>
          {value.replace('_', ' ')}
        </span>
      )
    },
    { 
      key: 'departureTime', 
      label: 'Departure', 
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'ETA', 
      label: 'ETA', 
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'riskScore', 
      label: 'Risk Score', 
      sortable: true,
      render: (value: number) => (
        <span className={`px-2 py-1 rounded text-xs ${
          value > 70 ? 'bg-red-500/20 text-red-400' :
          value > 40 ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-green-500/20 text-green-400'
        }`}>
          {value}
        </span>
      )
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Shipments Management</h1>
      </div>

      <DataTable
        data={shipments}
        columns={columns}
        title="Shipments"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

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
