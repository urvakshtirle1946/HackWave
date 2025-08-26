import { runDataIngest } from './agents/dataIngest';
import { logger } from './config/logger';
import { dataIngestScheduler } from './agents/dataIngest/scheduler';

async function testDataIngest() {
  try {
    logger.info('🧪 Testing Data Ingest Agent...');
    const result = await runDataIngest();
    
    logger.info('✅ Test completed successfully!', {
      processed: result.processed,
      stored: result.stored,
      errors: result.errors,
      events: result.events.length
    });
    
    if (result.events.length > 0) {
      logger.info('📊 Sample events:', result.events.slice(0, 3));
    }
    
    await dataIngestScheduler.start();
  } catch (error) {
    logger.error('❌ Test failed:', error);
  }
}

// Run the test
testDataIngest();

