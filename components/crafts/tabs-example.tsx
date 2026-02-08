import { playClickSound } from "@/lib/utils";
import { CraftsContainer } from "./crafts-container";
import { Skeleton } from "../ui/skeleton";
import { Tabs, TabsList, TabsPanel, TabsTab } from "../ui/tabs";

const TAB_ITEMS = [
  { value: "1", label: "Users" },
  { value: "2", label: "Storage Locations" },
  { value: "3", label: "Items" },
] as const;

function UsersSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}

function StorageLocationsSkeleton() {
  return (
    <div className="grid gap-3 p-4 sm:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col gap-2 rounded-lg border border-border/50 p-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

function ItemsSkeleton() {
  return (
    <div className="flex flex-col gap-0 p-4">
      <div className="grid grid-cols-[auto_1fr_80px_80px] gap-3 border-b border-border px-2 pb-2 text-xs text-muted-foreground">
        <span className="w-8" />
        <span>Name</span>
        <span>Qty</span>
        <span>Status</span>
      </div>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="grid grid-cols-[auto_1fr_80px_80px] items-center gap-3 border-b border-border/50 py-3 last:border-0"
        >
          <Skeleton className="size-8 shrink-0 rounded" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      ))}
    </div>
  );
}

const TAB_SKELETONS = {
  "1": UsersSkeleton,
  "2": StorageLocationsSkeleton,
  "3": ItemsSkeleton,
} as const;

type TabsExampleProps = {
  title: string;
};

export default function TabsExample({ title }: TabsExampleProps) {
  return (
    <CraftsContainer title={title}>
      <Tabs defaultValue="1" className="w-full flex-1 flex flex-col">
        <div className="border-b px-2 pt-1">
          <TabsList variant="underline">
            {TAB_ITEMS.map(({ value, label }) => (
              <TabsTab key={value} value={value} onClick={playClickSound}>
                {label}
              </TabsTab>
            ))}
          </TabsList>
        </div>
        {TAB_ITEMS.map(({ value }) => {
          const SkeletonView = TAB_SKELETONS[value];
          return (
            <TabsPanel key={value} value={value} className="overflow-auto">
              <SkeletonView />
            </TabsPanel>
          );
        })}
      </Tabs>
    </CraftsContainer>
  );
}