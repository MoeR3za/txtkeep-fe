"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FileText, Upload, Search } from "lucide-react";
import LogoutButton from "./logout";
import { cn } from "@/lib/utils";

export default function Header() {
  // Function to check if the link is active
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b border-neutral-200 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-xl font-bold bg-gradient-to-br from-purple-600 to-blue-600 bg-clip-text text-transparent"
            >
              <FileText className="h-6 w-6 text-purple-600" />
              TXTKeep
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              <Link
                href="/dashboard"
                aria-current="page"
                className={cn(
                  `inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/dashboard")
                      ? "text-purple-600 bg-purple-50"
                      : "text-neutral-600 hover:text-purple-600 hover:bg-purple-50"
                  }`
                )}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Link>
              <Link
                href="/dashboard/my-files"
                className={cn(
                    `inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/dashboard/my-files")
                        ? "text-purple-600 bg-purple-50"
                        : "text-neutral-600 hover:text-purple-600 hover:bg-purple-50"
                    }`
                  )}  
              >
                <Search className="h-4 w-4 mr-2" />
                My Files
              </Link>
            </div>
          </div>

          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
