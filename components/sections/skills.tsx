"use client";

import { creators, skills, type CreatorId } from "@/config/skills";
import { playClickSound } from "@/lib/utils";
import { ChevronDownIcon, FileTextIcon } from "lucide-react";
import { useState } from "react";
import BackHome from "../ui/back-home";
import { Button } from "../ui/button";
import Enter from "../ui/enter";
import {
  Menu,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "../ui/menu";

type Filter = CreatorId | "all";

const creatorIds = Object.keys(creators) as CreatorId[];

export function Skills() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  // the cascade is for arriving on the page or switching creator; while typing
  // it would make every returning row fade back in
  const [cascade, setCascade] = useState(true);

  const q = query.trim().toLowerCase();
  const shown = skills.filter(
    (s) =>
      (filter === "all" || s.creator === filter) &&
      `${s.name} ${creators[s.creator].name} ${s.description}`
        .toLowerCase()
        .includes(q),
  );

  return (
    <main className="relative flex-1 p-4 font-inter">
      <Enter stagger={1}>
        <BackHome current="skills" />
      </Enter>

      <Enter stagger={2}>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <h1 className="text-xl tracking-tight text-foreground">
            Skills
            <span className="ml-2 text-sm text-muted-foreground tabular-nums">
              {shown.length}
            </span>
          </h1>
          <div className="flex items-center gap-2">
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setCascade(false);
                setQuery(e.target.value);
              }}
              placeholder="Search skills"
              aria-label="Search skills by name, creator or description"
              className="h-7 w-36 rounded-md border bg-white px-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:w-44 dark:border-input dark:bg-input/30"
            />
            <Menu>
              <MenuTrigger
                render={
                  <Button variant="outline" size="xs" onClick={playClickSound}>
                    {filter === "all" ? "All creators" : creators[filter].name}
                    <ChevronDownIcon className="size-3.5 opacity-60" />
                  </Button>
                }
              />
              <MenuPopup align="end">
                <MenuRadioGroup
                  value={filter}
                  onValueChange={(value) => {
                    playClickSound();
                    setCascade(true);
                    setFilter(value as Filter);
                  }}
                >
                  <MenuRadioItem
                    value="all"
                    className="font-inter"
                    closeOnClick
                  >
                    All creators
                  </MenuRadioItem>
                  {creatorIds.map((id) => (
                    <MenuRadioItem
                      key={id}
                      value={id}
                      className="font-inter"
                      closeOnClick
                    >
                      {creators[id].name}
                    </MenuRadioItem>
                  ))}
                </MenuRadioGroup>
              </MenuPopup>
            </Menu>
          </div>
        </div>
      </Enter>

      <Enter stagger={3} list>
        {/* keyed by filter so the cascade replays when the list changes */}
        <ul key={filter} className={cascade ? "enter-list mt-4" : "mt-4"}>
          {shown.map((skill) => (
            <li
              key={`${skill.creator}/${skill.name}`}
              className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-b border-dashed py-2.5 sm:grid-cols-[1fr_7rem_15rem]"
            >
              <a
                href={skill.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 items-center gap-2.5 text-foreground transition-opacity hover:opacity-60"
              >
                <FileTextIcon className="size-4 shrink-0 text-muted-foreground/60" />
                <span className="truncate">{skill.name}</span>
              </a>
              <a
                href={creators[skill.creator].url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {creators[skill.creator].name}
              </a>
              <span className="col-span-2 pl-6.5 text-sm text-muted-foreground/70 sm:col-span-1 sm:pl-0 sm:text-right">
                {skill.description}
              </span>
            </li>
          ))}
          {shown.length === 0 && (
            <li className="py-6 text-sm text-muted-foreground">
              No skills match &ldquo;{query}&rdquo;.
            </li>
          )}
        </ul>
      </Enter>
    </main>
  );
}
