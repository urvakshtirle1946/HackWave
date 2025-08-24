import { Router } from 'express';
import AIAgentController from '../controllers/aiAgentController';

const router = Router();

/**
 * @route POST /api/ai-agent/query
 * @desc Process a chatbot query through the AI agent
 * @access Public
 */
router.post('/query', AIAgentController.processQuery);

/**
 * @route GET /api/ai-agent/health
 * @desc Get AI agent health status
 * @access Public
 */
router.get('/health', AIAgentController.getHealth);

/**
 * @route GET /api/ai-agent/test
 * @desc Test the AI agent with a sample query
 * @access Public
 */
router.get('/test', AIAgentController.testQuery);

export default router;
