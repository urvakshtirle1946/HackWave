import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from '../config/logger';

export interface HttpOptions extends AxiosRequestConfig {
  retries?: number;
  retryDelay?: number;
}

class HttpClient {
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async get<T = any>(url: string, options: HttpOptions = {}): Promise<T> {
    const { retries = 3, retryDelay = 1000, ...axiosOptions } = options;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        logger.debug(`HTTP GET attempt ${attempt}/${retries}`, { url });
        
        const response: AxiosResponse<T> = await axios.get(url, {
          timeout: 10000,
          ...axiosOptions,
        });
        
        return response.data;
      } catch (error: any) {
        logger.warn(`HTTP GET attempt ${attempt} failed`, { 
          url, 
          error: error.message,
          status: error.response?.status 
        });
        
        if (attempt === retries) {
          throw error;
        }
        
        await this.delay(retryDelay * attempt);
      }
    }
    
    throw new Error('Max retries exceeded');
  }

  async post<T = any>(url: string, data: any, options: HttpOptions = {}): Promise<T> {
    const { retries = 3, retryDelay = 1000, ...axiosOptions } = options;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        logger.debug(`HTTP POST attempt ${attempt}/${retries}`, { url });
        
        const response: AxiosResponse<T> = await axios.post(url, data, {
          timeout: 10000,
          ...axiosOptions,
        });
        
        return response.data;
      } catch (error: any) {
        logger.warn(`HTTP POST attempt ${attempt} failed`, { 
          url, 
          error: error.message,
          status: error.response?.status 
        });
        
        if (attempt === retries) {
          throw error;
        }
        
        await this.delay(retryDelay * attempt);
      }
    }
    
    throw new Error('Max retries exceeded');
  }
}

export const httpClient = new HttpClient();

