import { playClickSound } from "@/lib/utils";
import { CraftsContainer } from "./crafts-container";
import { Skeleton } from "../ui/skeleton";
import { Tabs, TabsList, TabsPanel, TabsTab } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";

const TAB_ITEMS = [
  { value: "1", label: "Users" },
  { value: "2", label: "Stations" },
  { value: "3", label: "Storage Locations" },
  { value: "4", label: "Production Lines" },
  { value: "5", label: "Equipment" },
  { value: "6", label: "Number Configurations" },
  { value: "7", label: "Preferences" },
  { value: "8", label: "Pin Management" },
  { value: "9", label: "Purchase Orders" },
  { value: "10", label: "Integrations" },
] as const;

function UsersSkeleton() {
  return (
    <div className="flex flex-col gap-0 border rounded-lg shadow-xs">
      <div className="px-4 py-2.5 grid grid-cols-[140px_120px_120px_140px_140px_200px] gap-3 border-b border-border text-[11px] text-muted-foreground">
        <span>User</span>
        <span>Role</span>
        <span>Login Type</span>
        <span>Inventory</span>
        <span>Items And Skus</span>
        <span>Purchasing</span>
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="p-4 grid grid-cols-[140px_120px_120px_140px_140px_200px] items-center gap-3 border-b border-border/50 py-3 last:border-0"
        >
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
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
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-10 rounded-full" />
          </div>
          <Skeleton className="h-3 w-5/6" />
          <div className="mt-1 grid grid-cols-2 gap-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function StationsSkeleton() {
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
function ItemsSkeleton() {
  return (
    <div className="grid gap-3 p-4 sm:grid-cols-2">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-lg border border-border/50 p-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 shrink-0 rounded-md" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductionLinesSkeleton() {
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

function NumberConfigurationsSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border border-border/50 p-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PreferencesSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function PinManagementSkeleton() {
  return (
    <div className="grid gap-3 p-4 sm:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-lg border border-border/50 p-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <div className="mt-3 flex gap-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PurchaseOrdersSkeleton() {
  return (
    <div className="flex flex-col gap-0 p-4">
      <div className="grid grid-cols-[1fr_110px_90px] gap-3 border-b border-border px-2 pb-2 text-xs text-muted-foreground">
        <span>PO Number</span>
        <span>Amount</span>
        <span>Status</span>
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_110px_90px] items-center gap-3 border-b border-border/50 py-3 last:border-0"
        >
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function IntegrationsSkeleton() {
  return (
    <div className="grid gap-3 p-4 md:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-lg border border-border/50 p-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 shrink-0 rounded-lg" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
const TAB_SKELETONS = {
  "1": UsersSkeleton,
  "2": StorageLocationsSkeleton,
  "3": StationsSkeleton,
  "4": ItemsSkeleton,
  "5": ProductionLinesSkeleton,
  "6": NumberConfigurationsSkeleton,
  "7": PreferencesSkeleton,
  "8": PinManagementSkeleton,
  "9": PurchaseOrdersSkeleton,
  "10": IntegrationsSkeleton,
} as const;

type TabsExampleProps = {
  title: string;
};

export default function TabsExample({ title }: TabsExampleProps) {
  return (
    <CraftsContainer title={title}>
      <Tabs defaultValue="1" className="w-full flex-1 flex flex-col">
        <ScrollArea scrollFade className="border-b h-fit no-scrollbar px-2 pt-1">
          <TabsList variant="underline">
            {TAB_ITEMS.map(({ value, label }) => (
              <TabsTab key={value} value={value} onClick={playClickSound}>
                {label}
              </TabsTab>
            ))}
          </TabsList>
        </ScrollArea>
        {TAB_ITEMS.map(({ value }) => {
          const SkeletonView = TAB_SKELETONS[value];
          return (
            <TabsPanel key={value} value={value} className="p-4">
              <SkeletonView />
            </TabsPanel>
          );
        })}
      </Tabs>
    </CraftsContainer>
  );
}
