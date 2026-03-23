import Link from "next/link";
import { login, signup } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-rialo-cream p-4 relative overflow-hidden">

      {/* Subtle Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      <div className="w-full max-w-md bg-white border border-black/10 rounded-xl shadow-xl p-8 relative z-10">

        <div className="mb-8 text-center">
          <Link href="/" className="font-heading text-2xl font-bold tracking-tighter text-black inline-block mb-2 hover:opacity-70 transition-opacity">
            Rialo Pulse
          </Link>
          <h1 className="text-xl font-medium text-black/80">Organization Portal</h1>
          <p className="text-sm text-black/50 mt-1">Sign in to manage your ecosystem</p>
        </div>

        <form className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-black/70" htmlFor="email">
              Work Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="admin@organization.com"
              required
              className="w-full px-4 py-3 rounded-md border border-black/10 bg-black/5 text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-black/70" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-md border border-black/10 bg-black/5 text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30 transition-all"
            />
          </div>

          {/* Error / Success Messages */}
          {params?.message && (
            <div className="p-3 bg-black/5 text-black/80 text-sm font-medium rounded-md text-center border border-black/10">
              {params.message}
            </div>
          )}

          <div className="pt-4 space-y-3">
            <button
              formAction={login}
              className="w-full h-12 flex items-center justify-center rounded-md bg-black text-rialo-cream font-medium transition-all hover:bg-zinc-800 active:scale-[0.98]"
            >
              Sign In
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-black/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-black/40 font-medium">Or</span>
              </div>
            </div>

            <button
              formAction={signup}
              className="w-full h-12 flex items-center justify-center rounded-md border border-black/20 bg-transparent text-black font-medium transition-colors hover:bg-black/5 hover:border-black/40 active:scale-[0.98]"
            >
              Create Organization
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}