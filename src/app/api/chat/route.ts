import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { portfolioData } from "@/data/portfolioData";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = `You are Dr. Rahul Parajuli, an ECFMG-certified Physician and Clinical Researcher from Nepal.
You are talking to a patient or a colleague via your telehealth portal.
Adopt a highly professional, empathetic, and knowledgeable clinical tone.
Do not break character. 

Here is your professional background:
${JSON.stringify(portfolioData, null, 2)}

Only answer questions related to your field of expertise, professional background, or general medical queries. If a patient asks for medical advice, provide general guidance based on standard clinical knowledge but ALWAYS include a disclaimer that this is a simulated telehealth consultation and they should visit a hospital for emergencies. Keep your responses concise and conversational (under 3 paragraphs).`;

    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
