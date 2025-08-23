import { AgentOrchestrator } from './agents/AgentOrchestrator';
import { mockShipments, mockDisruptions } from './data/mockData';

async function testSystem() {
  console.log('🚀 Testing Supply Chain AI Agents System\n');

  // Initialize the orchestrator
  const orchestrator = new AgentOrchestrator();
  
  try {
    // Test 1: Get agent status
    console.log('📊 Test 1: Agent Status');
    const agentStatus = orchestrator.getAgentStatus();
    console.log(`✅ Total Agents: ${agentStatus.totalAgents}`);
    console.log(`✅ Active Agents: ${agentStatus.activeAgents}`);
    console.log(`✅ Available Workflows: ${orchestrator.getAvailableWorkflows().length}\n`);

    // Test 2: Full Risk Assessment
    console.log('🔍 Test 2: Full Risk Assessment');
    const riskAssessment = await orchestrator.process({
      workflow: 'full_risk_assessment',
      inputData: {
        shipments: mockShipments,
        disruptions: mockDisruptions
      }
    });
    
    console.log(`✅ Risk Assessment Completed`);
    console.log(`✅ Total Shipments: ${riskAssessment.data.result.summary.totalShipments}`);
    console.log(`✅ High Risk Shipments: ${riskAssessment.data.result.summary.highRiskShipments}`);
    console.log(`✅ Overall Risk Level: ${riskAssessment.data.result.summary.overallRiskLevel}`);
    console.log(`✅ Total Recommendations: ${riskAssessment.data.result.summary.totalRecommendations}\n`);

    // Test 3: Scenario Simulation
    console.log('🎯 Test 3: Port Closure Simulation');
    const simulation = await orchestrator.process({
      workflow: 'scenario_simulation',
      inputData: {
        scenarioType: 'port_closure',
        scenarioParams: {
          portId: 'port_singapore',
          closureDuration: 72,
          reason: 'technical failure'
        }
      }
    });
    
    console.log(`✅ Simulation Completed`);
    console.log(`✅ Scenario: ${simulation.data.result.summary.scenarioName}`);
    console.log(`✅ Affected Shipments: ${simulation.data.result.summary.affectedShipments}`);
    console.log(`✅ Total Delay: ${simulation.data.result.summary.totalDelay} hours`);
    console.log(`✅ Cost Increase: $${simulation.data.result.summary.totalCostIncrease.toLocaleString()}\n`);

    // Test 4: Real-time Monitoring
    console.log('📡 Test 4: Real-time Monitoring');
    const monitoring = await orchestrator.process({
      workflow: 'real_time_monitoring',
      inputData: {}
    });
    
    console.log(`✅ Monitoring Completed`);
    console.log(`✅ Total Alerts: ${monitoring.data.result.summary.totalAlerts}`);
    console.log(`✅ Critical Alerts: ${monitoring.data.result.summary.criticalAlerts}`);
    console.log(`✅ High Risk Shipments: ${monitoring.data.result.summary.highRiskShipments}\n`);

    // Test 5: Strategic Planning
    console.log('📈 Test 5: Strategic Planning');
    const strategicPlanning = await orchestrator.process({
      workflow: 'strategic_planning',
      inputData: {
        scenarios: [
          {
            type: 'port_closure',
            params: { portId: 'port_singapore', closureDuration: 72, reason: 'technical failure' }
          },
          {
            type: 'weather_event',
            params: { locationId: 'port_rotterdam', eventType: 'Storm', severity: 'high', duration: 48 }
          }
        ]
      }
    });
    
    console.log(`✅ Strategic Planning Completed`);
    console.log(`✅ Total Scenarios: ${strategicPlanning.data.result.summary.totalScenarios}`);
    console.log(`✅ Total Recommendations: ${strategicPlanning.data.result.summary.totalRecommendations}`);
    console.log(`✅ Total Investment: $${strategicPlanning.data.result.summary.totalInvestment.toLocaleString()}`);
    console.log(`✅ Expected ROI: ${strategicPlanning.data.result.summary.expectedROI}\n`);

    // Test 6: Custom Workflow
    console.log('⚙️ Test 6: Custom Workflow');
    const customWorkflow = await orchestrator.process({
      workflow: 'custom_workflow',
      inputData: {
        steps: [
          {
            name: 'Data Collection',
            agent: 'data_collector',
            action: 'collect_all_data',
            data: {}
          },
          {
            name: 'Risk Analysis',
            agent: 'risk_assessor',
            action: 'assess_risks',
            data: { shipments: mockShipments.slice(0, 2) }
          }
        ]
      }
    });
    
    console.log(`✅ Custom Workflow Completed`);
    console.log(`✅ Total Steps: ${customWorkflow.data.result.summary.totalSteps}`);
    console.log(`✅ Completed Steps: ${customWorkflow.data.result.summary.completedSteps}`);
    console.log(`✅ Status: ${customWorkflow.data.result.summary.status}\n`);

    // Test 7: Performance Metrics
    console.log('📊 Test 7: Performance Summary');
    const workflowHistory = orchestrator.getWorkflowHistory();
    console.log(`✅ Total Workflows Executed: ${workflowHistory.length}`);
    
    const avgExecutionTime = workflowHistory.reduce((sum, w) => sum + w.executionTime, 0) / workflowHistory.length;
    console.log(`✅ Average Execution Time: ${avgExecutionTime.toFixed(2)}ms`);
    
    const successRate = (workflowHistory.filter(w => w.status === 'completed').length / workflowHistory.length * 100).toFixed(1);
    console.log(`✅ Success Rate: ${successRate}%\n`);

    console.log('🎉 All tests completed successfully!');
    console.log('\n📋 System Capabilities Demonstrated:');
    console.log('✅ Multi-agent coordination');
    console.log('✅ Real-time data collection');
    console.log('✅ Risk assessment and scoring');
    console.log('✅ Scenario simulation');
    console.log('✅ Strategic recommendations');
    console.log('✅ Custom workflow execution');
    console.log('✅ Performance monitoring');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Clean up
    orchestrator.stopAllAgents();
    console.log('\n🛑 All agents stopped');
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testSystem().catch(console.error);
}

export { testSystem };
