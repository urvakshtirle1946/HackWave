import { httpClient } from '../../../utils/http';
import { NewsArticle } from '../../../utils/types';
import { config } from '../../../config/env';
import { logger } from '../../../config/logger';

export class NewsFetcher {
  private apiKey = config.NEWS_API_KEY;

  async fetchSupplyChainNews(): Promise<NewsArticle[]> {
    try {
      if (!this.apiKey) {
        logger.warn('News API key not configured, using simulated data');
        return this.getSimulatedNews();
      }

      const query = 'supply chain logistics shipping port congestion strike disruption';
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${this.apiKey}&sortBy=publishedAt&pageSize=20&language=en`;

      const response = await httpClient.get<any>(url);
      
      if (response.status !== 'ok') {
        throw new Error(`News API error: ${response.message}`);
      }

      return response.articles.map((article: any) => ({
        title: article.title,
        description: article.description || '',
        publishedAt: article.publishedAt,
        url: article.url,
        source: article.source?.name || 'Unknown'
      }));

    } catch (error) {
      logger.error('Failed to fetch news from API, using simulated data', error);
      return this.getSimulatedNews();
    }
  }

  private getSimulatedNews(): NewsArticle[] {
    const simulatedNews = [
      {
        title: "Dock Workers Strike at Port of Shanghai Affects Global Supply Chains",
        description: "A major strike by dock workers at the Port of Shanghai has caused significant delays in container processing, affecting supply chains worldwide. The strike, which began yesterday, has already caused delays of up to 48 hours for vessels waiting to berth.",
        publishedAt: new Date().toISOString(),
        url: "https://example.com/news1",
        source: "Maritime News"
      },
      {
        title: "Severe Weather Conditions Force Port of Rotterdam to Reduce Operations",
        description: "Heavy storms and high winds have forced the Port of Rotterdam to reduce its operations by 60%. The weather conditions are expected to continue for the next 48 hours, causing delays for vessels in the North Sea region.",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        url: "https://example.com/news2",
        source: "Port Authority"
      },
      {
        title: "New Sanctions Impact Shipping Routes Through Black Sea",
        description: "Recent geopolitical developments have led to new sanctions affecting shipping routes through the Black Sea. Several major shipping companies are rerouting vessels to avoid the affected areas, adding 3-5 days to transit times.",
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        url: "https://example.com/news3",
        source: "Trade Journal"
      },
      {
        title: "Container Shortage Crisis Worsens in Asia-Pacific Region",
        description: "The ongoing container shortage crisis in the Asia-Pacific region has worsened, with major ports reporting empty container shortages of up to 40%. This is causing significant delays in cargo loading and increased freight rates.",
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        url: "https://example.com/news4",
        source: "Logistics Weekly"
      },
      {
        title: "Major Cyber Attack Disrupts Port Management Systems in Singapore",
        description: "A sophisticated cyber attack has disrupted port management systems at the Port of Singapore, causing delays in vessel scheduling and cargo processing. Authorities are working to restore systems while maintaining security protocols.",
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        url: "https://example.com/news5",
        source: "Cyber Security News"
      }
    ];

    return simulatedNews;
  }
}

