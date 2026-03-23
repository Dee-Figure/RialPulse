import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createCircle } from "../actions";

export default function NewCirclePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Back button & Header */}
      <div>
        <Link href="/dashboard/circles" className="inline-flex items-center text-sm font-medium text-black/50 hover:text-black transition-colors mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back to Circles
        </Link>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-black tracking-tight">Create Voting Circle</h1>
        <p className="text-black/60 mt-1">Define a new group to streamline campaign permissions.</p>
      </div>

      {/* The Form */}
      <div className="bg-white border border-black/10 rounded-xl shadow-sm overflow-hidden">
        <form action={createCircle} className="p-6 md:p-8 space-y-6">

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-bold text-black block">
              Circle Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="e.g., Core Developers, Board of Directors"
              className="w-full px-4 py-3 rounded-md border border-black/10 bg-black/5 text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-bold text-black block">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="What is the purpose of this group?"
              className="w-full px-4 py-3 rounded-md border border-black/10 bg-black/5 text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all resize-none"
            ></textarea>
          </div>

          <div className="pt-6 border-t border-black/5">
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-black text-[#ebe6dd] font-medium rounded-md hover:bg-zinc-800 transition-all active:scale-[0.98]"
            >
              Create Circle
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}