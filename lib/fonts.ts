import { IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const karstar = localFont({
  src: "../public/font/Karstar_Free.ttf",
  variable: "--font-cursive",
  display: "swap",
});

export { ibmPlexMono, karstar };

