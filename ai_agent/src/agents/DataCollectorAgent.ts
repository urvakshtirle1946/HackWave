import { BaseAgent } from './BaseAgent';
import { AgentResponse, WeatherData, NewsData } from '../types';
import { getMockWeatherData, getMockNewsData } from '../data/mockData';
import axios from 'axios';

export class DataCollectorAgent extends BaseAgent {
  private weatherApiKey?: string;
  private newsApiKey?: string;
  private lastCollectionTime: Date = new Date(0);

  constructor(agentId: string = 'data_collector_001') {
    super(agentId, 'DataCollector');
    this.weatherApiKey = process.env.WEATHER_API_KEY;
    this.newsApiKey = process.env.NEWS_API_KEY;
  }

  public getCapabilities(): string[] {
    return [
      'Weather data collection',
      'News and geopolitical risk monitoring',
      'Port congestion data',
      'Real-time API integration',
      'Data validation and quality assessment'
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
      
      const collectedData = {
        weather: weatherData,
        news: newsData,
        congestion: congestionData,
        collectionTime,
        lastCollectionTime: this.lastCollectionTime
      };

      this.lastCollectionTime = collectionTime;
      
      return this.createResponse(collectedData, 0.9);
    } catch (error) {
      console.error('Data collection error:', error);
      return this.createResponse(
        { error: 'Data collection failed', details: error },
        0.1
      );
    }
  }

  private async collectWeatherData(): Promise<WeatherData[]> {
    const locations = [
      'port_singapore', 'port_rotterdam', 'port_los_angeles', 'port_shanghai',
      'supplier_china', 'supplier_india', 'supplier_germany'
    ];

    const weatherData: WeatherData[] = [];

    for (const locationId of locations) {
      try {
        if (this.weatherApiKey) {
          // Try to get real weather data
          const realWeather = await this.getRealWeatherData(locationId);
          if (realWeather) {
            weatherData.push(realWeather);
            continue;
          }
        }
        
        // Fallback to mock data
        const mockWeather = getMockWeatherData(locationId);
        if (mockWeather) {
          weatherData.push(mockWeather);
        }
      } catch (error) {
        console.warn(`Failed to collect weather data for ${locationId}:`, error);
        // Use mock data as fallback
        const mockWeather = getMockWeatherData(locationId);
        if (mockWeather) {
          weatherData.push(mockWeather);
        }
      }
    }

    return weatherData;
  }

  private async getRealWeatherData(locationId: string): Promise<WeatherData | null> {
    try {
      // This would integrate with OpenWeatherMap API
      // For now, return null to use mock data
      return null;
    } catch (error) {
      return null;
    }
  }

  private async collectNewsData(): Promise<NewsData[]> {
    try {
      if (this.newsApiKey) {
        // Try to get real news data
        const realNews = await this.getRealNewsData();
        if (realNews.length > 0) {
          return realNews;
        }
      }
      
      // Fallback to mock data
      return getMockNewsData();
    } catch (error) {
      console.warn('Failed to collect real news data, using mock data:', error);
      return getMockNewsData();
    }
  }

  private async getRealNewsData(): Promise<NewsData[]> {
    try {
      // This would integrate with NewsAPI or similar
      // For now, return empty array to use mock data
      return [];
    } catch (error) {
      return [];
    }
  }

  private async collectCongestionData(): Promise<any[]> {
    try {
      // Simulate port congestion data collection
      const ports = ['port_singapore', 'port_rotterdam', 'port_los_angeles', 'port_shanghai'];
      
      return ports.map(portId => ({
        portId,
        congestionLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        waitingTime: Math.floor(Math.random() * 48) + 1, // 1-48 hours
        vesselCount: Math.floor(Math.random() * 50) + 5, // 5-55 vessels
        timestamp: new Date()
      }));
    } catch (error) {
      console.error('Failed to collect congestion data:', error);
      return [];
    }
  }

  public async getDataQualityMetrics(): Promise<any> {
    const now = new Date();
    const timeSinceLastCollection = now.getTime() - this.lastCollectionTime.getTime();
    
    return {
      lastCollectionTime: this.lastCollectionTime,
      timeSinceLastCollection: timeSinceLastCollection,
      dataFreshness: timeSinceLastCollection < 5 * 60 * 1000 ? 'fresh' : 'stale', // 5 minutes
      apiKeysConfigured: {
        weather: !!this.weatherApiKey,
        news: !!this.newsApiKey
      }
    };
  }
}
