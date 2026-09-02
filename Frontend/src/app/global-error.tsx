"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="space-bg flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-md text-center px-4">
          <div className="mb-6 flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-red-500/10 ring-2 ring-red-500/20">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-white/40 mb-6">
            An unexpected error occurred. This has been logged.
          </p>
          <button
            onClick={reset}
            className="rounded-lg bg-cyan-500/15 border border-cyan-500/25 px-6 py-2.5 text-sm font-medium text-cyan-400 transition-all hover:bg-cyan-500/25"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
