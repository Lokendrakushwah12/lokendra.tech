import ClientDither from "@/components/Dither/ClientDither";
import About from "@/components/sections/about";
import Experience from "@/components/sections/experience";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import Projects from "@/components/sections/projects";
import LinesBG from "@/components/ui/lines-bg";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="flex flex-col h-full lg:max-w-4xl overflow-clip mx-auto relative">
      <ClientDither />
      <ProgressiveBlur
        className="pointer-events-none z-500 fixed bottom-0 w-full h-20"
        direction="bottom"
        blurIntensity={1}
      />
      <Header />
      <LinesBG />
      <About />
      <LinesBG />
      <Experience />
      <LinesBG />
      <Suspense fallback={<ProjectsFallback />}>
        <Projects />
      </Suspense>
      <LinesBG />
      <Footer />
    </div>
  );
}

function ProjectsFallback() {
  return (
    <div className="border-b border-border border-dashed">
      <div className="border-x border-border border-dashed p-4 max-w-screen-xl w-full mx-auto space-y-4 py-8 md:py-16">
        <div className="w-full inline-flex items-center justify-center gap-1 font-normal tracking-tight text-xl text-muted-foreground">
          Projects
        </div>
      </div>
    </div>
  );
}
