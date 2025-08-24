// AI Agent API service for frontend
const AI_AGENT_BASE_URL = 'http://localhost:3000/api/ai-agent'; // Backend runs on port 3000

const aiAgentRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${AI_AGENT_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('AI Agent API request failed:', error);
    throw error;
  }
};

export const aiAgentAPI = {
  /**
   * Process a chatbot query through the AI agent
   */
  processQuery: async (query: string) => {
    const response = await aiAgentRequest('/query', {
      method: 'POST',
      body: JSON.stringify({ query })
    });
    return response.data;
  },

  /**
   * Get AI agent health status
   */
  getHealth: async () => {
    const response = await aiAgentRequest('/health');
    return response.data;
  },

  /**
   * Test the AI agent with a sample query
   */
  testQuery: async () => {
    const response = await aiAgentRequest('/test');
    return response.data;
  }
};

export default aiAgentAPI;
