import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().optional(),
  
  // AI APIs
  GEMINI_API_KEY: z.string().optional(),
  
  // External APIs (optional)
  OPENWEATHER_API_KEY: z.string().optional(),
  NEWS_API_KEY: z.string().optional(),
  RAPIDAPI_KEY: z.string().optional(),
  
  // Server
  PORT: z.string().transform(Number).default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Agent Configuration
  INGEST_INTERVAL_MINUTES: z.string().transform(Number).default('15'),
  MAX_CONCURRENT_REQUESTS: z.string().transform(Number).default('5'),
});

export const config = envSchema.parse(process.env);

export type Config = z.infer<typeof envSchema>;

