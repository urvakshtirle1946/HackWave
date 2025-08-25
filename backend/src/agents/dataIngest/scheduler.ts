import { runDataIngest } from './index';
import { logger } from '../../config/logger';
import { config } from '../../config/env';

export class DataIngestScheduler {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  start(): void {
    if (this.isRunning) {
      logger.warn('Data ingest scheduler is already running');
      return;
    }

    const intervalMinutes = config.INGEST_INTERVAL_MINUTES;
    const intervalMs = intervalMinutes * 60 * 1000;

    logger.info(`Starting data ingest scheduler (interval: ${intervalMinutes} minutes)`);

    // Run immediately on start
    this.runIngest();

    // Schedule periodic runs
    this.intervalId = setInterval(() => {
      this.runIngest();
    }, intervalMs);

    this.isRunning = true;
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    logger.info('Data ingest scheduler stopped');
  }

  private async runIngest(): Promise<void> {
    try {
      logger.info('🔄 Running scheduled data ingestion');
      const result = await runDataIngest();
      
      logger.info('✅ Scheduled ingestion completed', {
        processed: result.processed,
        stored: result.stored,
        errors: result.errors
      });
    } catch (error) {
      logger.error('❌ Scheduled ingestion failed', error);
    }
  }

  async runOnce(): Promise<void> {
    logger.info('🔄 Running one-time data ingestion');
    await this.runIngest();
  }

  isActive(): boolean {
    return this.isRunning;
  }
}

// Export a singleton instance
export const dataIngestScheduler = new DataIngestScheduler();

