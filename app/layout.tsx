import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";
import ConvexClientProvider from "@/components/nav/convex-client-provider";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@sentry/nextjs";
import { CookiesProvider } from "next-client-cookies/server";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const APP_NAME = "ChainLink";
const APP_DESCRIPTION = "Build the biggest chain.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: "%s - ChainLink",
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    shortcut: "/favicon.ico",
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#161616",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CookiesProvider>
      <html lang="en">
        <body className={cn("antialiased font-sans", inter.variable)}>
          <NuqsAdapter>
            <ConvexClientProvider>
              <ConvexQueryCacheProvider expiration={60000}>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="dark"
                  enableSystem
                  disableTransitionOnChange
                >
                  <main>{children}</main>
                  <Toaster />
                </ThemeProvider>
              </ConvexQueryCacheProvider>
            </ConvexClientProvider>
          </NuqsAdapter>
        </body>
      </html>
    </CookiesProvider>
  );
}
