import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProcessedEvent, NewsArticle, WeatherData, ShippingData } from '../../../utils/types';
import { config } from '../../../config/env';
import { logger } from '../../../config/logger';

export class LLMClassifier {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    if (config.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    } else {
      logger.warn('GEMINI_API_KEY not configured, using simulated classification');
    }
  }

  async classifyNewsEvent(article: NewsArticle): Promise<ProcessedEvent | null> {
    try {
      // If no AI model is available, use simulated classification
      if (!this.model) {
        return this.simulateNewsClassification(article);
      }

      const prompt = `
You are a supply chain disruption classifier. Analyze this news article and extract structured information about any supply chain disruptions.

Article:
Title: ${article.title}
Description: ${article.description}
Source: ${article.source}
Published: ${article.publishedAt}

Extract the following information as JSON:
{
  "type": "strike|weather|congestion|geopolitical|technical|other",
  "locationType": "port|warehouse|route|supplier|customer",
  "locationId": "specific location name",
  "severity": "low|medium|high|critical",
  "description": "brief description of the disruption",
  "startTime": "ISO timestamp",
  "confidence": 0.0-1.0,
  "source": "news"
}

If no supply chain disruption is detected, return null.
Only return valid JSON, no additional text.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      if (text.toLowerCase().includes('null') || text === '') {
        return null;
      }

      const event = JSON.parse(text);
      
      // Validate and normalize the event
      return this.validateAndNormalizeEvent(event, article);
    } catch (error) {
      logger.error('Failed to classify news event', error);
      return this.simulateNewsClassification(article);
    }
  }

  async classifyWeatherEvent(weatherData: WeatherData): Promise<ProcessedEvent | null> {
    try {
      // Only create events for high-risk weather conditions
      if (weatherData.riskLevel < 3) {
        return null;
      }

      // If no AI model is available, use simulated classification
      if (!this.model) {
        return this.simulateWeatherClassification(weatherData);
      }

      const prompt = `
Analyze this weather data and determine if it represents a supply chain disruption.

Weather Data:
Location: ${weatherData.location}
Temperature: ${weatherData.temperature}°C
Humidity: ${weatherData.humidity}%
Wind Speed: ${weatherData.windSpeed} m/s
Conditions: ${weatherData.conditions}
Risk Level: ${weatherData.riskLevel}/5

Extract the following information as JSON:
{
  "type": "weather",
  "locationType": "port",
  "locationId": "${weatherData.location}",
  "severity": "low|medium|high|critical",
  "description": "weather disruption description",
  "startTime": "current ISO timestamp",
  "confidence": 0.0-1.0,
  "source": "weather"
}

Only return valid JSON, no additional text.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      const event = JSON.parse(text);
      return this.validateAndNormalizeEvent(event, weatherData);
    } catch (error) {
      logger.error('Failed to classify weather event', {error, meta:weatherData});
      return this.simulateWeatherClassification(weatherData);
    }
  }

  async classifyShippingEvent(shippingData: ShippingData): Promise<ProcessedEvent | null> {
    try {
      // Only create events for significant delays
      if (shippingData.delay < 12) {
        return null;
      }

      // If no AI model is available, use simulated classification
      if (!this.model) {
        return this.simulateShippingClassification(shippingData);
      }

      const prompt = `
Analyze this shipping data and determine if it represents a supply chain disruption.

Shipping Data:
Vessel: ${shippingData.vesselId}
Location: ${shippingData.location}
Status: ${shippingData.status}
ETA: ${shippingData.eta}
Delay: ${shippingData.delay} hours

Extract the following information as JSON:
{
  "type": "congestion|technical|other",
  "locationType": "port",
  "locationId": "${shippingData.location}",
  "severity": "low|medium|high|critical",
  "description": "shipping disruption description",
  "startTime": "current ISO timestamp",
  "confidence": 0.0-1.0,
  "source": "shipping"
}

Only return valid JSON, no additional text.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      const event = JSON.parse(text);
      return this.validateAndNormalizeEvent(event, shippingData);
    } catch (error) {
      logger.error('Failed to classify shipping event', error);
      return this.simulateShippingClassification(shippingData);
    }
  }

  private validateAndNormalizeEvent(event: any, rawData: any): ProcessedEvent {
    // Validate required fields
    const requiredFields = ['type', 'locationType', 'locationId', 'severity', 'description', 'startTime'];
    for (const field of requiredFields) {
      if (!event[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Normalize the event
    return {
      type: event.type as ProcessedEvent['type'],
      locationType: event.locationType as ProcessedEvent['locationType'],
      locationId: event.locationId,
      severity: event.severity as ProcessedEvent['severity'],
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
      confidence: Math.min(Math.max(event.confidence || 0.5, 0), 1),
      source: event.source,
      rawData
    };
  }

  // Simulated classification methods for when AI is not available
  private simulateNewsClassification(article: NewsArticle): ProcessedEvent | null {
    // Simulate 20% chance of detecting a disruption
    if (Math.random() > 0.2) {
      return null;
    }

    const types: ProcessedEvent['type'][] = ['strike', 'geopolitical', 'technical', 'other'];
    const locationTypes: ProcessedEvent['locationType'][] = ['port', 'warehouse', 'supplier'];
    const severities: ProcessedEvent['severity'][] = ['low', 'medium', 'high'];

    const randomType = types[Math.floor(Math.random() * types.length)] || 'other';
    const randomLocationType = locationTypes[Math.floor(Math.random() * locationTypes.length)] || 'port';
    const randomSeverity = severities[Math.floor(Math.random() * severities.length)] || 'medium';

    return {
      type: randomType,
      locationType: randomLocationType,
      locationId: 'Simulated Location',
      severity: randomSeverity,
      description: `Simulated disruption based on: ${article.title}`,
      startTime: new Date().toISOString(),
      confidence: 0.6 + Math.random() * 0.3,
      source: 'news',
      rawData: article
    };
  }

  private simulateWeatherClassification(weatherData: WeatherData): ProcessedEvent | null {
    // Only create events for high-risk weather
    if (weatherData.riskLevel < 3) {
      return null;
    }

    const severities = ['medium', 'high', 'critical'] as const;
    const severity = weatherData.riskLevel >= 5 ? 'critical' : 
                    weatherData.riskLevel >= 4 ? 'high' : 'medium';

    return {
      type: 'weather',
      locationType: 'port',
      locationId: weatherData.location,
      severity,
      description: `${weatherData.conditions} conditions at ${weatherData.location} with ${weatherData.windSpeed} m/s winds`,
      startTime: new Date().toISOString(),
      confidence: 0.7 + Math.random() * 0.2,
      source: 'weather',
      rawData: weatherData
    };
  }

  private simulateShippingClassification(shippingData: ShippingData): ProcessedEvent | null {
    // Only create events for significant delays
    if (shippingData.delay < 12) {
      return null;
    }

    const types: ProcessedEvent['type'][] = ['congestion', 'technical', 'other'];
    const randomType = types[Math.floor(Math.random() * types.length)] || 'other';
    const severity: ProcessedEvent['severity'] = shippingData.delay > 48 ? 'critical' : 
                                                shippingData.delay > 24 ? 'high' : 'medium';

    return {
      type: randomType,
      locationType: 'port',
      locationId: shippingData.location,
      severity,
      description: `Vessel ${shippingData.vesselId} delayed by ${shippingData.delay} hours at ${shippingData.location}`,
      startTime: new Date().toISOString(),
      confidence: 0.8 + Math.random() * 0.15,
      source: 'shipping',
      rawData: shippingData
    };
  }
}

