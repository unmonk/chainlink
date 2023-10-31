import "./globals.css";
import { Navbar } from "@/components/nav/navbar";
import { ModalProvider } from "@/components/providers/modal-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import { Toaster } from "sonner";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  themeColor: "#1f821f",
  width: "device-width",
  height: "device-height",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterSite,
    title: siteConfig.twitterTitle,
    description: siteConfig.twitterDescription,
    creator: siteConfig.twitterCreator,
    creatorId: siteConfig.twitterCreatorId,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  applicationName: siteConfig.name,
  keywords: siteConfig.keywords,
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "bg-background relative z-10 min-h-screen w-full font-sans antialiased",
            fontSans.variable,
          )}
        >
        
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
         <div className="absolute -z-20 h-full w-full bg-[radial-gradient(#bbf7d0_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#052e16_1px,transparent_1px)]"></div>
            <Navbar />
     
            {children}
         
            <Toaster />
            <ModalProvider />
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}

