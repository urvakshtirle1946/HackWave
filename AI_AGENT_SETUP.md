# 🤖 AI Agent Setup Guide

This guide will help you set up the intelligent AI Agent that powers your supply chain chatbot with GroqCloud LLM integration.

## 🎯 What This System Does

The AI Agent acts as a bridge between your chatbot and your supply chain database:

1. **User asks a question** in the chatbot
2. **AI Agent analyzes** the query to understand what data is needed
3. **Database queries** are executed to retrieve relevant information
4. **Data is formatted** and sent to GroqCloud LLM
5. **LLM generates** an intelligent, data-driven response
6. **Response is returned** to the user through the chatbot

## 🚀 Features

- **Intelligent Query Analysis**: Automatically detects what data entities are needed
- **Smart Data Retrieval**: Fetches only relevant data based on context
- **GroqCloud Integration**: Uses state-of-the-art LLM for natural responses
- **Fallback System**: Works even when GroqCloud is unavailable
- **Real-time Data**: Always provides current information from your database
- **Context Awareness**: Understands time ranges, filters, and relationships

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- GroqCloud API key
- Backend server running on port 3000
- Frontend running on port 5173 (Vite default)

## 🔧 Setup Instructions

### 1. Backend Setup

#### Install Dependencies
```bash
cd HackWave/backend
npm install
```

#### Environment Configuration
1. Copy the environment example file:
```bash
cp env.example .env
```

2. Edit `.env` and add your configuration:
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/supply_chain_db"

# Server Configuration
PORT=3000
NODE_ENV=development

# GroqCloud API Configuration
GROQ_API_KEY="your_actual_groq_api_key_here"
```

**Note**: We use port 3000 instead of 5000 to avoid conflicts with Apple's AirTunes service on macOS.

#### Get Your GroqCloud API Key
1. Go to [GroqCloud](https://console.groq.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it in your `.env` file

#### Start the Backend
```bash
npm run dev
# or
npm start
```

### 2. Frontend Setup

#### Install Dependencies
```bash
cd HackWave/frontend
npm install
```

#### Start the Frontend
```bash
npm run dev
```

## 🧪 Testing the System

### 1. Test AI Agent Health
```bash
curl http://localhost:3000/api/ai-agent/health
```

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "groqApiConfigured": true,
    "timestamp": "2024-01-XX..."
  }
}
```

### 2. Test AI Agent Query
```bash
curl -X POST http://localhost:3000/api/ai-agent/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the current status of our shipments?"}'
```

### 3. Test in Chatbot
1. Open your frontend application
2. Click the chatbot icon
3. Ask questions like:
   - "Show me current shipment status"
   - "What are the active disruptions?"
   - "Give me inventory overview"
   - "How is our transportation performing?"

## 🔍 How It Works

### Query Analysis
The AI Agent analyzes user queries to understand:
- **Entities needed**: shipments, suppliers, customers, warehouses, etc.
- **Time context**: today, this week, this month
- **Filters**: status, mode, severity, etc.

### Data Retrieval
Based on analysis, the agent queries your database:
- **Smart filtering**: Only retrieves relevant data
- **Relationship handling**: Includes related entities
- **Performance optimization**: Limits results to prevent overwhelming responses

### LLM Integration
Data is formatted and sent to GroqCloud:
- **Structured prompts**: Clear system and user instructions
- **Context preservation**: Maintains query context
- **Fallback handling**: Graceful degradation if API fails

## 📊 Supported Query Types

### Shipments & Logistics
- Current shipment status
- Delivery performance
- Route optimization
- Cost analysis
- Risk assessment

### Inventory & Warehousing
- Stock levels
- Reorder points
- Warehouse capacity
- Storage optimization

### Risk & Disruptions
- Active alerts
- Impact analysis
- Mitigation strategies
- Trend analysis

### Performance Analytics
- KPI tracking
- Trend analysis
- Comparative insights
- Recommendations

## 🛠️ Troubleshooting

### Common Issues

#### 1. "GROQ_API_KEY not found" Warning
- Check your `.env` file
- Ensure the key is properly set
- Restart the backend server

#### 2. Database Connection Errors
- Verify DATABASE_URL in `.env`
- Check PostgreSQL is running
- Ensure database exists and is accessible

#### 3. Frontend Can't Connect to Backend
- Verify backend is running on port 3000
- Check CORS configuration
- Ensure no firewall blocking

#### 4. Port Conflicts (macOS)
- Port 5000 is used by Apple's AirTunes service
- Use port 3000 for your backend
- Update all configuration files accordingly

#### 5. Slow Response Times
- Check database performance
- Monitor GroqCloud API response times
- Consider query optimization

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=ai-agent:*
```

## 🔒 Security Considerations

1. **API Key Protection**: Never commit your GroqCloud API key to version control
2. **Database Access**: Use read-only database user for AI agent queries
3. **Rate Limiting**: Consider implementing rate limiting for chatbot queries
4. **Input Validation**: All user inputs are validated before processing

## 📈 Performance Optimization

### Database Queries
- Implement query caching for common requests
- Use database indexes for frequently queried fields
- Limit result sets to prevent memory issues

### LLM Integration
- Cache common responses
- Implement request batching
- Monitor API usage and costs

### Frontend
- Implement response caching
- Add loading states for better UX
- Optimize re-renders

## 🔮 Future Enhancements

### Planned Features
- **Multi-language Support**: Support for different languages
- **Voice Integration**: Voice-to-text and text-to-voice
- **Advanced Analytics**: Predictive insights and recommendations
- **Integration APIs**: Connect with external systems
- **Custom Workflows**: User-defined automation rules

### Customization Options
- **Prompt Engineering**: Customize LLM prompts
- **Data Sources**: Add external data integrations
- **Response Templates**: Custom response formats
- **Business Rules**: Industry-specific logic

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review backend logs for error details
3. Verify all environment variables are set
4. Test individual components separately
5. Check GroqCloud API status

## 🎉 Success Indicators

Your AI Agent is working correctly when:

✅ Backend health check returns "healthy"  
✅ GroqCloud API shows as configured  
✅ Chatbot responds with intelligent, data-driven answers  
✅ Response times are under 5 seconds  
✅ No database connection errors in logs  

---

**Happy AI-powered supply chain management! 🚀**
