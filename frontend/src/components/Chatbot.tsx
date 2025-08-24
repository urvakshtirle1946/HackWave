import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Minimize2, Maximize2, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import aiAgentAPI from '../services/aiAgentApi';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  data?: any; // Store any additional data from AI agent
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Hello! I\'m your intelligent Supply Chain AI Assistant. I have access to your real-time data and can help you with:\n\n• Shipment status and tracking\n• Risk assessment and disruptions\n• Inventory and warehouse management\n• Supplier and customer insights\n• Route optimization and costs\n• Performance analytics\n\nHow can I help you today?',
    sender: 'bot',
    timestamp: new Date()
  }
];

const quickActions = [
  'Show current shipment status',
  'What are the active disruptions?',
  'Inventory levels overview',
  'Risk assessment summary',
  'Transportation performance',
  'Cost analysis insights'
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentHealth, setAgentHealth] = useState<{ status: string; groqApiConfigured: boolean } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check AI agent health when component mounts
    checkAgentHealth();
  }, []);

  const checkAgentHealth = async () => {
    try {
      const health = await aiAgentAPI.getHealth();
      setAgentHealth(health);
    } catch (error) {
      console.error('Failed to check AI agent health:', error);
      setAgentHealth({ status: 'unhealthy', groqApiConfigured: false });
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    try {
      // Add a temporary bot message with loading state
      const tempBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thinking...',
        sender: 'bot',
        timestamp: new Date(),
        status: 'sending'
      };
      setMessages(prev => [...prev, tempBotMessage]);

      // Process query through AI agent
      const response = await aiAgentAPI.processQuery(text.trim());
      
      // Update the bot message with the response
      setMessages(prev => prev.map(msg => 
        msg.id === tempBotMessage.id 
          ? { ...msg, text: response.response, status: 'sent', data: response }
          : msg
      ));
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Update the bot message with error
      setMessages(prev => prev.map(msg => 
        msg.id === (Date.now() + 1).toString()
          ? { 
              ...msg, 
              text: 'I apologize, but I encountered an error while processing your request. Please try again or contact support if the issue persists.',
              status: 'error'
            }
          : msg
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-400" />;
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 relative"
        >
          <Bot className="h-6 w-6" />
          {agentHealth && (
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
              agentHealth.status === 'healthy' ? 'bg-green-400' : 'bg-red-400'
            }`} />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center relative">
              <Bot className="h-4 w-4 text-white" />
              {agentHealth && (
                <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                  agentHealth.status === 'healthy' ? 'bg-green-400' : 'bg-red-400'
                }`} />
              )}
            </div>
            <div>
              <h3 className="text-white font-semibold">AI Assistant</h3>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-white/70">Supply Chain Support</p>
                {agentHealth && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    agentHealth.status === 'healthy' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {agentHealth.groqApiConfigured ? 'AI Powered' : 'Basic Mode'}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white/70 hover:text-white transition-colors"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-white border border-white/20'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {message.status && getStatusIcon(message.status)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="px-4 pb-4">
                <p className="text-xs text-white/70 mb-2">Quick actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action)}
                      disabled={isProcessing}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed text-white text-xs rounded-full border border-white/20 transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your supply chain..."
                  disabled={isProcessing}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isProcessing}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
              {isProcessing && (
                <p className="text-xs text-blue-400 mt-2 text-center">
                  Processing your request...
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
