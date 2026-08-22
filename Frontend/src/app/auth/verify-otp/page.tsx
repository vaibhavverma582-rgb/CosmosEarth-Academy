"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Rocket, ArrowRight, Loader2, RotateCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const purpose = searchParams.get("purpose") || "register";

  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    if (!email) {
      router.push("/auth/register");
    }
  }, [email, router]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode, purpose }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          if (purpose === "register") {
            router.push("/auth/register?verified=true");
          } else {
            router.push("/auth/login");
          }
        }, 2000);
      } else {
        setError(data.error || "Invalid code");
      }
    } catch {
      setError("Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendTimer(60);
    setError("");

    try {
      await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose }),
      });
    } catch {
      setError("Failed to resend OTP");
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-8 w-8 text-green-400" />
          </div>
          <h2 className="font-display text-xl font-bold text-white">Email Verified!</h2>
          <p className="mt-2 text-sm text-white/50">Redirecting you shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[400px] w-[400px] rounded-full bg-glow-cyan opacity-20 blur-3xl" />

      <div className="relative w-full max-w-md">
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
          <h1 className="mt-6 font-display text-2xl font-bold text-white">
            Check Your Email
          </h1>
          <p className="mt-2 text-sm text-white/50">
            We sent a 6-digit code to <strong className="text-white/70">{email}</strong>
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center font-mono text-3xl tracking-[0.5em] text-white placeholder:text-white/20 focus:border-cosmos-cyan/50 focus:outline-none focus:ring-1 focus:ring-cosmos-cyan/30"
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading || otpCode.length !== 6}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Verify Code
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              {resendTimer > 0 ? (
                <p className="text-sm text-white/40">
                  Resend code in {resendTimer}s
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="inline-flex items-center gap-1.5 text-sm text-cosmos-cyan hover:underline"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Resend OTP
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-white/40">
          <Link href="/auth/login" className="text-cosmos-cyan hover:underline">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
