"use client";

import userData from "@/config/userData";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import MenuExample from "../crafts/menu-example";
import TabsExample from "../crafts/tabs-example";
import ProjectCard from "../ui/project-card";
import { Tabs, TabsList, TabsPanel, TabsTab } from "../ui/tabs";
import ToastExample from "../crafts/toast-example";

const TAB_VALUES = ["projects", "crafts"] as const;
type TabValue = (typeof TAB_VALUES)[number];

function isValidTab(tab: string | null): tab is TabValue {
  return tab === "projects" || tab === "crafts";
}

const Projects = () => {
  const { projects } = userData;
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: TabValue = isValidTab(tabParam) ? tabParam : "projects";

  const setTab = useCallback(
    (value: TabValue) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", value);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <div className="border-b border-border border-dashed">
      <div className="border-x border-border border-dashed p-4 max-w-screen-xl w-full mx-auto space-y-4 py-8 md:py-16">
        <div className="w-full inline-flex items-center justify-center gap-1 font-normal tracking-tight text-xl">
          <Tabs
            className="gap-6 w-full"
            value={activeTab}
            onValueChange={(value) => setTab(value as TabValue)}
          >
            <TabsList className="w-fit">
              <TabsTab value="projects" className="uppercase">Projects</TabsTab>
              <TabsTab value="crafts" className="uppercase">Crafts</TabsTab>
            </TabsList>
            <TabsPanel value="projects">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 group/projects">
                {projects.map((project, index) => (
                  <ProjectCard
                    key={index}
                    title={project.title}
                    description={project.description}
                    tags={project.tags}
                    liveLink={project.Livelink}
                    imageSrc={project.imageSrc}
                    gitHubLink={project.gitHubLink}
                    date={project.date}
                    working={project.working}
                  />
                ))}
              </div>
            </TabsPanel>
            <TabsPanel value="crafts">
              <div className="w-full font-inter flex flex-col gap-4 group/projects">
                <ToastExample title="Toast Component" />
                <TabsExample title="Tabs Component" />
                <MenuExample title="Menu Component" />
              </div>
            </TabsPanel>
          </Tabs>
        </div>

      </div>
    </div>
  );
};

export default Projects;