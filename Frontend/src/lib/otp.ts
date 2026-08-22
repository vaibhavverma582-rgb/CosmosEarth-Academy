// OTP utility functions
// In production, use Redis or a database for OTP storage

const otpStore = new Map<
  string,
  { code: string; expires: number; purpose: string }
>();

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOTP(
  email: string,
  code: string,
  purpose: string = "login",
  expiresInMs: number = 10 * 60 * 1000 // 10 minutes
): void {
  const key = `${email}:${purpose}`;
  otpStore.set(key, {
    code,
    expires: Date.now() + expiresInMs,
    purpose,
  });
}

export function verifyOTP(
  email: string,
  code: string,
  purpose: string = "login"
): boolean {
  const key = `${email}:${purpose}`;
  const stored = otpStore.get(key);

  if (!stored) return false;
  if (stored.expires < Date.now()) {
    otpStore.delete(key);
    return false;
  }
  if (stored.code !== code) return false;

  // Delete after successful verification
  otpStore.delete(key);
  return true;
}

export function OTPExpired(email: string, purpose: string = "login"): boolean {
  const key = `${email}:${purpose}`;
  const stored = otpStore.get(key);
  if (!stored) return true;
  return stored.expires < Date.now();
}

// Clean up expired OTPs periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of otpStore.entries()) {
    if (value.expires < now) {
      otpStore.delete(key);
    }
  }
}, 60 * 1000); // every minute
