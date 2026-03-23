"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Vote, Settings } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Quick utility to merge tailwind classes safely
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function NavLinks() {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Campaigns", href: "/dashboard/campaigns", icon: Vote },
    { name: "Voting Circles", href: "/dashboard/circles", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <nav className="space-y-2">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));

        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md font-medium transition-colors",
              isActive
                ? "bg-black/5 text-black"
                : "text-black/60 hover:bg-black/5 hover:text-black"
            )}
          >
            <Icon size={18} />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
