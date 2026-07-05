import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Save to CSV
    // Using process.cwd() ensures it saves to the project root where server.js runs
    const csvPath = path.join(process.cwd(), "messages.csv");
    const dateStr = new Date().toISOString();
    
    // Escape CSV values (replace quotes with double quotes)
    const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`;
    const csvRow = `${escapeCsv(dateStr)},${escapeCsv(name)},${escapeCsv(email)},${escapeCsv(message)}\n`;

    try {
      // Check if file exists to add header if needed
      await fs.access(csvPath);
      await fs.appendFile(csvPath, csvRow);
    } catch {
      // File doesn't exist, create it with headers
      const headers = "Date,Name,Email,Message\n";
      await fs.writeFile(csvPath, headers + csvRow);
    }

    // 2. Send Email
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
      from: `"${name} via Portfolio" <${process.env.SMTP_USER}>`,
      replyTo: email, // Clicking reply will send email directly to the user
      to: "dr.rahulparajuli@gmail.com",
      subject: `New Contact Message from ${name}`,
      text: `Dear Dr. Parajuli,\n\nYou have received a new message from your portfolio website.\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}\n\nYou can reply directly to this email to respond to ${name}.`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0d9488; padding: 20px; color: white;">
            <h2 style="margin: 0;">New Contact Message</h2>
          </div>
          <div style="padding: 24px;">
            <p>Dear Dr. Parajuli,</p>
            <p>You have received a new message from your portfolio website.</p>
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0 0 8px;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 0 0 8px;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <h4 style="margin: 16px 0 8px; color: #0f172a;">Message:</h4>
              <p style="margin: 0; white-space: pre-wrap; background-color: white; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0; color: #334155;">${message}</p>
            </div>
            <p>You can simply hit "Reply" to this email to respond directly to the sender.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Message sent and saved successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Failed to process contact message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
