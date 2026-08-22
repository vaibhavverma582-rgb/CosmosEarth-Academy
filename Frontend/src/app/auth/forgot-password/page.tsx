"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Rocket,
  ArrowRight,
  ArrowLeft,
  Loader2,
  KeyRound,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Step = "email" | "otp" | "reset" | "success";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "reset-password" }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("otp");
      } else {
        setError(data.error || "Failed to send code");
      }
    } catch {
      setError("Failed to send code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpCode.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode, purpose: "reset-password" }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("reset");
      } else {
        setError(data.error || "Invalid code");
      }
    } catch {
      setError("Failed to verify code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: newPassword }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setStep("success");
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch {
      setError("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[400px] w-[400px] rounded-full bg-glow-purple opacity-20 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cosmos-cyan to-cosmos-purple shadow-cosmos-sm">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold">
              <span className="gradient-text-cyan">Cosmos</span>
              <span className="text-white">Earth</span>
            </span>
          </Link>
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Step: Email */}
            {step === "email" && (
              <>
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cosmos-purple/10">
                    <KeyRound className="h-8 w-8 text-cosmos-purple" />
                  </div>
                  <h1 className="font-display text-2xl font-bold text-white">
                    Reset Password
                  </h1>
                  <p className="mt-2 text-sm text-white/50">
                    Enter your email and we&apos;ll send you a verification code
                  </p>
                </div>

                {error && (
                  <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/70">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="explorer@cosmos.edu"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cosmos-cyan/50 focus:outline-none focus:ring-1 focus:ring-cosmos-cyan/30"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSendOTP}
                    className="w-full"
                    size="lg"
                    disabled={loading || !email}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Send Verification Code
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}

            {/* Step: OTP */}
            {step === "otp" && (
              <>
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cosmos-cyan/10">
                    <Shield className="h-8 w-8 text-cosmos-cyan" />
                  </div>
                  <h1 className="font-display text-2xl font-bold text-white">
                    Check Your Email
                  </h1>
                  <p className="mt-2 text-sm text-white/50">
                    We sent a 6-digit code to <span className="text-white/70">{email}</span>
                  </p>
                </div>

                {error && (
                  <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/70">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) =>
                        setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="000000"
                      maxLength={6}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] text-white placeholder:text-white/20 focus:border-cosmos-cyan/50 focus:outline-none focus:ring-1 focus:ring-cosmos-cyan/30"
                    />
                  </div>

                  <Button
                    onClick={handleVerifyOTP}
                    className="w-full"
                    size="lg"
                    disabled={loading || otpCode.length !== 6}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Verify Code"
                    )}
                  </Button>

                  <button
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="w-full text-center text-sm text-cosmos-cyan hover:underline"
                  >
                    Didn&apos;t receive a code? Resend
                  </button>
                </div>
              </>
            )}

            {/* Step: Reset Password */}
            {step === "reset" && (
              <>
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
                    <CheckCircle2 className="h-8 w-8 text-green-400" />
                  </div>
                  <h1 className="font-display text-2xl font-bold text-white">
                    New Password
                  </h1>
                  <p className="mt-2 text-sm text-white/50">
                    Create a strong password for your account
                  </p>
                </div>

                {error && (
                  <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/70">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-white/30 focus:border-cosmos-cyan/50 focus:outline-none focus:ring-1 focus:ring-cosmos-cyan/30"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {newPassword.length > 0 && (
                      <div className="mt-2 flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              newPassword.length >= i * 2
                                ? newPassword.length >= 8
                                  ? "bg-green-500"
                                  : "bg-cosmos-orange"
                                : "bg-white/10"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/70">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat your password"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cosmos-cyan/50 focus:outline-none focus:ring-1 focus:ring-cosmos-cyan/30"
                      />
                    </div>
                    {confirmPassword.length > 0 && (
                      <p
                        className={`mt-1 text-xs ${
                          newPassword === confirmPassword
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {newPassword === confirmPassword
                          ? "✓ Passwords match"
                          : "✗ Passwords don't match"}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={handleResetPassword}
                    className="w-full"
                    size="lg"
                    disabled={
                      loading ||
                      newPassword.length < 8 ||
                      newPassword !== confirmPassword
                    }
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </div>
              </>
            )}

            {/* Step: Success */}
            {step === "success" && (
              <>
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
                    <CheckCircle2 className="h-8 w-8 text-green-400" />
                  </div>
                  <h1 className="font-display text-2xl font-bold text-white">
                    Password Reset!
                  </h1>
                  <p className="mt-2 text-sm text-white/50">
                    Your password has been successfully updated
                  </p>
                </div>

                <Link href="/auth/login">
                  <Button className="w-full" size="lg">
                    Sign In with New Password
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        {step === "email" && (
          <p className="mt-6 text-center text-sm text-white/40">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-cosmos-cyan hover:underline"
            >
              Sign in
            </Link>
          </p>
        )}

        {step !== "email" && step !== "success" && (
          <button
            onClick={() => {
              setStep("email");
              setError("");
              setOtpCode("");
            }}
            className="mt-6 flex w-full items-center justify-center gap-1.5 text-sm text-white/40 hover:text-white/60"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to email
          </button>
        )}
      </div>
    </div>
  );
}
