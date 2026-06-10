import ClientDither from "@/components/Dither/ClientDither";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full select-none lg:max-w-4xl overflow-clip mx-auto relative">
      <ClientDither />
      <ProgressiveBlur
        className="pointer-events-none z-500 fixed bottom-0 w-full h-20"
        direction="bottom"
        blurIntensity={1}
      />
      <Header />
      {children}
      <Footer />
    </div>
  );
}
