import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { generateOTP, storeOTP } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const { email, purpose = "login" } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPassword) {
      console.error("Gmail credentials are missing");
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    const code = generateOTP();

    storeOTP(email, code, purpose);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPassword,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `"CosmosEarth Academy" <${gmailUser}>`,
      to: email,
      subject: "CosmosEarth Academy - Verification Code",
      text: `Your verification code is ${code}. It expires in 5 minutes.`,
      html: `
        <h2>CosmosEarth Academy</h2>
        <p>Your verification code is:</p>
        <h1>${code}</h1>
        <p>This code expires in 5 minutes.</p>
      `,
    });

    console.log(`OTP sent successfully to ${email}`);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);

    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}