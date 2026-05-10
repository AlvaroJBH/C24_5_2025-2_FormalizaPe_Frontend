"use client";

import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface LabeledTooltipProps {
  label: string;
  content: string;
  children: React.ReactNode;
}

export function LabeledTooltip({ label, content, children }: LabeledTooltipProps) {
  return (
    <div className="flex items-center gap-1.5">
      {children}
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center w-4 h-4 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            onClick={(e) => e.preventDefault()}
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-[250px]">
          <p className="text-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}