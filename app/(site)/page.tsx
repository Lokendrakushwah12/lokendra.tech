import About from "@/components/sections/about";
// import Blogs from "@/components/sections/blogs";
import Experience from "@/components/sections/experience";
import Projects from "@/components/sections/projects";
import LinesBG from "@/components/ui/lines-bg";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <LinesBG />
      <About />
      <LinesBG />
      <Experience />
      <LinesBG />
      <Suspense fallback={<ProjectsFallback />}>
        <Projects />
      </Suspense>
      {/* <LinesBG />
      <Blogs /> */}
      <LinesBG />
    </>
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
