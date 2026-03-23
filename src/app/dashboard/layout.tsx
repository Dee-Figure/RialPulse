import Link from "next/link";
import { LogOut } from "lucide-react";
import { signOut } from "./actions";
import NavLinks from "./nav-links"; // <-- Import the new component

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-rialo-cream flex flex-col md:flex-row font-sans">

      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-black/10 bg-rialo-cream p-6 flex flex-col justify-between shrink-0">
        <div>
          <Link href="/" className="font-heading text-2xl font-bold tracking-tighter text-black mb-8 block hover:opacity-70 transition-opacity">
            Rialo Pulse
          </Link>

          <NavLinks />
        </div>

        {/* User Actions */}
        <div className="pt-8 border-t border-black/10 mt-8">
          <form action={signOut}>
            <button type="submit" className="flex items-center space-x-3 px-3 py-2 w-full rounded-md text-black/60 hover:bg-black/5 hover:text-black font-medium transition-colors">
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}