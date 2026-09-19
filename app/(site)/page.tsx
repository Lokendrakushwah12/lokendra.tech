import About from "@/components/sections/about";
// import Blogs from "@/components/sections/blogs";
import Experience from "@/components/sections/experience";
import Projects from "@/components/sections/projects";
import Enter from "@/components/ui/enter";
import LinesBG from "@/components/ui/lines-bg";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      {/* <LinesBG /> */}
      <Enter stagger={1}>
        <About />
      </Enter>
      <LinesBG />
      <Enter stagger={2}>
        <Experience />
      </Enter>
      <LinesBG />
      <Enter stagger={3}>
        <Suspense fallback={<ProjectsFallback />}>
          <Projects />
        </Suspense>
      </Enter>
      {/* <LinesBG />
      <Blogs /> */}
      <LinesBG />
    </>
  );
}

function ProjectsFallback() {
  return (
    <div>
      <div className="p-4 max-w-screen-xl w-full mx-auto space-y-4 py-8 md:py-16">
        <div className="w-full inline-flex items-center justify-center gap-1 font-normal tracking-tight text-xl text-muted-foreground">
          Projects
        </div>
      </div>
    </div>
  );
}
