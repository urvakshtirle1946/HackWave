import React, { useState, useEffect } from 'react';
import { disruptionsAPI } from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

interface Disruption {
  id: string;
  type: string;
  locationType: string;
  locationId: string;
  severity: string;
  description: string;
  startTime: string;
  endTime?: string;
}

export default function Disruptions() {
  const [disruptions, setDisruptions] = useState<Disruption[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDisruption, setEditingDisruption] = useState<Disruption | null>(null);
  const [formData, setFormData] = useState({
    type: '',
    locationType: '',
    locationId: '',
    severity: '',
    description: '',
    startTime: '',
    endTime: '',
  });

  const columns = [
    { key: 'type', label: 'Type', sortable: true },
    { key: 'locationType', label: 'Location Type', sortable: true },
    { key: 'locationId', label: 'Location ID', sortable: true },
    { 
      key: 'severity', 
      label: 'Severity', 
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-xs ${
          value === 'high' ? 'bg-red-500/20 text-red-400' :
          value === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-green-500/20 text-green-400'
        }`}>
          {value.toUpperCase()}
        </span>
      )
    },
    { 
      key: 'description', 
      label: 'Description', 
      sortable: false,
      render: (value: string) => (
        <span className="max-w-xs truncate" title={value}>
          {value}
        </span>
      )
    },
    { 
      key: 'startTime', 
      label: 'Start Time', 
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'endTime', 
      label: 'End Time', 
      sortable: true,
      render: (value: string) => value ? new Date(value).toLocaleDateString() : 'Ongoing'
    },
  ];

  useEffect(() => {
    fetchDisruptions();
  }, []);

  const fetchDisruptions = async () => {
    try {
      setLoading(true);
      const data = await disruptionsAPI.getAll();
      setDisruptions(data);
    } catch (error) {
      console.error('Error fetching disruptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingDisruption(null);
    setFormData({
      type: '',
      locationType: '',
      locationId: '',
      severity: '',
      description: '',
      startTime: '',
      endTime: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (disruption: Disruption) => {
    setEditingDisruption(disruption);
    setFormData({
      type: disruption.type,
      locationType: disruption.locationType,
      locationId: disruption.locationId,
      severity: disruption.severity,
      description: disruption.description,
      startTime: disruption.startTime.split('T')[0],
      endTime: disruption.endTime ? disruption.endTime.split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (disruption: Disruption) => {
    if (window.confirm(`Are you sure you want to delete this disruption?`)) {
      try {
        await disruptionsAPI.delete(disruption.id);
        await fetchDisruptions();
      } catch (error) {
        console.error('Error deleting disruption:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: formData.endTime ? new Date(formData.endTime).toISOString() : null,
      };

      if (editingDisruption) {
        await disruptionsAPI.update(editingDisruption.id, submitData);
      } else {
        await disruptionsAPI.create(submitData);
      }
      setIsModalOpen(false);
      await fetchDisruptions();
    } catch (error) {
      console.error('Error saving disruption:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Disruptions Management</h1>
      </div>

      <DataTable
        data={disruptions}
        columns={columns}
        title="Disruptions"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDisruption ? 'Edit Disruption' : 'Add New Disruption'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
                <option value="weather">Weather</option>
                <option value="strike">Strike</option>
                <option value="congestion">Congestion</option>
                <option value="geopolitical">Geopolitical</option>
                <option value="accident">Accident</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Severity
              </label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Severity</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Location Type
              </label>
              <select
                name="locationType"
                value={formData.locationType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Location Type</option>
                <option value="port">Port</option>
                <option value="warehouse">Warehouse</option>
                <option value="supplier">Supplier</option>
                <option value="customer">Customer</option>
                <option value="route">Route</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Location ID
              </label>
              <input
                type="text"
                name="locationId"
                value={formData.locationId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Location ID"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the disruption..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Start Time
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                End Time (Optional)
              </label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
              {editingDisruption ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
