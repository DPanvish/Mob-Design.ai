import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeftIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Header = ({projectName}: {projectName?: string}) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const {theme, setTheme} = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
      setMounted(true);
  }, []);

  return (
    <div className="sticky top-0">
      <header className="border-b border-border/40 bg-card backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <Logo />
            <Button
              size="icon-sm"
              variant="ghost"
              className="rounded-full bg-muted!"
              onClick={() => router.push("/")}
              aria-label="Go to home"
            >
              <ArrowLeftIcon className="size-4" />
            </Button>

            <p className="max-w-[200px] truncate font-medium">{projectName || "Untitled Project"}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="relative rounded-full h-8 w-8"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            >
              {mounted && (
                <>
                  <SunIcon className={cn("absolute h-5 w-5 transition", isDark ? "scale-100" : "scale-0")} />
                  <MoonIcon className={cn("absolute h-5 w-5 transition", isDark ? "scale-0" : "scale-100")} />
                </>
              )}
            </Button>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header
