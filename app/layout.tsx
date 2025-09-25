import { PostHogProvider } from "@/components/PostHogProvider";
import { siteConfig } from "@/config/site";
import { ibmPlexMono, karstar } from "@/lib/fonts";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import Script from 'next/script';
import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: {
    icon: "/pfp.png",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: "/openGraph.png?v=2",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/openGraph.png?v=2"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicons and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/icon1.png" />
        <link rel="icon" type="image/svg+xml" href="/icon0.svg" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="192x192" href="/web-app-manifest-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/web-app-manifest-512x512.png" />
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
      </head>
      <body className={`${ibmPlexMono.variable} ${karstar.variable} font-sans antialiased bg-site-background noise-overlay min-h-svh`}>
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
