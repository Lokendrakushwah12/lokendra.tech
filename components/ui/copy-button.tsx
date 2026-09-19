// components/ui/copy-button.tsx
"use client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import IconSwap from "./icon-swap";

interface CopyButtonProps {
  email: string;
}

const CopyButton = ({ email }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-center items-center">
      <Button
        className="scale-[75%] size-6"
        variant="ghost"
        size="icon"
        onClick={handleCopy}
      >
        <IconSwap swapKey={copied ? "check" : "copy"}>
          {copied ? (
            <Check className="text-muted-foreground" />
          ) : (
            <Copy className="text-muted-foreground" />
          )}
        </IconSwap>
      </Button>

      <p className="text-xs font-normal text-muted-foreground text-right">
        {email}
      </p>
    </div>
  );
};

export default CopyButton;