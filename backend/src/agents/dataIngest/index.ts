import { NewsFetcher } from './fetchers/newsFetcher';
import { WeatherFetcher } from './fetchers/weatherFetcher';
import { ShippingFetcher } from './fetchers/shippingFetcher';
import { LLMClassifier } from './processors/llmClassifier';
import { DisruptionService } from './services/disruptionService';
import { IngestResult } from '../../utils/types';
import { logger } from '../../config/logger';
import { config } from '../../config/env';

export class DataIngestAgent {
  private newsFetcher: NewsFetcher;
  private weatherFetcher: WeatherFetcher;
  private shippingFetcher: ShippingFetcher;
  private llmClassifier: LLMClassifier;
  private disruptionService: DisruptionService;

  constructor() {
    this.newsFetcher = new NewsFetcher();
    this.weatherFetcher = new WeatherFetcher();
    this.shippingFetcher = new ShippingFetcher();
    this.llmClassifier = new LLMClassifier();
    this.disruptionService = new DisruptionService();
  }

  async runDataIngest(): Promise<IngestResult> {
    logger.info('🚀 Starting data ingestion process');
    
    const result: IngestResult = {
      processed: 0,
      stored: 0,
      errors: 0,
      events: []
    };

    try {
      // 1. Fetch news data
      logger.info('📰 Fetching news data');
      const newsArticles = await this.newsFetcher.fetchSupplyChainNews();
      result.processed += newsArticles.length;

      // 2. Fetch weather data
      logger.info('🌦️ Fetching weather data');
      const weatherData = await this.weatherFetcher.fetchWeatherData();
      result.processed += weatherData.length;

      // 3. Fetch shipping data
      logger.info('🚢 Fetching shipping data');
      const shippingData = await this.shippingFetcher.fetchShippingData();
      result.processed += shippingData.length;

      // 4. Process news events
      logger.info('🤖 Processing news events with AI');
      for (const article of newsArticles) {
        try {
          const event = await this.llmClassifier.classifyNewsEvent(article);
          if (event) {
            result.events.push(event);
            await this.storeEvent(event);
            result.stored++;
          }
        } catch (error) {
          logger.error('Failed to process news event', error);
          result.errors++;
        }
      }

      // 5. Process weather events
      logger.info('🤖 Processing weather events with AI');
      for (const weather of weatherData) {
        try {
          const event = await this.llmClassifier.classifyWeatherEvent(weather);
          if (event) {
            result.events.push(event);
            await this.storeEvent(event);
            result.stored++;
          }
        } catch (error) {
          logger.error('Failed to process weather event', error);
          result.errors++;
        }
      }

      // 6. Process shipping events
      logger.info('🤖 Processing shipping events with AI');
      for (const shipping of shippingData) {
        try {
          const event = await this.llmClassifier.classifyShippingEvent(shipping);
          if (event) {
            result.events.push(event);
            await this.storeEvent(event);
            result.stored++;
          }
        } catch (error) {
          logger.error('Failed to process shipping event', error);
          result.errors++;
        }
      }

      // 7. Update port statuses
      logger.info('🏠 Updating port statuses');
      const portStatuses = await this.shippingFetcher.fetchPortStatus();
      for (const port of portStatuses) {
        try {
          await this.disruptionService.updatePortStatus(port.name, port.status);
        } catch (error) {
          logger.error('Failed to update port status', error);
          result.errors++;
        }
      }

      logger.info('✅ Data ingestion completed', {
        processed: result.processed,
        stored: result.stored,
        errors: result.errors
      });

    } catch (error) {
      logger.error('❌ Data ingestion failed', error);
      result.errors++;
    }

    return result;
  }

  private async storeEvent(event: any): Promise<void> {
    try {
      const disruptionId = await this.disruptionService.storeDisruption(event);
      
      // If the event has affected shipments, link them
      if (event.affectedShipments) {
        await this.disruptionService.linkDisruptionToShipments(disruptionId, event);
      }

      logger.info('Event stored successfully', { 
        type: event.type, 
        location: event.location,
        disruptionId 
      });
    } catch (error) {
      logger.error('Failed to store event', error);
      throw error;
    }
  }

  async getActiveDisruptions(): Promise<any[]> {
    return await this.disruptionService.getActiveDisruptions();
  }

  async resolveDisruption(disruptionId: string): Promise<void> {
    await this.disruptionService.resolveDisruption(disruptionId);
  }
}

// Export a singleton instance
export const dataIngestAgent = new DataIngestAgent();

// Export the main function for direct execution
export async function runDataIngest(): Promise<IngestResult> {
  return await dataIngestAgent.runDataIngest();
}

