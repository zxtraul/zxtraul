import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { fullName, organization, email, purpose } = data;

    // Validate required fields
    if (!fullName || !organization || !email || !purpose) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Configure Nodemailer transport using the hosting provider's SMTP credentials
    // These need to be securely stored in .env.local
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content formulation
    const mailOptions = {
      from: `"${fullName} via Portfolio" <${process.env.SMTP_USER}>`, // Send FROM the authenticated hosting email to prevent spam filtering
      replyTo: email, // If the doctor clicks "reply", it goes to the user
      to: "dr.rahulparajuli@gmail.com",
      subject: `New CV Request from ${fullName} - ${organization}`,
      text: `Dear Dr. Parajuli,\n\nA new CV request has been submitted through your portfolio website.\n\nDetails:\nName: ${fullName}\nOrganization/Title: ${organization}\nEmail: ${email}\nPurpose of Request: ${purpose}\n\nYou can reply directly to this email to contact the requester.\n\nBest,\nYour Portfolio System`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0d9488; padding: 20px; color: white;">
            <h2 style="margin: 0;">New CV Request</h2>
          </div>
          <div style="padding: 24px;">
            <p>Dear Dr. Parajuli,</p>
            <p>A new CV request has been submitted through your portfolio website.</p>
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0 0 8px;"><strong>Name:</strong> ${fullName}</p>
              <p style="margin: 0 0 8px;"><strong>Organization/Title:</strong> ${organization}</p>
              <p style="margin: 0 0 8px;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p style="margin: 0;"><strong>Purpose:</strong> ${purpose}</p>
            </div>
            <p>You can simply hit "Reply" to this email to respond directly to the requester with your CV attached.</p>
          </div>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Failed to send CV request email:", error);
    return NextResponse.json(
      { error: "Internal Server Error. Could not send email. Details: " + (error.message || String(error)) },
      { status: 500 }
    );
  }
}
