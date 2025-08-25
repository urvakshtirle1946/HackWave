// API Base URL - Update this to match your backend URL
const API_BASE_URL = 'http://localhost:3000/api'; // Adjust port as needed

// Generic API functions
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Suppliers API
export const suppliersAPI = {
  getAll: () => apiRequest('/suppliers'),
  getById: (id: string) => apiRequest(`/suppliers/${id}`),
  create: (data: any) => apiRequest('/suppliers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/suppliers/${id}`, { method: 'DELETE' }),
};

// Customers API
export const customersAPI = {
  getAll: () => apiRequest('/customers'),
  getById: (id: string) => apiRequest(`/customers/${id}`),
  create: (data: any) => apiRequest('/customers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/customers/${id}`, { method: 'DELETE' }),
};

// Port Hubs API
export const portHubsAPI = {
  getAll: () => apiRequest('/port-hubs'),
  getById: (id: string) => apiRequest(`/port-hubs/${id}`),
  create: (data: any) => apiRequest('/port-hubs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/port-hubs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/port-hubs/${id}`, { method: 'DELETE' }),
  getByType: (type: string) => apiRequest(`/port-hubs/type/${type}`),
  getByStatus: (status: string) => apiRequest(`/port-hubs/status/${status}`),
};

// Warehouses API
export const warehousesAPI = {
  getAll: () => apiRequest('/warehouses'),
  getById: (id: string) => apiRequest(`/warehouses/${id}`),
  create: (data: any) => apiRequest('/warehouses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/warehouses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/warehouses/${id}`, { method: 'DELETE' }),
  getByType: (type: string) => apiRequest(`/warehouses/type/${type}`),
  getInventory: (id: string) => apiRequest(`/warehouses/${id}/inventory`),
};

// Shipments API
export const shipmentsAPI = {
  getAll: () => apiRequest('/shipments'),
  getById: (id: string) => apiRequest(`/shipments/${id}`),
  create: (data: any) => apiRequest('/shipments', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/shipments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/shipments/${id}`, { method: 'DELETE' }),
  getByStatus: (status: string) => apiRequest(`/shipments/status/${status}`),
  getBySupplier: (supplierId: string) => apiRequest(`/shipments/supplier/${supplierId}`),
  getByCustomer: (customerId: string) => apiRequest(`/shipments/customer/${customerId}`),
  getRoutes: (id: string) => apiRequest(`/shipments/${id}/routes`),
  calculateRisk: (shipmentId: string) => apiRequest(`/shipments/${shipmentId}/risk`),
};

// Routes API
export const routesAPI = {
  getAll: () => apiRequest('/routes'),
  getById: (id: string) => apiRequest(`/routes/${id}`),
  create: (data: any) => apiRequest('/routes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/routes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/routes/${id}`, { method: 'DELETE' }),
  getByMode: (mode: string) => apiRequest(`/routes/mode/${mode}`),
  getByCarrier: (carrierName: string) => apiRequest(`/routes/carrier/${carrierName}`),
};

// Road Fleet API
export const roadFleetAPI = {
  getAll: () => apiRequest('/road-fleet'),
  getById: (id: string) => apiRequest(`/road-fleet/${id}`),
  create: (data: any) => apiRequest('/road-fleet', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/road-fleet/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/road-fleet/${id}`, { method: 'DELETE' }),
  getByStatus: (status: string) => apiRequest(`/road-fleet/status/${status}`),
  getByType: (vehicleType: string) => apiRequest(`/road-fleet/type/${vehicleType}`),
};

// Air Cargo API
export const airCargoAPI = {
  getAll: () => apiRequest('/air-cargo'),
  getById: (id: string) => apiRequest(`/air-cargo/${id}`),
  create: (data: any) => apiRequest('/air-cargo', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/air-cargo/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/air-cargo/${id}`, { method: 'DELETE' }),
  getByAirline: (airline: string) => apiRequest(`/air-cargo/airline/${airline}`),
  getByStatus: (status: string) => apiRequest(`/air-cargo/status/${status}`),
  getByRoute: (departureAirportId: string, arrivalAirportId: string) => 
    apiRequest(`/air-cargo/route/${departureAirportId}/${arrivalAirportId}`),
};

// Rail Cargo API
export const railCargoAPI = {
  getAll: () => apiRequest('/rail-cargo'),
  getById: (id: string) => apiRequest(`/rail-cargo/${id}`),
  create: (data: any) => apiRequest('/rail-cargo', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/rail-cargo/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/rail-cargo/${id}`, { method: 'DELETE' }),
  getByOperator: (railOperator: string) => apiRequest(`/rail-cargo/operator/${railOperator}`),
  getByStatus: (status: string) => apiRequest(`/rail-cargo/status/${status}`),
  getByRoute: (departureHubId: string, arrivalHubId: string) => 
    apiRequest(`/rail-cargo/route/${departureHubId}/${arrivalHubId}`),
};

// Disruptions API
export const disruptionsAPI = {
  getAll: () => apiRequest('/disruptions'),
  getActive: () => apiRequest('/disruptions/active'),
  getById: (id: string) => apiRequest(`/disruptions/${id}`),
  create: (data: any) => apiRequest('/disruptions', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/disruptions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/disruptions/${id}`, { method: 'DELETE' }),
  getByType: (type: string) => apiRequest(`/disruptions/type/${type}`),
  getBySeverity: (severity: string) => apiRequest(`/disruptions/severity/${severity}`),
    getByLocation: (locationType: string, location: string) =>
    apiRequest(`/disruptions/location/${locationType}/${location}`),
};

// Inventory API
export const inventoryAPI = {
  getAll: () => apiRequest('/inventory'),
  getLowStock: () => apiRequest('/inventory/low-stock'),
  getById: (id: string) => apiRequest(`/inventory/${id}`),
  create: (data: any) => apiRequest('/inventory', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/inventory/${id}`, { method: 'DELETE' }),
  getByWarehouse: (warehouseId: string) => apiRequest(`/inventory/warehouse/${warehouseId}`),
  getByProduct: (productName: string) => apiRequest(`/inventory/product/${productName}`),
  getBySku: (sku: string) => apiRequest(`/inventory/sku/${sku}`),
  updateQuantity: (id: string, quantity: number) => 
    apiRequest(`/inventory/${id}/quantity`, { method: 'PATCH', body: JSON.stringify({ quantity }) }),
};

// Shipment Disruptions API
export const shipmentDisruptionsAPI = {
  getAll: () => apiRequest('/shipment-disruptions'),
  getHighImpact: () => apiRequest('/shipment-disruptions/high-impact'),
  getRerouteNeeded: () => apiRequest('/shipment-disruptions/reroute-needed'),
  getById: (id: string) => apiRequest(`/shipment-disruptions/${id}`),
  create: (data: any) => apiRequest('/shipment-disruptions', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/shipment-disruptions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/shipment-disruptions/${id}`, { method: 'DELETE' }),
  getByShipment: (shipmentId: string) => apiRequest(`/shipment-disruptions/shipment/${shipmentId}`),
  getByDisruption: (disruptionId: string) => apiRequest(`/shipment-disruptions/disruption/${disruptionId}`),
};

// Health check
export const healthCheck = () => apiRequest('/health');

// Get all endpoints info
export const getEndpoints = () => apiRequest('/endpoints');

// Simulation API (AI Agent)
const AI_AGENT_BASE_URL = 'http://localhost:3001/api'; // AI Agent runs on port 3001

const aiAgentRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${AI_AGENT_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('AI Agent API request failed:', error);
    throw error;
  }
};

export const simulationAPI = {
  runScenario: (scenarioType: string, scenarioParams?: any) => 
    aiAgentRequest('/simulation', { 
      method: 'POST', 
      body: JSON.stringify({ scenarioType, scenarioParams }) 
    }),
  runRiskAssessment: (data: any) => 
    aiAgentRequest('/risk-assessment', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  runStrategicPlanning: (data: any) => 
    aiAgentRequest('/strategic-planning', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  getMonitoring: () => aiAgentRequest('/monitoring'),
  runCustomWorkflow: (steps: any[]) => 
    aiAgentRequest('/custom-workflow', { 
      method: 'POST', 
      body: JSON.stringify({ steps }) 
    }),
};
