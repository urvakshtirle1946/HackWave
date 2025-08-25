import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import config from "../config";

class LLM {
  private llm: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    this.llm = new GoogleGenerativeAI(config.geminiApiKey);
    this.model = this.llm.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  public async analyzeRiskWithGemini(location: string, articles: { title: string }[]) {
    const prompt = `
Location: ${location}
Headlines:
${articles.map(a => `- ${a.title}`).join("\n")}

Task: For each headline, assign a risk level (Low, Medium, High) indicating potential transportation or supply chain disruption. 
Then summarize the overall risk level for the location.
    `;

    const result = await this.model.generateContent(prompt);

    // result.response is a GenerativeContentResponse
    const response = await result.response;
    const text = response.text();

    return { rawAnalysis: text };
  }
}
