import React, { useState, useEffect } from 'react';
import { warehousesAPI } from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

interface Warehouse {
  id: string;
  name: string;
  country: string;
  capacity: number;
  type: string;
  status: string;
}

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    capacity: 0,
    type: '',
    status: '',
  });

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'country', label: 'Country', sortable: true },
    { key: 'type', label: 'Type', sortable: true, render: (value: string) => value.replace('_', ' ').toUpperCase() },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-xs ${value === 'active' ? 'bg-green-500/20 text-green-400' :
            value === 'maintenance' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
          }`}>
          {value.toUpperCase()}
        </span>
      )
    },
    {
      key: 'capacity',
      label: 'Capacity',
      sortable: true,
      render: (value: number) => (
        <span className="text-white font-medium">
          {value.toLocaleString()} units
        </span>
      )
    },
  ];

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const data = await warehousesAPI.getAll();
      setWarehouses(data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingWarehouse(null);
    setFormData({
      name: '',
      country: '',
      capacity: 0,
      type: '',
      status: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      country: warehouse.country,
      capacity: warehouse.capacity,
      type: warehouse.type,
      status: warehouse.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (warehouse: Warehouse) => {
    if (window.confirm(`Are you sure you want to delete ${warehouse.name}?`)) {
      try {
        await warehousesAPI.delete(warehouse.id);
        await fetchWarehouses();
      } catch (error) {
        console.error('Error deleting warehouse:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingWarehouse) {
        await warehousesAPI.update(editingWarehouse.id, formData);
      } else {
        await warehousesAPI.create(formData);
      }
      setIsModalOpen(false);
      await fetchWarehouses();
    } catch (error) {
      console.error('Error saving warehouse:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Warehouses Management</h1>
      </div>

      <DataTable
        data={warehouses}
        columns={columns}
        title="Warehouses"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Warehouse name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              <option value="regional_dc">Regional DC</option>
              <option value="fulfillment_center">Fulfillment Center</option>
              <option value="cold_storage">Cold Storage</option>
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
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Capacity (units)
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              min="0"
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Capacity"
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
              {editingWarehouse ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
