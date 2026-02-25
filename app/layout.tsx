import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/themeProvider";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from '@clerk/nextjs'
import { QueryProvider } from "./context/query-provider";


const jostSans = Jost({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "ModDesign - AI Mobile Design Agent",
  description: "AI Mobile Design Agent"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${jostSans.className} antialiased`}
        >
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}

              <Toaster richColors position="bottom-center" />
            </ThemeProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
