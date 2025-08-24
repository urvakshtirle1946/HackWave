#!/usr/bin/env node

/**
 * Simple test script for the AI Agent
 * Run this to test if your AI agent is working correctly
 */

const testAIAgent = async () => {
  console.log('🧪 Testing AI Agent...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await fetch('http://localhost:3000/api/ai-agent/health');
    const healthData = await healthResponse.json();
    
    if (healthData.success) {
      console.log('✅ Health Check: PASSED');
      console.log(`   Status: ${healthData.data.status}`);
      console.log(`   Groq API Configured: ${healthData.data.groqApiConfigured}`);
    } else {
      console.log('❌ Health Check: FAILED');
      console.log(`   Error: ${healthData.error}`);
    }

    console.log('');

    // Test 2: Sample Query
    console.log('2️⃣ Testing Sample Query...');
    const queryResponse = await fetch('http://localhost:3000/api/ai-agent/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: 'What is the current status of our shipments?'
      })
    });
    
    const queryData = await queryResponse.json();
    
    if (queryData.success) {
      console.log('✅ Sample Query: PASSED');
      console.log(`   Response Length: ${queryData.data.response.length} characters`);
      console.log(`   Response Preview: ${queryData.data.response.substring(0, 100)}...`);
    } else {
      console.log('❌ Sample Query: FAILED');
      console.log(`   Error: ${queryData.data.error}`);
    }

    console.log('');

    // Test 3: Test Endpoint
    console.log('3️⃣ Testing Test Endpoint...');
    const testResponse = await fetch('http://localhost:3000/api/ai-agent/test');
    const testData = await testResponse.json();
    
    if (testData.success) {
      console.log('✅ Test Endpoint: PASSED');
      console.log(`   Test Query: ${testData.data.testQuery}`);
      console.log(`   Response Length: ${testData.data.response.length} characters`);
    } else {
      console.log('❌ Test Endpoint: FAILED');
      console.log(`   Error: ${testData.data.error}`);
    }

    console.log('\n🎉 AI Agent Testing Complete!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n💡 Make sure your backend server is running on port 3000');
    console.log('💡 Check that your .env file has the correct GROQ_API_KEY');
  }
};

// Run the test
testAIAgent();
