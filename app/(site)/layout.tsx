import AsciiDither from "@/components/Dither/AsciiDither";
import Enter from "@/components/ui/enter";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto relative pt-8">
      <AsciiDither />
      <ProgressiveBlur
        className="pointer-events-none z-500 fixed bottom-0 w-full h-20"
        direction="bottom"
        blurIntensity={1}
      />
      <Enter stagger={0}>
        <Header />
      </Enter>
      {children}
      <Footer />
    </div>
  );
}
