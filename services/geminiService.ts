import { GoogleGenAI, Type } from "@google/genai";
import { FinancialYear, CalculatedMetrics, AnomalyReport } from '../types';

export const analyzeFinancialsWithGemini = async (
  financials: FinancialYear[],
  metrics: CalculatedMetrics[]
): Promise<AnomalyReport> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set REACT_APP_GEMINI_API_KEY or similar.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Prepare data context
  const dataContext = JSON.stringify({
    financials,
    derivedMetrics: metrics
  }, null, 2);

  const prompt = `
    You are an expert Senior Financial Auditor and Analyst Agent. 
    Analyze the provided 5-year financial JSON data for a company.

    Your tasks:
    1. Identify structural shifts in profitability (EBITDA, PAT margins).
    2. Analyze working capital efficiency (DSO, Inventory, Payables).
    3. Flag specific anomalies (e.g., Revenue rising but OCF falling).
    4. Provide a risk assessment (Low, Medium, High, Critical).
    
    Data:
    ${dataContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a concise, professional financial analyst. Use markdown for formatting.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.STRING,
              description: "A detailed markdown formatted string containing the executive summary, anomaly detection, and interpretations.",
            },
            riskLevel: {
              type: Type.STRING,
              enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
              description: "The overall risk assessment of the company financial health.",
            },
            keyFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of short bullet points summarizing the main red flags.",
            }
          },
          required: ["analysis", "riskLevel", "keyFlags"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text) as AnomalyReport;

  } catch (error) {
    console.error("Gemini Analysis Failed", error);
    throw error;
  }
};
