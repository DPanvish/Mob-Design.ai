"use client"

import Logo from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SignInButton, SignOutButton, SignUpButton, useUser } from "@clerk/nextjs";
import { LogOutIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes"
import Link from "next/link";

const Header = () => {
  const {theme, setTheme} = useTheme();
  const {user} = useUser();
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`
  const isDark = theme === "dark";

  return (
    <div className="sticky top-0 right-0 left-0 z-30">
      <header className="h-16 border-b bg-background py-4">
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
          <Logo />

          <div className="flex-1 hidden justify-center items-center gap-8 md:flex">
            <Link href="/" className="text-muted-foreground text-sm">Home</Link>
          </div>

          <div className="flex flex-1 items-center justify-end gap-3">
            <Button
              variant="outline"
              size="icon"
              className="relative rounded-full h-8 w-8"
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              <SunIcon className={cn("absolute h-5 w-5 transition", isDark ? "scale-100" : "scale-0")} />
              <MoonIcon className={cn("absolute h-5 w-5 transition", isDark ? "scale-0" : "scale-100")} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="h-8 w-8 shrink-0 rounded-full">
                  <AvatarImage
                    src={user?.imageUrl || ""}
                    alt={initials}
                  />
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                 <SignOutButton>
                   <button className="flex w-full items-center gap-2">
                     <LogOutIcon className="size-4" />
                     Logout
                   </button>
                 </SignOutButton>
               </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header
