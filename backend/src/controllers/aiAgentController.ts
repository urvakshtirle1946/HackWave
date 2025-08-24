import { Request, Response } from 'express';
import AIAgentService from '../services/aiAgentService';

const aiAgentService = new AIAgentService();

export class AIAgentController {
  /**
   * Process a chatbot query and return an intelligent response
   */
  static async processQuery(req: Request, res: Response) {
    try {
      const { query } = req.body;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Query is required and must be a string'
        });
      }

      console.log(`Processing AI agent query: ${query}`);
      
      // Process the query through the AI agent
      const response = await aiAgentService.processQuery(query);
      
      console.log(`AI agent response generated successfully`);
      
      return res.json({
        success: true,
        data: {
          response,
          query,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error in AI agent controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error while processing query'
      });
    }
  }

  /**
   * Get AI agent health status
   */
  static async getHealth(req: Request, res: Response) {
    try {
      const hasGroqKey = !!process.env.GROQ_API_KEY;
      
      return res.json({
        success: true,
        data: {
          status: 'healthy',
          groqApiConfigured: hasGroqKey,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error getting AI agent health:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error while checking health'
      });
    }
  }

  /**
   * Test the AI agent with a sample query
   */
  static async testQuery(req: Request, res: Response) {
    try {
      const testQuery = "What is the current status of our shipments?";
      
      console.log(`Testing AI agent with query: ${testQuery}`);
      
      const response = await aiAgentService.processQuery(testQuery);
      
      return res.json({
        success: true,
        data: {
          testQuery,
          response,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error testing AI agent:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error while testing AI agent'
      });
    }
  }
}

export default AIAgentController;
