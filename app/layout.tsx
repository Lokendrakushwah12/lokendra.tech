import { PostHogProvider } from "@/components/PostHogProvider";
import { ToastProvider } from "@/components/ui/toast";
import { siteConfig } from "@/config/site";
import { ibmPlexMono, inter, karstar } from "@/lib/fonts";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
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
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
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
            <ToastProvider position="top-right">
              {children}
            </ToastProvider>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
