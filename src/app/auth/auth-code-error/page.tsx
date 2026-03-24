import Link from "next/link";

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ebe6dd] p-4 relative overflow-hidden">

      {/* Subtle Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="w-full max-w-md bg-white border border-black/10 rounded-xl shadow-xl p-8 relative z-10 text-center">

        <div className="mb-8">
          <div className="font-heading text-2xl font-bold tracking-tighter text-black inline-block mb-2">
            Rialo Pulse
          </div>
          <h1 className="text-xl font-medium text-black/80">Authentication Error</h1>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-black/60">
            There was an issue with your Discord authentication. Please try again.
          </p>

          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full h-12 bg-black text-[#ebe6dd] rounded-md font-medium transition-colors hover:bg-zinc-800 active:scale-[0.98]"
          >
            Try Again
          </Link>
        </div>

      </div>
    </div>
  );
}