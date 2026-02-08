import { toastManager } from "@/components/ui/toast";
import { playClickSound } from "@/lib/utils";
import { Button } from "../ui/button";
import { CraftsContainer } from "./crafts-container";

const TOAST_ITEMS: Array<{
  id: string;
  title: string;
  description: string;
  type?: "error" | "info" | "success" | "warning" | "loading";
}> = [
    { id: "1", title: "Default", description: "This action cannot be undone" },
    { id: "2", title: "Info", description: "This action will open the item in a new tab", type: "info" },
    { id: "3", title: "Success", description: "This action will copy the item to the clipboard", type: "success" },
    { id: "4", title: "Warning", description: "This action cannot be undone", type: "warning" },
    { id: "5", title: "Loading", description: "This action cannot be undone", type: "loading" },
    { id: "6", title: "Error", description: "This action cannot be undone", type: "error" },
  ];

type ToastExampleProps = {
  title: string;
};

export default function ToastExample({ title }: ToastExampleProps) {
  return (
    <CraftsContainer title={title}>
      <div className="flex flex-1 items-center justify-center gap-2 p-4">
        {TOAST_ITEMS.map(({ id, title, description, type }) => (
          <Button key={id} variant="outline" size="sm" onClick={() => {
            playClickSound();
            toastManager.add({
              title,
              description,
              type,
            });
          }}>
            {title}
          </Button>
        ))}
      </div>
    </CraftsContainer>
  );
}