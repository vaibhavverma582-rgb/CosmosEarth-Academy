import { NextRequest, NextResponse } from "next/server";
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Generate and store OTP
    const code = generateOTP();
    storeOTP(email, code, purpose);

    // In production, send email here using a service like:
    // - Resend: await resend.emails.send({ ... })
    // - SendGrid: await sgMail.send({ ... })
    // - Nodemailer: await transporter.sendMail({ ... })

    // For development, log the OTP to console
    console.log(`\n📧 OTP for ${email}: ${code} (purpose: ${purpose})\n`);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      // Include OTP in response for development only
      // Remove this in production!
      ...(process.env.NODE_ENV === "development" && { otp: code }),
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
