import ClientDither from "@/components/Dither/ClientDither";
import About from "@/components/sections/about";
import Experience from "@/components/sections/experience";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import Projects from "@/components/sections/projects";
import LinesBG from "@/components/ui/lines-bg";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export default function Page() {
  return (
    <div className="flex flex-col h-full lg:max-w-4xl overflow-clip mx-auto relative">
      <ClientDither />
      <ProgressiveBlur
        className="pointer-events-none z-[500] fixed bottom-0 w-full h-20"
        direction="bottom"
        blurIntensity={1}
      />
      <Header />
      <About />
      <LinesBG />
      <Experience />
      <LinesBG />
      <Projects />
      <LinesBG />
      <Footer />
    </div>
  );
}
