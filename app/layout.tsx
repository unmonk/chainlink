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
const APP_DESCRIPTION = "Playing ChainLink is good for your kidneys.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: "%s - ChainLink",
  },
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    type: "website",
    siteName: APP_NAME,
    locale: "en_US",
    url: "https://chainlink.com",
    images: ["/images/og-image.png"],
  },
  twitter: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    creator: "@chainlink_st",
    site: "https://chainlink.com",
    images: ["/images/og-image.png"],
  },
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
  keywords:
    "chainlink, sports betting, sports, sports picks, sports predictions, online game",
  other: {
    "ads.txt": "google.com, pub-1737227166446709, DIRECT, f08c47fec0942fa0",
    "google-adsense-account": "ca-pub-1737227166446709",
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
            <ErrorBoundary>
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
            </ErrorBoundary>
          </NuqsAdapter>
        </body>
      </html>
    </CookiesProvider>
  );
}
