import prisma from '../config/prisma';

interface QueryContext {
  entities: string[];
  timeRange?: { start: Date; end: Date } | undefined;
  filters?: Record<string, any>;
}

interface DatabaseQuery {
  query: string;
  context: QueryContext;
  data: any[];
}

interface GroqRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature: number;
  max_tokens: number;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class AIAgentService {
  private groqApiKey: string;
  private groqBaseUrl: string = 'https://api.groq.com/openai/v1/chat/completions';

  constructor() {
    this.groqApiKey = process.env.GROQ_API_KEY || '';
    if (!this.groqApiKey) {
      console.warn('GROQ_API_KEY not found in environment variables');
    }
  }

  /**
   * Main method to process user queries and generate intelligent responses
   */
  async processQuery(userQuery: string): Promise<string> {
    try {
      // Step 1: Analyze the query to understand what data is needed
      const queryContext = this.analyzeQuery(userQuery);

      // Step 2: Retrieve relevant data from database
      const relevantData = await this.retrieveRelevantData(queryContext);

      // Step 3: Format data for LLM consumption
      const formattedData = this.formatDataForLLM(relevantData, queryContext);

      // Step 4: Generate response using GroqCloud LLM
      const response = await this.generateLLMResponse(userQuery, formattedData);
      console.log('LLM Response:', response);
      return response;
    } catch (error) {
      console.error('Error processing query:', error);
      return 'I apologize, but I encountered an error while processing your request. Please try again or contact support if the issue persists.';
    }
  }

  /**
   * Analyze user query to determine what data entities and context are needed
   */
  private analyzeQuery(userQuery: string): QueryContext {
    const query = userQuery.toLowerCase();
    const entities: string[] = [];

    // Detect entities mentioned in the query
    if (query.includes('shipment') || query.includes('delivery') || query.includes('transport')) {
      entities.push('shipments');
    }
    if (query.includes('supplier') || query.includes('vendor')) {
      entities.push('suppliers');
    }
    if (query.includes('customer') || query.includes('client')) {
      entities.push('customers');
    }
    if (query.includes('warehouse') || query.includes('inventory') || query.includes('stock')) {
      entities.push('warehouses', 'inventory');
    }
    if (query.includes('risk') || query.includes('disruption') || query.includes('alert')) {
      entities.push('disruptions', 'shipmentDisruptions');
    }
    if (query.includes('port') || query.includes('hub') || query.includes('terminal')) {
      entities.push('portHubs');
    }
    if (query.includes('route') || query.includes('path') || query.includes('journey')) {
      entities.push('routes');
    }
    if (query.includes('fleet') || query.includes('vehicle') || query.includes('truck')) {
      entities.push('roadFleet');
    }
    if (query.includes('air') || query.includes('flight') || query.includes('cargo')) {
      entities.push('airCargo');
    }
    if (query.includes('rail') || query.includes('train')) {
      entities.push('railCargo');
    }

    // If no specific entities detected, include common ones
    if (entities.length === 0) {
      entities.push('shipments', 'suppliers', 'customers', 'warehouses');
    }

    // Detect time context
    let timeRange: { start: Date; end: Date } | undefined;
    if (query.includes('today') || query.includes('current')) {
      const now = new Date();
      timeRange = {
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        end: now
      };
    } else if (query.includes('week') || query.includes('weekly')) {
      const now = new Date();
      const weekStart = new Date(now.getTime() - (now.getDay() * 24 * 60 * 60 * 1000));
      timeRange = {
        start: weekStart,
        end: now
      };
    } else if (query.includes('month') || query.includes('monthly')) {
      const now = new Date();
      timeRange = {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: now
      };
    }

    return {
      entities,
      timeRange,
      filters: this.extractFilters(query)
    };
  }

  /**
   * Extract filters from user query
   */
  private extractFilters(query: string): Record<string, any> {
    const filters: Record<string, any> = {};

    // Status filters
    if (query.includes('active') || query.includes('running')) {
      filters.status = 'active';
    } else if (query.includes('completed') || query.includes('finished')) {
      filters.status = 'completed';
    } else if (query.includes('delayed') || query.includes('late')) {
      filters.status = 'delayed';
    }

    // Mode filters
    if (query.includes('sea') || query.includes('ocean') || query.includes('ship')) {
      filters.mode = 'sea';
    } else if (query.includes('air') || query.includes('flight')) {
      filters.mode = 'air';
    } else if (query.includes('road') || query.includes('truck')) {
      filters.mode = 'road';
    } else if (query.includes('rail') || query.includes('train')) {
      filters.mode = 'rail';
    }

    // Severity filters
    if (query.includes('high risk') || query.includes('critical')) {
      filters.severity = 'high';
    } else if (query.includes('medium risk') || query.includes('moderate')) {
      filters.severity = 'medium';
    } else if (query.includes('low risk')) {
      filters.severity = 'low';
    }

    return filters;
  }

  /**
   * Retrieve relevant data from database based on query context
   */
  private async retrieveRelevantData(context: QueryContext): Promise<Record<string, any[]>> {
    const data: Record<string, any[]> = {};

    try {
      // Retrieve data for each detected entity
      for (const entity of context.entities) {
        switch (entity) {
          case 'shipments':
            data.shipments = await this.getShipments(context);
            break;
          case 'suppliers':
            data.suppliers = await this.getSuppliers(context);
            break;
          case 'customers':
            data.customers = await this.getCustomers(context);
            break;
          case 'warehouses':
            data.warehouses = await this.getWarehouses(context);
            break;
          case 'inventory':
            data.inventory = await this.getInventory(context);
            break;
          case 'disruptions':
            data.disruptions = await this.getDisruptions(context);
            break;
          case 'portHubs':
            data.portHubs = await this.getPortHubs(context);
            break;
          case 'routes':
            data.routes = await this.getRoutes(context);
            break;
          case 'roadFleet':
            data.roadFleet = await this.getRoadFleet(context);
            break;
          case 'airCargo':
            data.airCargo = await this.getAirCargo(context);
            break;
          case 'railCargo':
            data.railCargo = await this.getRailCargo(context);
            break;
        }
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }

    return data;
  }

  /**
   * Get shipments with context filters
   */
  private async getShipments(context: QueryContext): Promise<any[]> {
    const where: any = {};

    if (context.filters?.status) {
      where.status = context.filters.status;
    }
    if (context.filters?.mode) {
      where.mode = context.filters.mode;
    }
    if (context.timeRange) {
      where.departureTime = {
        gte: context.timeRange.start,
        lte: context.timeRange.end
      };
    }

    return await prisma.shipment.findMany({
      where,
      include: {
        supplier: true,
        customer: true,
        routes: true,
        disruptions: {
          include: {
            disruption: true
          }
        }
      },
      take: 50 // Limit to prevent overwhelming responses
    });
  }

  /**
   * Get suppliers with context filters
   */
  private async getSuppliers(context: QueryContext): Promise<any[]> {
    return await prisma.supplier.findMany({
      take: 20
    });
  }

  /**
   * Get customers with context filters
   */
  private async getCustomers(context: QueryContext): Promise<any[]> {
    return await prisma.customer.findMany({
      take: 20
    });
  }

  /**
   * Get warehouses with context filters
   */
  private async getWarehouses(context: QueryContext): Promise<any[]> {
    const where: any = {};
    if (context.filters?.status) {
      where.status = context.filters.status;
    }

    return await prisma.warehouse.findMany({
      where,
      include: {
        inventory: true
      },
      take: 20
    });
  }

  /**
   * Get inventory with context filters
   */
  private async getInventory(context: QueryContext): Promise<any[]> {
    const where: any = {};
    if (context.filters?.status) {
      where.quantity = {
        lte: prisma.inventory.fields.reorderPoint
      };
    }

    return await prisma.inventory.findMany({
      where,
      include: {
        warehouse: true
      },
      take: 30
    });
  }

  /**
   * Get disruptions with context filters
   */
  private async getDisruptions(context: QueryContext): Promise<any[]> {
    const where: any = {};
    if (context.filters?.severity) {
      where.severity = context.filters.severity;
    }
    if (context.timeRange) {
      where.startTime = {
        gte: context.timeRange.start,
        lte: context.timeRange.end
      };
    }

    return await prisma.disruption.findMany({
      where,
      include: {
        affectedShipments: {
          include: {
            shipment: true
          }
        }
      },
      take: 20
    });
  }

  /**
   * Get port hubs with context filters
   */
  private async getPortHubs(context: QueryContext): Promise<any[]> {
    const where: any = {};
    if (context.filters?.status) {
      where.status = context.filters.status;
    }

    return await prisma.portHub.findMany({
      where,
      take: 20
    });
  }

  /**
   * Get routes with context filters
   */
  private async getRoutes(context: QueryContext): Promise<any[]> {
    const where: any = {};
    if (context.filters?.mode) {
      where.mode = context.filters.mode;
    }

    return await prisma.route.findMany({
      where,
      include: {
        shipment: true
      },
      take: 30
    });
  }

  /**
   * Get road fleet with context filters
   */
  private async getRoadFleet(context: QueryContext): Promise<any[]> {
    const where: any = {};
    if (context.filters?.status) {
      where.status = context.filters.status;
    }

    return await prisma.roadFleet.findMany({
      where,
      take: 20
    });
  }

  /**
   * Get air cargo with context filters
   */
  private async getAirCargo(context: QueryContext): Promise<any[]> {
    const where: any = {};
    if (context.filters?.status) {
      where.status = context.filters.status;
    }

    return await prisma.airCargo.findMany({
      where,
      take: 20
    });
  }

  /**
   * Get rail cargo with context filters
   */
  private async getRailCargo(context: QueryContext): Promise<any[]> {
    const where: any = {};
    if (context.filters?.status) {
      where.status = context.filters.status;
    }

    return await prisma.railCargo.findMany({
      where,
      take: 20
    });
  }

  /**
   * Format data for LLM consumption
   */
  private formatDataForLLM(data: Record<string, any[]>, context: QueryContext): string {
    let formattedData = 'Here is the relevant supply chain data:\n\n';

    for (const [entity, items] of Object.entries(data)) {
      if (items.length > 0) {
        formattedData += `**${entity.charAt(0).toUpperCase() + entity.slice(1)}** (${items.length} items):\n`;

        // Format each item based on entity type
        switch (entity) {
          case 'shipments':
            formattedData += this.formatShipments(items);
            break;
          case 'suppliers':
            formattedData += this.formatSuppliers(items);
            break;
          case 'customers':
            formattedData += this.formatCustomers(items);
            break;
          case 'warehouses':
            formattedData += this.formatWarehouses(items);
            break;
          case 'inventory':
            formattedData += this.formatInventory(items);
            break;
          case 'disruptions':
            formattedData += this.formatDisruptions(items);
            break;
          case 'portHubs':
            formattedData += this.formatPortHubs(items);
            break;
          case 'routes':
            formattedData += this.formatRoutes(items);
            break;
          case 'roadFleet':
            formattedData += this.formatRoadFleet(items);
            break;
          case 'airCargo':
            formattedData += this.formatAirCargo(items);
            break;
          case 'railCargo':
            formattedData += this.formatRailCargo(items);
            break;
        }
        formattedData += '\n';
      }
    }

    return formattedData;
  }

  /**
   * Format shipments data for LLM
   */
  private formatShipments(shipments: any[]): string {
    return shipments.map(shipment =>
      `- Shipment ${shipment.id.slice(0, 8)}: ${shipment.mode} transport from ${shipment.supplier?.name || 'Unknown'} to ${shipment.customer?.name || 'Unknown'}, Status: ${shipment.status}, Risk Score: ${shipment.riskScore}, ETA: ${shipment.ETA.toLocaleDateString()}`
    ).join('\n');
  }

  /**
   * Format suppliers data for LLM
   */
  private formatSuppliers(suppliers: any[]): string {
    return suppliers.map(supplier =>
      `- ${supplier.name} (${supplier.country}): ${supplier.industry} industry, Reliability Score: ${supplier.reliabilityScore}/100`
    ).join('\n');
  }

  /**
   * Format customers data for LLM
   */
  private formatCustomers(customers: any[]): string {
    return customers.map(customer =>
      `- ${customer.name} (${customer.country}): ${customer.industry} industry, Demand Forecast: ${customer.demandForecast}`
    ).join('\n');
  }

  /**
   * Format warehouses data for LLM
   */
  private formatWarehouses(warehouses: any[]): string {
    return warehouses.map(warehouse =>
      `- ${warehouse.name} (${warehouse.country}): ${warehouse.type}, Capacity: ${warehouse.capacity}, Status: ${warehouse.status}`
    ).join('\n');
  }

  /**
   * Format inventory data for LLM
   */
  private formatInventory(inventory: any[]): string {
    return inventory.map(item =>
      `- ${item.productName} (SKU: ${item.sku}): Quantity: ${item.quantity}, Reorder Point: ${item.reorderPoint}, Warehouse: ${item.warehouse?.name || 'Unknown'}`
    ).join('\n');
  }

  /**
   * Format disruptions data for LLM
   */
  private formatDisruptions(disruptions: any[]): string {
    return disruptions.map(disruption =>
      `- ${disruption.type} at ${disruption.locationType}: ${disruption.description}, Severity: ${disruption.severity}, Start: ${disruption.startTime.toLocaleDateString()}`
    ).join('\n');
  }

  /**
   * Format port hubs data for LLM
   */
  private formatPortHubs(portHubs: any[]): string {
    return portHubs.map(hub =>
      `- ${hub.name} (${hub.country}): ${hub.type}, Status: ${hub.status}, Capacity: ${hub.capacity}`
    ).join('\n');
  }

  /**
   * Format routes data for LLM
   */
  private formatRoutes(routes: any[]): string {
    return routes.map(route =>
      `- Route ${route.id.slice(0, 8)}: ${route.mode} transport via ${route.carrierName}, Travel Time: ${route.travelTimeEst}h, Cost: $${route.costEst}`
    ).join('\n');
  }

  /**
   * Format road fleet data for LLM
   */
  private formatRoadFleet(roadFleet: any[]): string {
    return roadFleet.map(vehicle =>
      `- ${vehicle.vehicleType}: Driver ${vehicle.driverName}, Capacity: ${vehicle.capacity}, Status: ${vehicle.status}`
    ).join('\n');
  }

  /**
   * Format air cargo data for LLM
   */
  private formatAirCargo(airCargo: any[]): string {
    return airCargo.map(flight =>
      `- Flight ${flight.flightNo} (${flight.airline}): Capacity: ${flight.capacity}, Status: ${flight.status}`
    ).join('\n');
  }

  /**
   * Format rail cargo data for LLM
   */
  private formatRailCargo(railCargo: any[]): string {
    return railCargo.map(train =>
      `- Train ${train.trainNo} (${train.railOperator}): Capacity: ${train.capacity}, Status: ${train.status}`
    ).join('\n');
  }

  /**
   * Generate response using GroqCloud LLM
   */
  private async generateLLMResponse(userQuery: string, formattedData: string): Promise<string> {
    if (!this.groqApiKey) {
      return this.generateFallbackResponse(userQuery, formattedData);
    }

    try {
      const systemPrompt = `You are an intelligent supply chain management assistant. You have access to real-time supply chain data and can provide detailed, actionable insights.

Your role is to:
1. Analyze the user's question carefully
2. Use the provided data to give accurate, specific answers
3. Provide actionable insights and recommendations when possible
4. Be concise but informative
5. Use the data to support your responses

Always base your responses on the actual data provided. If the data doesn't contain information needed to answer a question, say so clearly.`;

      const userPrompt = `User Question: ${userQuery}

${formattedData}

Please provide a helpful, accurate response based on this data.`;

      const request: GroqRequest = {
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      };

      const response = await fetch(this.groqBaseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const result: GroqResponse = await response.json();
      return result.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';
    } catch (error) {
      console.error('Error calling Groq API:', error);
      return this.generateFallbackResponse(userQuery, formattedData);
    }
  }

  /**
   * Generate fallback response when Groq API is unavailable
   */
  private generateFallbackResponse(userQuery: string, formattedData: string): string {
    const query = userQuery.toLowerCase();

    // Simple rule-based responses as fallback
    if (query.includes('shipment') || query.includes('delivery')) {
      const shipments = this.extractDataCount(formattedData, 'shipments');
      return `I found ${shipments} shipments in your system. Based on the data, I can see shipment details including routes, status, and risk assessments. Would you like me to provide more specific information about any particular aspect?`;
    }

    if (query.includes('risk') || query.includes('disruption')) {
      const disruptions = this.extractDataCount(formattedData, 'disruptions');
      return `I found ${disruptions} active disruptions in your supply chain. The system is monitoring these issues and can provide detailed impact analysis. Would you like me to focus on any specific type of disruption?`;
    }

    if (query.includes('inventory') || query.includes('warehouse')) {
      const warehouses = this.extractDataCount(formattedData, 'warehouses');
      const inventory = this.extractDataCount(formattedData, 'inventory');
      return `I found ${warehouses} warehouses and ${inventory} inventory items in your system. I can provide information about stock levels, capacity, and reorder points. What specific inventory information would you like?`;
    }

    return `I have access to your supply chain data and can help you with various aspects including shipments, inventory, risk assessment, and more. Please ask me a specific question about what you'd like to know.`;
  }

  /**
   * Extract data count from formatted data
   */
  private extractDataCount(formattedData: string, entity: string): number {
    const match = formattedData.match(new RegExp(`\\*\\*${entity.charAt(0).toUpperCase() + entity.slice(1)}\\*\\* \\((\\d+) items\\)`));
    return match ? parseInt(match[1] ?? '0') : 0;
  }
}

export default AIAgentService;
