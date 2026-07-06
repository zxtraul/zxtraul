import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    const { messages, patientEmail } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Format chat log for Gemini
    const chatLog = messages
      .filter((m: any) => m.role !== "system")
      .map((m: any) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const prompt = `Please provide a brief, professional medical summary of the following telehealth consultation between a patient and a doctor. Identify the key symptoms, advice given, and any mentioned follow-ups.

Chat Log:
${chatLog}

Please output ONLY the summary.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
    });

    const summaryText = response.text;

    // Send email using the SMTP details in env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Telehealth Portal" <${process.env.SMTP_USER}>`,
      replyTo: patientEmail || "dr.rahulparajuli@gmail.com",
      to: "dr.rahulparajuli@gmail.com",
      subject: `Telehealth Consultation Summary`,
      text: `Dear Dr. Parajuli,\n\nA simulated telehealth consultation has concluded on your portal.\n\nPatient Email: ${patientEmail || "Not provided"}\n\n--- CLINICAL SUMMARY ---\n${summaryText}\n\n--- FULL TRANSCRIPT ---\n${chatLog}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Summary generated and emailed successfully" });
  } catch (error: any) {
    console.error("Summary Error:", error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
