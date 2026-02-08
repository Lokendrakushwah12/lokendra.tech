import { Card, CardHeader, CardPanel, CardTitle } from "../ui/card";

type CraftsContainerProps = {
  title: string;
  children: React.ReactNode;
};

export function CraftsContainer({ title, children }: CraftsContainerProps) {
  return (
    <Card className="w-full flex flex-col md:h-[500px] h-96 bg-white dark:bg-black/20 backdrop-blur-lg gap-0 overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-muted-foreground font-normal text-center text-sm">
          {title}
        </CardTitle>
      </CardHeader>
      <CardPanel className="flex-1 flex flex-col min-h-0 p-0">
        {children}
      </CardPanel>
    </Card>
  );
}
