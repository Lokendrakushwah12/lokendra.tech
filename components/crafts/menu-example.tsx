import { toastManager } from "@/components/ui/toast";
import { playClickSound } from "@/lib/utils";
import { CopyIcon, Edit3Icon, EllipsisVerticalIcon, EyeIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "../ui/menu";
import { CraftsContainer } from "./crafts-container";

const MENU_ITEMS: Array<{
  value: string;
  label: string;
  icon: typeof Edit3Icon;
  destructive?: boolean;
}> = [
    { value: "1", label: "Edit", icon: Edit3Icon },
    { value: "2", label: "View", icon: EyeIcon },
    { value: "3", label: "Copy", icon: CopyIcon },
    { value: "4", label: "Delete", icon: TrashIcon, destructive: true },
  ];

type MenuExampleProps = {
  title: string;
};

export default function MenuExample({ title }: MenuExampleProps) {
  return (
    <CraftsContainer title={title}>
      <div className="flex flex-1 items-center justify-center p-4">
        <Menu>
          <MenuTrigger render={<Button variant="outline" size="icon" onClick={playClickSound}><EllipsisVerticalIcon className="size-4" /></Button>} />
          <MenuPopup>
            {MENU_ITEMS.map(({ value, label, icon: Icon, destructive = false }) => (
              <MenuItem
                key={value}
                className="font-inter"
                variant={destructive ? "destructive" : "default"}
                onClick={() => {
                  playClickSound();
                  toastManager.add({
                    title: `${label} was clicked`,
                    type: label === "Delete" ? "error" : label === "View" ? "warning" : label === "Copy" ? "success" : "info",
                    description: label === "Delete" ? "This action cannot be undone" : label === "View" ? "This action will open the item in a new tab" : label === "Copy" ? "This action will copy the item to the clipboard" : "This action will open the item in a new tab",
                  });
                }}
              >
                <Icon className="size-3.5" />
                {label}
              </MenuItem>
            ))}
          </MenuPopup>
        </Menu>
      </div>
    </CraftsContainer>
  );
}