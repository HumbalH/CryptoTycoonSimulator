import { LucideIcon } from "lucide-react";

interface ResourceCounterProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export default function ResourceCounter({ icon: Icon, label, value, trend, className = "" }: ResourceCounterProps) {
  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-muted-foreground"
  };

  return (
    <div className={`flex items-center gap-2 ${className}`} data-testid={`counter-${label.toLowerCase().replace(/\s/g, '-')}`}>
      <div className="p-2 rounded-md bg-card border border-card-border">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
        <span className={`text-lg font-bold font-mono ${trend ? trendColors[trend] : 'text-foreground'}`}>
          {value}
        </span>
      </div>
    </div>
  );
}
