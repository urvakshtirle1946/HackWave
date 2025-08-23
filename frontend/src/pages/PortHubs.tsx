import React, { useState, useEffect } from 'react';
import { portHubsAPI } from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

interface PortHub {
  id: string;
  name: string;
  country: string;
  type: string;
  status: string;
  capacity: number;
}

export default function PortHubs() {
  const [portHubs, setPortHubs] = useState<PortHub[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPortHub, setEditingPortHub] = useState<PortHub | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    type: '',
    status: '',
    capacity: 0,
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
        <span className={`px-2 py-1 rounded text-xs ${
          value === 'active' ? 'bg-green-500/20 text-green-400' :
          value === 'congested' ? 'bg-yellow-500/20 text-yellow-400' :
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
    fetchPortHubs();
  }, []);

  const fetchPortHubs = async () => {
    try {
      setLoading(true);
      const data = await portHubsAPI.getAll();
      setPortHubs(data);
    } catch (error) {
      console.error('Error fetching port hubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingPortHub(null);
    setFormData({
      name: '',
      country: '',
      type: '',
      status: '',
      capacity: 0,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (portHub: PortHub) => {
    setEditingPortHub(portHub);
    setFormData({
      name: portHub.name,
      country: portHub.country,
      type: portHub.type,
      status: portHub.status,
      capacity: portHub.capacity,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (portHub: PortHub) => {
    if (window.confirm(`Are you sure you want to delete ${portHub.name}?`)) {
      try {
        await portHubsAPI.delete(portHub.id);
        await fetchPortHubs();
      } catch (error) {
        console.error('Error deleting port hub:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPortHub) {
        await portHubsAPI.update(editingPortHub.id, formData);
      } else {
        await portHubsAPI.create(formData);
      }
      setIsModalOpen(false);
      await fetchPortHubs();
    } catch (error) {
      console.error('Error saving port hub:', error);
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
        <h1 className="text-2xl font-bold text-white">Port Hubs Management</h1>
      </div>

      <DataTable
        data={portHubs}
        columns={columns}
        title="Port Hubs"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPortHub ? 'Edit Port Hub' : 'Add New Port Hub'}
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
              placeholder="Port hub name"
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
              <option value="seaport">Seaport</option>
              <option value="airport">Airport</option>
              <option value="rail_hub">Rail Hub</option>
              <option value="inland_port">Inland Port</option>
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
              <option value="congested">Congested</option>
              <option value="closed">Closed</option>
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
              {editingPortHub ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
