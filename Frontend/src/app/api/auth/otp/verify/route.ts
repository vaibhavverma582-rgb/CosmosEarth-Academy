import { NextRequest, NextResponse } from "next/server";
import { verifyOTP } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const { email, code, purpose = "login" } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    // Verify the OTP
    const isValid = verifyOTP(email, code, purpose);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP code" },
        { status: 400 }
      );
    }

    // For login: find or create user and return session
    if (purpose === "login") {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/otp-login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        );

        if (!res.ok) {
          return NextResponse.json(
            { error: "User not found. Please register first." },
            { status: 404 }
          );
        }

        const data = await res.json();
        return NextResponse.json({
          success: true,
          user: data.user,
          message: "Login successful",
        });
      } catch {
        return NextResponse.json(
          { error: "Failed to complete login" },
          { status: 500 }
        );
      }
    }

    // For register: mark email as verified
    if (purpose === "register") {
      return NextResponse.json({
        success: true,
        message: "Email verified successfully",
      });
    }

    return NextResponse.json({
      success: true,
      message: "OTP verified",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
