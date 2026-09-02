"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Rocket,
  ArrowRight,
  Loader2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillEmail = searchParams.get("email") || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const passwordValid = password.length >= 8;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  // Send verification OTP
  const handleSendOTP = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }
    setOtpLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "register" }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        if (data.otp) setOtpCode(data.otp);
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch {
      setError("Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    setOtpLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode, purpose: "register" }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpVerified(true);
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch {
      setError("Failed to verify OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!passwordValid) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, emailVerified: otpVerified }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // Auto sign in after registration
        const signInResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (signInResult?.ok) {
          router.push("/profile");
          router.refresh();
        } else {
          router.push("/auth/login");
        }
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google registration
  const handleGoogleRegister = () => {
    signIn("google", { callbackUrl: "/profile" });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[400px] w-[400px] rounded-full bg-glow-purple opacity-20 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 shadow-cosmos-sm">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold">
              <span className="gradient-text-cyan">Cosmos</span>
              <span className="text-white">Earth</span>
            </span>
          </Link>
          <h1 className="mt-6 font-display text-2xl font-bold text-white">
            Join the Academy
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Create your account and start exploring the cosmos
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Google OAuth */}
            <button
              onClick={handleGoogleRegister}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-white/10 hover:border-white/20"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 border-t border-white/10" />
              <span className="text-xs text-white/30">or</span>
              <div className="flex-1 border-t border-white/10" />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Explorer Nova"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  />
                </div>
              </div>

              {/* Email + Verify */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">Email</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="explorer@cosmos.edu"
                      required
                      disabled={otpVerified}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 disabled:opacity-50"
                    />
                  </div>
                  {otpVerified ? (
                    <div className="flex items-center gap-1.5 rounded-xl border border-green-500/30 bg-green-500/10 px-3 text-sm text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Verified
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={otpLoading || !email}
                      className="shrink-0 rounded-xl border border-cyan-400/30 px-3 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-400/10 disabled:opacity-50"
                    >
                      {otpLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                    </button>
                  )}
                </div>

                {/* OTP input */}
                {otpSent && !otpVerified && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="6-digit code"
                      maxLength={6}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center font-mono text-sm tracking-widest text-white placeholder:text-white/20 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOTP}
                      disabled={otpLoading || otpCode.length !== 6}
                      className="rounded-xl bg-purple-400/20 px-4 text-sm font-medium text-purple-400 transition-colors hover:bg-purple-400/30 disabled:opacity-50"
                    >
                      {otpLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm"}
                    </button>
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Password strength */}
                {password.length > 0 && (
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          password.length >= i * 2
                            ? password.length >= 8
                              ? "bg-green-500"
                              : "bg-orange-400"
                            : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  />
                </div>
                {confirmPassword.length > 0 && (
                  <p className={`mt-1 text-xs ${passwordsMatch ? "text-green-400" : "text-red-400"}`}>
                    {passwordsMatch ? "✓ Passwords match" : "✗ Passwords don't match"}
                  </p>
                )}
              </div>

              {/* Terms */}
              <p className="text-xs text-white/30">
                By creating an account you agree to our{" "}
                <Link href="/terms" className="text-cyan-400 hover:underline">Terms</Link> and{" "}
                <Link href="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</Link>.
              </p>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-white/40">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-cyan-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
