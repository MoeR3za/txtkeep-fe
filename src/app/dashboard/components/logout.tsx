"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/services/auth";
import { Button } from "@/components/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <Button
      variant="ghost"
      className="text-neutral-600 hover:text-purple-600 hover:bg-purple-50"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
}
