"use client";

import * as React from "react";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "@/lib/utils";

type TabsVariant = "default" | "underline";

const TabsVariantContext = React.createContext<TabsVariant>("default");

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn(
        "flex flex-col gap-2 data-[orientation=vertical]:flex-row",
        className
      )}
      {...props}
    />
  );
}

type HoverSnapshot = {
  width: number;
  height: number;
  left: number;
  top: number;
  orientation: "horizontal" | "vertical";
};

function TabsList({
  variant = "default",
  className,
  children,
  ...props
}: TabsPrimitive.List.Props & {
  variant?: TabsVariant;
}) {
  const [hoverSnapshot, setHoverSnapshot] =
    React.useState<HoverSnapshot | null>(null);

  const wrappedChildren = React.useMemo(() => {
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) {
        return child;
      }

      type HoverableTabElement = React.ReactElement<
        TabsPrimitive.Tab.Props & {
          onPointerEnter?: (event: React.PointerEvent<HTMLElement>) => void;
          onPointerLeave?: (event: React.PointerEvent<HTMLElement>) => void;
        }
      >;

      const element = child as HoverableTabElement;

      const handleEnter = (
        event: React.PointerEvent<HTMLElement> | React.MouseEvent<HTMLElement>
      ) => {
        const current = event.currentTarget as HTMLElement;
        const tabRect = current.getBoundingClientRect();
        const listElement = current.closest(
          '[data-slot="tabs-list"]'
        ) as HTMLElement | null;
        const listRect = listElement?.getBoundingClientRect();
        const orientation =
          listElement?.dataset.orientation === "vertical"
            ? "vertical"
            : "horizontal";

        if (listRect) {
          setHoverSnapshot({
            width: tabRect.width,
            height: tabRect.height,
            left: tabRect.left - listRect.left,
            top: tabRect.top - listRect.top,
            orientation,
          });
        }

        element.props.onPointerEnter?.(
          event as React.PointerEvent<HTMLElement>
        );
      };

      return React.cloneElement(element, {
        onPointerEnter: handleEnter,
        onMouseEnter: handleEnter,
        onPointerLeave: element.props.onPointerLeave,
      });
    });
  }, [children]);

  const hoverIndicatorClass = cn(
    "pointer-events-none absolute left-0 rounded-md transition-transform duration-150 ease-out -translate-px ",
    variant === "default" ? "z-0 bg-foreground/5" : "z-10 bg-muted/80"
  );

  return (
    <TabsVariantContext.Provider value={variant}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        className={cn(
          "relative z-0 flex w-fit items-center justify-center gap-x-0.5",
          "data-[orientation=vertical]:flex-col",
          variant === "default"
            ? "rounded-lg border border-border/50 shadow-xs bg-white dark:bg-muted/20 p-0.5 text-foreground"
            : "data-[orientation=horizontal]:py-[4.3px] data-[orientation=vertical]:px-1",
          className
        )}
        onPointerLeave={() => setHoverSnapshot(null)}
        {...props}
      >
        {hoverSnapshot ? (
          <span
            className={cn(hoverIndicatorClass)}
            data-orientation={hoverSnapshot.orientation}
            style={createHoverStyle(hoverSnapshot)}
          />
        ) : null}
        {wrappedChildren}
        <TabsPrimitive.Indicator
          data-slot="tab-indicator"
          className={cn(
            "absolute bottom-0 left-0 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-(--active-tab-bottom) transition-[width,translate] duration-200 ease-in-out",
            variant === "underline"
              ? "z-10 bg-primary data-[orientation=horizontal]:-bottom-[calc(--spacing(1)+1px)] data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:-start-[calc(--spacing(1)+1px)] data-[orientation=vertical]:w-0.5"
              : "z-0 rounded-md border border-border/60 bg-foreground shadow-xs dark:bg-accent"
          )}
        />
      </TabsPrimitive.List>
    </TabsVariantContext.Provider>
  );
}

function TabsTab({ className, ...props }: TabsPrimitive.Tab.Props) {
  const variant = React.useContext(TabsVariantContext);
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative z-10 flex flex-1 shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent text-sm font-medium whitespace-nowrap transition-[color,background-color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-ring data-disabled:pointer-events-none data-disabled:opacity-64 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "text-muted-foreground/80 hover:text-foreground data-active:text-background dark:text-muted-foreground/80 dark:hover:text-foreground dark:data-active:text-foreground",
        variant === "underline" ? "data-active:text-primary" : "",
        "gap-1.5 px-[calc(--spacing(2.5)-1px)] py-[calc(--spacing(1.5)-1px)]",
        "data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start",
        className
      )}
      {...props}
    />
  );
}

function TabsPanel({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

function createHoverStyle(snapshot: HoverSnapshot): React.CSSProperties {
  return {
    width: snapshot.width,
    transform: `translate3d(${snapshot.left}px, 0, 0)`,
    top: snapshot.top,
    height: snapshot.height,
  }
}

export {
  Tabs,
  TabsList,
  TabsTab,
  TabsTab as TabsTrigger,
  TabsPanel,
  TabsPanel as TabsContent,
};
