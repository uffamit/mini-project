"use client";

import { cn } from "@/lib/utils";

interface StrengthMeterProps {
  strengthLevel: string;
}

export function StrengthMeter({ strengthLevel }: StrengthMeterProps) {
  const strengthConfig: { [key: string]: { value: number; color: string } } = {
    weak: { value: 33, color: "bg-red-500" },
    moderate: { value: 66, color: "bg-yellow-500" },
    strong: { value: 100, color: "bg-green-500" },
  };

  const level = strengthLevel.toLowerCase();
  const { value, color } = strengthConfig[level] || { value: 0, color: "bg-slate-200" };

  return (
    <div className="h-2 w-full rounded-full bg-slate-200">
      <div
        className={cn("h-full rounded-full transition-all duration-500", color)}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
