import { PostHogProvider } from "@/components/PostHogProvider";
import { ToastProvider } from "@/components/ui/toast";
import { siteConfig } from "@/config/site";
import { ibmPlexMono, inter, karstar } from "@/lib/fonts";
import { SoundProvider } from "@/components/sound-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.name,
  description: siteConfig.description,
  // favicon.ico, icon.png and apple-icon.png come from the app/ file conventions (hashed URLs, so browsers refresh them)
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Lokendra Kushwah, Software Engineer at Keychain",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: siteConfig.author.twitter,
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        {/* Umami Analytics - Only load if configured */}
        {siteConfig.analytics?.umami?.websiteId && (
          <Script
            src={siteConfig.analytics.umami.url}
            data-website-id={siteConfig.analytics.umami.websiteId}
            strategy="lazyOnload"
          />
        )}

        {/* Microsoft Clarity - Only load if configured */}
        {siteConfig.analytics?.clarity?.projectId && (
          <Script id="clarity-script" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${siteConfig.analytics.clarity.projectId}");
            `}
          </Script>
        )}
        {/* Visitors.now - Only load if configured */}
        {siteConfig.analytics?.visitors?.token && (
          <Script
            src="https://cdn.visitors.now/v.js"
            data-token={siteConfig.analytics.visitors.token}
          />
        )}
      </head>
      <body
        className={`${ibmPlexMono.variable} ${karstar.variable} ${inter.variable} font-sans antialiased bg-site-background noise-overlay min-h-svh`}
      >
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SoundProvider>
            <ToastProvider position="top-right">
              {children}
            </ToastProvider>
            </SoundProvider>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
