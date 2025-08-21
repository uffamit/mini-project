"use client";

import { cn } from "@/lib/utils";

interface StrengthMeterProps {
  strengthLevel: string;
}

export function StrengthMeter({ strengthLevel }: StrengthMeterProps) {
  const strengthConfig: { [key: string]: { value: number; color: string } } = {
    weak: { value: 33, color: "bg-destructive" },
    moderate: { value: 66, color: "bg-yellow-500" },
    strong: { value: 100, color: "bg-primary" },
  };

  const level = strengthLevel.toLowerCase();
  const { value, color } = strengthConfig[level] || { value: 0, color: "bg-muted" };

  return (
    <div className="h-2 w-full rounded-none border border-primary/20 bg-background p-0.5">
      <div
        className={cn("h-full transition-all duration-500", color)}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
