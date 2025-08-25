// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { PrismaClient } from '@prisma/client';
// import { dataIngestScheduler } from './agents/dataIngest/scheduler';
// import { logger } from './config/logger';
// import { config } from './config/env';

// dotenv.config();

// const app = express();
// const prisma = new PrismaClient();
// const PORT = config.PORT;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Data Ingest Agent endpoints
// app.post('/api/ingest/run', async (req, res) => {
//   try {
//     await dataIngestScheduler.runOnce();
//     res.json({ success: true, message: 'Data ingestion completed' });
//   } catch (error) {
//     logger.error('Data ingestion failed', error);
//     res.status(500).json({ error: 'Data ingestion failed' });
//   }
// });

// app.post('/api/ingest/start', (req, res) => {
//   try {
//     dataIngestScheduler.start();
//     res.json({ success: true, message: 'Data ingest scheduler started' });
//   } catch (error) {
//     logger.error('Failed to start scheduler', error);
//     res.status(500).json({ error: 'Failed to start scheduler' });
//   }
// });

// app.post('/api/ingest/stop', (req, res) => {
//   try {
//     dataIngestScheduler.stop();
//     res.json({ success: true, message: 'Data ingest scheduler stopped' });
//   } catch (error) {
//     logger.error('Failed to stop scheduler', error);
//     res.status(500).json({ error: 'Failed to stop scheduler' });
//   }
// });

// app.get('/api/ingest/status', (req, res) => {
//   res.json({ 
//     active: dataIngestScheduler.isActive(),
//     interval: config.INGEST_INTERVAL_MINUTES
//   });
// });

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// });

// // Error handling middleware
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   logger.error('Server error', err);
//   res.status(500).json({ error: 'Something went wrong!' });
// });

// async function startServer() {
//   try {
//     await prisma.$connect();
//     logger.info('✅ Database connected successfully');

//     app.listen(PORT, () => {
//       logger.info(`🚀 Data Ingest Server running on http://localhost:${PORT}`);
      
//       // Start the data ingest scheduler in development mode
//       if (config.NODE_ENV === 'development') {
//         dataIngestScheduler.start();
//       }
//     });
//   } catch (error) {
//     logger.error('❌ Failed to start server:', error);
//     process.exit(1);
//   }
// }

// startServer();

// export { prisma };
