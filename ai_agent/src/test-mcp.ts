import { DataCollectorAgent } from "./agents/DataCollectorAgent";
import { MCPContextManager } from "./utils/mcpContextManager";

async function testMCPImplementation() {
  console.log("🚀 Testing MCP Implementation in AI Agent System");

  // Create and start the data collector agent
  const dataCollector = new DataCollectorAgent();
  await dataCollector.start();

  console.log("\n📋 Agent Capabilities:");
  console.log(JSON.stringify(dataCollector.getCapabilities(), null, 2));

  // Test MCP Context creation
  console.log("\n🔄 Creating MCP Context...");
  const context = MCPContextManager.createContext(
    "supply_chain_data_request",
    { requestType: "full_analysis", priority: "high" },
    "test_system",
    "system",
    "data_collection_request",
    dataCollector.getAgentInfo().id,
    dataCollector.getAgentInfo().type
  );

  console.log("Context created:", {
    id: context.id,
    type: context.type,
    timestamp: context.timestamp,
  });

  // Test MCP Processing
  console.log("\n⚡ Processing with MCP...");
  try {
    const result = await dataCollector.processMCP(context);
    console.log("MCP Processing Result:", {
      success: result.success,
      contextId: result.context.id,
      executionTime: result.executionTime,
      provenanceCount: result.context.provenance.length,
    });

    if (result.success) {
      console.log("✅ Data collection completed successfully");
      console.log(
        "📊 Collected data types:",
        Object.keys(result.context.payload)
      );
    } else {
      console.log("❌ Data collection failed:", result.error?.message);
    }
  } catch (error) {
    console.error("💥 MCP Processing failed:", error);
  }

  // Test legacy processing for comparison
  console.log("\n🔄 Testing legacy processing...");
  try {
    const legacyResult = await dataCollector.process({});
    console.log("✅ Legacy processing completed");
    console.log("📊 Legacy data types:", Object.keys(legacyResult.data));
  } catch (error) {
    console.error("💥 Legacy processing failed:", error);
  }

  // Test data quality metrics
  console.log("\n📈 Data Quality Metrics:");
  try {
    const metrics = await dataCollector.getDataQualityMetrics();
    console.log(JSON.stringify(metrics, null, 2));
  } catch (error) {
    console.error("Failed to get data quality metrics:", error);
  }

  dataCollector.stop();
  console.log("\n🏁 MCP Implementation test completed");
}

// Run the test
testMCPImplementation().catch(console.error);

export { testMCPImplementation };
