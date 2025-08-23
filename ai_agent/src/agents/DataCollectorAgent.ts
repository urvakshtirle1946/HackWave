import { BaseAgent } from "./BaseAgent";
import { AgentResponse, WeatherData, NewsData } from "../types";
import { MCPContext, MCPResponse, AgentCapability } from "../types/mcpContext";
import axios from "axios";

export class DataCollectorAgent extends BaseAgent {
  private weatherApiKey?: string;
  private newsApiKey?: string;
  private lastCollectionTime: Date = new Date(0);
  private backendUrl: string;

  constructor(agentId: string = "data_collector_001") {
    super(agentId, "DataCollector");
    // Use simple defaults for now - these can be configured at runtime
    this.weatherApiKey = undefined;
    this.newsApiKey = undefined;
    this.backendUrl = "http://localhost:3000/api";
  }

  public getCapabilities(): AgentCapability[] {
    return [
      {
        id: "weather_collection",
        name: "Weather Data Collection",
        description: "Collect weather data for supply chain locations",
        inputTypes: ["location_ids"],
        outputTypes: ["weather_data"],
      },
      {
        id: "news_monitoring",
        name: "News and Geopolitical Risk Monitoring",
        description: "Monitor news for supply chain risks",
        inputTypes: ["keywords", "regions"],
        outputTypes: ["news_data", "risk_alerts"],
      },
      {
        id: "congestion_monitoring",
        name: "Port Congestion Data",
        description: "Collect real-time port congestion information",
        inputTypes: ["port_ids"],
        outputTypes: ["congestion_data"],
      },
      {
        id: "backend_integration",
        name: "Backend API Integration",
        description: "Integrate with backend supply chain data",
        inputTypes: ["api_endpoints"],
        outputTypes: ["supply_chain_data"],
      },
    ];
  }

  public async process(data: any): Promise<AgentResponse> {
    try {
      const collectionTime = new Date();

      // Collect weather data for all locations
      const weatherData = await this.collectWeatherData();

      // Collect news data
      const newsData = await this.collectNewsData();

      // Collect port congestion data
      const congestionData = await this.collectCongestionData();

      // Collect backend supply chain data
      const supplyChainData = await this.collectSupplyChainData();

      const collectedData = {
        weather: weatherData,
        news: newsData,
        congestion: congestionData,
        supplyChain: supplyChainData,
        collectionTime,
        lastCollectionTime: this.lastCollectionTime,
      };

      this.lastCollectionTime = collectionTime;

      return this.createResponse(collectedData, 0.9);
    } catch (error) {
      console.error("Data collection error:", error);
      return this.createResponse(
        { error: "Data collection failed", details: error },
        0.1
      );
    }
  }

  public async processMCP<T>(context: MCPContext<T>): Promise<MCPResponse<T>> {
    const startTime = Date.now();

    try {
      // Add provenance for processing start
      const updatedContext = this.addProvenance(
        context,
        "data_collection_start"
      );

      // Process based on context type
      let result: any;
      switch (context.type) {
        case "weather_request":
          result = await this.collectWeatherData();
          break;
        case "news_request":
          result = await this.collectNewsData();
          break;
        case "congestion_request":
          result = await this.collectCongestionData();
          break;
        case "supply_chain_request":
          result = await this.collectSupplyChainData();
          break;
        default:
          result = await this.collectAllData();
      }

      // Create result context
      const resultContext = this.createMCPContext(
        `${context.type}_result`,
        result,
        "data_collection_complete",
        context.id
      );

      // Send to backend
      await this.sendToBackend(resultContext);

      const executionTime = Date.now() - startTime;
      return {
        context: resultContext,
        success: true,
        executionTime,
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorContext = this.addProvenance(context, "data_collection_error");

      return {
        context: errorContext,
        success: false,
        error: {
          code: "DATA_COLLECTION_FAILED",
          message: error instanceof Error ? error.message : "Unknown error",
          details: error,
        },
        executionTime,
      };
    }
  }

  private async collectAllData(): Promise<any> {
    const [weatherData, newsData, congestionData, supplyChainData] =
      await Promise.all([
        this.collectWeatherData(),
        this.collectNewsData(),
        this.collectCongestionData(),
        this.collectSupplyChainData(),
      ]);

    return {
      weather: weatherData,
      news: newsData,
      congestion: congestionData,
      supplyChain: supplyChainData,
      collectionTime: new Date(),
      lastCollectionTime: this.lastCollectionTime,
    };
  }

  private async collectWeatherData(): Promise<WeatherData[]> {
    try {
      // Get port hubs and warehouses from backend
      const [portsResponse, warehousesResponse] = await Promise.all([
        axios.get(`${this.backendUrl}/port-hubs`),
        axios.get(`${this.backendUrl}/warehouses`),
      ]);

      const locations = [
        ...portsResponse.data.map((port: any) => ({
          id: port.id,
          name: port.name,
          country: port.country,
          type: "port",
        })),
        ...warehousesResponse.data.map((warehouse: any) => ({
          id: warehouse.id,
          name: warehouse.name,
          country: warehouse.country,
          type: "warehouse",
        })),
      ];

      const weatherData: WeatherData[] = [];

      for (const location of locations) {
        try {
          const weather: WeatherData = {
            locationId: location.id,
            temperature: Math.floor(Math.random() * 40) - 10, // -10 to 30°C
            humidity: Math.floor(Math.random() * 100),
            windSpeed: Math.floor(Math.random() * 50),
            conditions: ["sunny", "cloudy", "rainy", "stormy", "foggy"][
              Math.floor(Math.random() * 5)
            ],
            visibility: Math.floor(Math.random() * 10) + 1,
            timestamp: new Date(),
            location: {
              name: location.name,
              country: location.country,
              type: location.type,
            },
          };
          weatherData.push(weather);
        } catch (error) {
          console.warn(
            `Failed to collect weather data for ${location.name}:`,
            error
          );
        }
      }

      return weatherData;
    } catch (error) {
      console.error("Failed to collect weather data from backend:", error);
      return [];
    }
  }

  private async collectNewsData(): Promise<NewsData[]> {
    try {
      // Get disruptions from backend for news context
      const disruptionsResponse = await axios.get(
        `${this.backendUrl}/disruptions`
      );

      const newsData: NewsData[] = disruptionsResponse.data.map(
        (disruption: any) => ({
          id: disruption.id,
          title: `${disruption.type} disruption in ${disruption.locationType}`,
          summary: disruption.description,
          source: "Supply Chain Monitor",
          publishedAt: disruption.startTime,
          relevanceScore:
            disruption.severity === "high"
              ? 0.9
              : disruption.severity === "medium"
              ? 0.6
              : 0.3,
          sentiment: disruption.severity === "high" ? "negative" : "neutral",
          tags: [disruption.type, disruption.locationType, disruption.severity],
          geopoliticalRisk: disruption.type === "geopolitical" ? "high" : "low",
        })
      );

      return newsData;
    } catch (error) {
      console.error("Failed to collect news data from backend:", error);
      return [];
    }
  }

  private async collectCongestionData(): Promise<any[]> {
    try {
      // Get port hubs with congested status
      const congestedPortsResponse = await axios.get(
        `${this.backendUrl}/port-hubs/status/congested`
      );

      return congestedPortsResponse.data.map((port: any) => ({
        portId: port.id,
        portName: port.name,
        country: port.country,
        congestionLevel: "high",
        waitingTime: Math.floor(Math.random() * 48) + 1, // 1-48 hours
        vesselCount: Math.floor(Math.random() * 50) + 5, // 5-55 vessels
        capacity: port.capacity,
        utilizationRate: Math.random() * 0.4 + 0.6, // 60-100%
        timestamp: new Date(),
      }));
    } catch (error) {
      console.error("Failed to collect congestion data from backend:", error);
      return [];
    }
  }

  private async collectSupplyChainData(): Promise<any> {
    try {
      const [suppliersResponse, shipmentsResponse, inventoryResponse] =
        await Promise.all([
          axios.get(`${this.backendUrl}/suppliers`),
          axios.get(`${this.backendUrl}/shipments`),
          axios.get(`${this.backendUrl}/inventory/low-stock`),
        ]);

      return {
        suppliers: suppliersResponse.data,
        shipments: shipmentsResponse.data,
        lowStockItems: inventoryResponse.data,
        collectionTime: new Date(),
      };
    } catch (error) {
      console.error("Failed to collect supply chain data from backend:", error);
      return {
        suppliers: [],
        shipments: [],
        lowStockItems: [],
        collectionTime: new Date(),
        error: "Backend connection failed",
      };
    }
  }

  public async getDataQualityMetrics(): Promise<any> {
    const now = new Date();
    const timeSinceLastCollection =
      now.getTime() - this.lastCollectionTime.getTime();

    try {
      // Test backend connectivity
      const healthResponse = await axios.get(`${this.backendUrl}/health`);
      const backendStatus =
        healthResponse.status === 200 ? "connected" : "disconnected";

      return {
        lastCollectionTime: this.lastCollectionTime,
        timeSinceLastCollection: timeSinceLastCollection,
        dataFreshness:
          timeSinceLastCollection < 5 * 60 * 1000 ? "fresh" : "stale", // 5 minutes
        backendStatus,
        apiKeysConfigured: {
          weather: !!this.weatherApiKey,
          news: !!this.newsApiKey,
        },
      };
    } catch (error) {
      return {
        lastCollectionTime: this.lastCollectionTime,
        timeSinceLastCollection: timeSinceLastCollection,
        dataFreshness: "stale",
        backendStatus: "disconnected",
        apiKeysConfigured: {
          weather: !!this.weatherApiKey,
          news: !!this.newsApiKey,
        },
        error: "Backend health check failed",
      };
    }
  }
}
