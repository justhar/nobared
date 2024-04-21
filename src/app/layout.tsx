import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/toaster";
import { validateRequest } from "@/lib/auth";
import { SessionProvider } from "@/lib/providers/Sessions.provider";

export const metadata: Metadata = {
  title: "nobared",
  description: "New way to watch and connect",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionData = await validateRequest();
  return (
    <html lang="en">
      <meta name="referrer" content="no-referrer" />
      <body className={GeistSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider value={sessionData}>
            <Navbar />
            {children}
          </SessionProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
