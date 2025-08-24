import { Shipment, ShipmentLocation, ShipmentStats } from '../types/shipmentTracking';

const API_BASE = '/api/shipment-tracking';

export const shipmentTrackingApi = {
  // Get all shipments
  async getAllShipments(): Promise<Shipment[]> {
    const response = await fetch(`${API_BASE}/shipments`);
    if (!response.ok) {
      throw new Error('Failed to fetch shipments');
    }
    return response.json();
  },

  // Get shipment by ID
  async getShipmentById(id: string): Promise<Shipment> {
    const response = await fetch(`${API_BASE}/shipments/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch shipment');
    }
    return response.json();
  },

  // Get shipments by status
  async getShipmentsByStatus(status: string): Promise<Shipment[]> {
    const response = await fetch(`${API_BASE}/shipments/status/${status}`);
    if (!response.ok) {
      throw new Error('Failed to fetch shipments by status');
    }
    return response.json();
  },

  // Get shipments by transport mode
  async getShipmentsByMode(mode: string): Promise<Shipment[]> {
    const response = await fetch(`${API_BASE}/shipments/mode/${mode}`);
    if (!response.ok) {
      throw new Error('Failed to fetch shipments by mode');
    }
    return response.json();
  },

  // Update shipment location
  async updateShipmentLocation(
    shipmentId: string, 
    location: Partial<ShipmentLocation>
  ): Promise<Shipment> {
    const response = await fetch(`${API_BASE}/shipments/${shipmentId}/location`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    });
    if (!response.ok) {
      throw new Error('Failed to update shipment location');
    }
    return response.json();
  },

  // Get shipment statistics
  async getShipmentStats(): Promise<ShipmentStats> {
    const response = await fetch(`${API_BASE}/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch shipment statistics');
    }
    return response.json();
  },

  // Search shipments
  async searchShipments(query: string): Promise<Shipment[]> {
    const response = await fetch(`${API_BASE}/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search shipments');
    }
    return response.json();
  },

  // Get shipments in geographic area
  async getShipmentsInArea(
    minLat: number,
    maxLat: number,
    minLng: number,
    maxLng: number
  ): Promise<Shipment[]> {
    const params = new URLSearchParams({
      minLat: minLat.toString(),
      maxLat: maxLat.toString(),
      minLng: minLng.toString(),
      maxLng: maxLng.toString(),
    });
    
    const response = await fetch(`${API_BASE}/area?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch shipments in area');
    }
    return response.json();
  },

  // Get shipment history
  async getShipmentHistory(shipmentId: string): Promise<ShipmentLocation[]> {
    const response = await fetch(`${API_BASE}/shipments/${shipmentId}/history`);
    if (!response.ok) {
      throw new Error('Failed to fetch shipment history');
    }
    return response.json();
  },

  // Simulate movement (for testing)
  async simulateMovement(): Promise<Shipment[]> {
    const response = await fetch(`${API_BASE}/simulate-movement`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to simulate movement');
    }
    return response.json();
  },

  // Get real-time updates via Server-Sent Events
  getRealTimeUpdates(callback: (shipments: Shipment[]) => void): EventSource {
    const eventSource = new EventSource(`${API_BASE}/real-time`);
    
    eventSource.onmessage = (event) => {
      try {
        const shipments = JSON.parse(event.data);
        callback(shipments);
      } catch (error) {
        console.error('Error parsing real-time update:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Real-time update error:', error);
      eventSource.close();
    };

    return eventSource;
  },
};
