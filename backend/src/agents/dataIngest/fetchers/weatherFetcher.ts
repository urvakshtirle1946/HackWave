import { httpClient } from '../../../utils/http';
import { WeatherData } from '../../../utils/types';
import { config } from '../../../config/env';
import { logger } from '../../../config/logger';

export class WeatherFetcher {
  private apiKey = config.RAPIDAPI_KEY;
  private useRapidAPI = !!config.RAPIDAPI_KEY;
  
  // Major ports and logistics hubs to monitor
  private locations = [
    'Shanghai,CN',
    'Rotterdam,NL', 
    'Singapore,SG',
    'Los Angeles,US',
    'Hamburg,DE',
    'Dubai,AE',
    'Mumbai,IN',
    'Busan,KR',
    'Antwerp,BE',
    'Long Beach,US'
  ];

  async fetchWeatherData(): Promise<WeatherData[]> {
    const weatherData: WeatherData[] = [];

    for (const location of this.locations) {
      try {
        const data = await this.fetchLocationWeather(location);
        weatherData.push(data);
      } catch (error) {
        logger.error(`Failed to fetch weather for ${location}`, error);
        // Add simulated data as fallback
        weatherData.push(this.getSimulatedWeather(location));
      }
    }

    return weatherData;
  }

  private async fetchLocationWeather(location: string): Promise<WeatherData> {
    if (!this.apiKey) {
      logger.warn('Weather API key not configured, using simulated data');
      return this.getSimulatedWeather(location);
    }

    let response: any;
    
    if (this.useRapidAPI) {
      // Use RapidAPI OpenWeather endpoint
      const cityName = location.split(',')[0] || location; // Extract city name from "City,Country" format
      const url = `https://open-weather13.p.rapidapi.com/city?city=${encodeURIComponent(cityName)}&lang=EN`;
      
      response = await httpClient.get<any>(url, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com'
        }
      });
    } else {
      // Fallback to direct OpenWeatherMap API
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${this.apiKey}&units=metric`;
      response = await httpClient.get<any>(url);
    }
    
    return this.parseWeatherResponse(response, location);
  }

  private parseWeatherResponse(response: any, originalLocation: string): WeatherData {
    let location: string;
    let temperature: number;
    let humidity: number;
    let windSpeed: number;
    let conditions: string;

    if (this.useRapidAPI) {
      // Parse RapidAPI response structure
      location = response.name || originalLocation;
      temperature = response.main?.temp || 0;
      humidity = response.main?.humidity || 0;
      windSpeed = response.wind?.speed || 0;
      conditions = response.weather?.[0]?.main || 'Unknown';
    } else {
      // Parse direct OpenWeatherMap response structure
      location = response.name || originalLocation;
      temperature = response.main?.temp || 0;
      humidity = response.main?.humidity || 0;
      windSpeed = response.wind?.speed || 0;
      conditions = response.weather?.[0]?.main || 'Unknown';
    }
    
    return {
      location,
      temperature,
      humidity,
      windSpeed,
      conditions,
      riskLevel: this.calculateWeatherRisk(conditions, windSpeed)
    };
  }

  private getSimulatedWeather(location: string): WeatherData {
    const conditions = ['Clear', 'Clouds', 'Rain', 'Storm', 'Fog', 'Snow'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)] || 'Clear';
    
    return {
      location: location,
      temperature: Math.floor(Math.random() * 30) - 5, // -5 to 25°C
      humidity: Math.floor(Math.random() * 60) + 20, // 20-80%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 m/s
      conditions: randomCondition,
      riskLevel: this.calculateWeatherRisk(randomCondition, Math.floor(Math.random() * 20) + 5)
    };
  }

  private calculateWeatherRisk(condition: string, windSpeed: number): number {
    let risk = 1; // Base risk

    // Condition-based risk
    switch (condition.toLowerCase()) {
      case 'storm':
      case 'thunderstorm':
        risk = 5;
        break;
      case 'rain':
      case 'drizzle':
        risk = 3;
        break;
      case 'snow':
        risk = 4;
        break;
      case 'fog':
      case 'mist':
        risk = 2;
        break;
      case 'clouds':
        risk = 1;
        break;
      default:
        risk = 1;
    }

    // Wind speed risk
    if (windSpeed > 15) risk = Math.max(risk, 4);
    if (windSpeed > 25) risk = 5;

    return Math.min(risk, 5);
  }
}

