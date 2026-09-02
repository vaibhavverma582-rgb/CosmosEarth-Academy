"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Rocket,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [mode, setMode] = useState<"password" | "otp">("password");

  // Handle email/password login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/profile");
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/profile" });
  };

  // Handle OTP send
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "login" }),
      });

      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        // In dev, auto-fill the OTP for convenience
        if (data.otp) {
          setOtpCode(data.otp);
        }
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle OTP verify
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode, purpose: "login" }),
      });

      const data = await res.json();

      if (data.success) {
        // For OTP login, we need to create a session
        // Use signIn with a special callback
        const signInResult = await signIn("credentials", {
          email,
          password: "__otp_verified__",
          redirect: false,
        });

        if (signInResult?.error) {
          // If credentials login fails, redirect to register
          router.push(`/auth/register?email=${encodeURIComponent(email)}`);
        } else {
          router.push("/profile");
          router.refresh();
        }
      } else {
        setError(data.error || "Invalid OTP code");
      }
    } catch {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[400px] w-[400px] rounded-full bg-glow-cyan opacity-20 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 shadow-cosmos-sm">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold">
              <span className="gradient-text-cyan">Cosmos</span>
              <span className="text-white">Earth</span>
            </span>
          </Link>
          <h1 className="mt-6 font-display text-2xl font-bold text-white">
            Welcome Back, Explorer
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Sign in to continue your cosmic journey
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-white/10 hover:border-white/20"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 border-t border-white/10" />
              <span className="text-xs text-white/30">or</span>
              <div className="flex-1 border-t border-white/10" />
            </div>

            {/* Mode tabs */}
            <div className="mb-4 flex gap-1 rounded-lg bg-white/5 p-1">
              <button
                onClick={() => { setMode("password"); setError(""); setOtpSent(false); }}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                  mode === "password"
                    ? "bg-cyan-400/20 text-cyan-400"
                    : "text-white/50 hover:text-white/70"
                }`}
              >
                <Lock className="inline h-3.5 w-3.5 mr-1.5" />
                Password
              </button>
              <button
                onClick={() => { setMode("otp"); setError(""); setOtpSent(false); }}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                  mode === "otp"
                    ? "bg-purple-400/20 text-purple-400"
                    : "text-white/50 hover:text-white/70"
                }`}
              >
                <Mail className="inline h-3.5 w-3.5 mr-1.5" />
                Email OTP
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Password Login Form */}
            {mode === "password" && (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="explorer@cosmos.edu"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
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
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-white/50">
                    <input type="checkbox" className="rounded border-white/20 bg-white/5" />
                    Remember me
                  </label>
                  <Link href="/auth/forgot-password" className="text-sm text-cyan-400 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* OTP Login Form */}
            {mode === "otp" && !otpSent && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="explorer@cosmos.edu"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={otpLoading}>
                  {otpLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Send OTP Code
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* OTP Verify Form */}
            {mode === "otp" && otpSent && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 p-3 text-center">
                  <p className="text-sm text-cyan-400">
                    ✉️ OTP sent to <strong>{email}</strong>
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    6-Digit Code
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] text-white placeholder:text-white/20 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={otpLoading || otpCode.length !== 6}>
                  {otpLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Verify & Sign In
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setOtpCode(""); setError(""); }}
                  className="w-full text-center text-sm text-white/40 hover:text-white/60"
                >
                  ← Use a different email
                </button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-white/40">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-medium text-cyan-400 hover:underline">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
