import { cn } from "@/lib/utils";
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import type { RiskLevel } from "@shared/schema";

interface RiskScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function RiskScore({ score, size = "md", showLabel = true, className }: RiskScoreProps) {
  const riskLevel: RiskLevel = score >= 71 ? "safe" : score >= 41 ? "warning" : "danger";
  
  const sizeClasses = {
    sm: "w-12 h-12 text-lg",
    md: "w-20 h-20 text-2xl",
    lg: "w-28 h-28 text-4xl",
  };
  
  const ringColors = {
    safe: "stroke-success",
    warning: "stroke-warning",
    danger: "stroke-danger",
  };
  
  const bgColors = {
    safe: "bg-success/10",
    warning: "bg-warning/10",
    danger: "bg-danger/10",
  };
  
  const textColors = {
    safe: "text-success",
    warning: "text-warning",
    danger: "text-danger",
  };
  
  const labels = {
    safe: "Safe",
    warning: "Caution",
    danger: "Danger",
  };
  
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className={cn("relative flex items-center justify-center rounded-full", bgColors[riskLevel], sizeClasses[size])}>
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="6"
            className="stroke-muted"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            className={cn("transition-all duration-500", ringColors[riskLevel])}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
            }}
          />
        </svg>
        <span className={cn("font-bold z-10", textColors[riskLevel])}>
          {score}
        </span>
      </div>
      {showLabel && (
        <span className={cn("text-sm font-medium", textColors[riskLevel])}>
          {labels[riskLevel]}
        </span>
      )}
    </div>
  );
}

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const config = {
    safe: {
      icon: ShieldCheck,
      label: "Safe",
      className: "bg-success/10 text-success border-success/20",
    },
    warning: {
      icon: ShieldAlert,
      label: "Warning",
      className: "bg-warning/10 text-warning border-warning/20",
    },
    danger: {
      icon: ShieldX,
      label: "Danger",
      className: "bg-danger/10 text-danger border-danger/20",
    },
  };
  
  const { icon: Icon, label, className: levelClass } = config[level];
  
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border",
      levelClass,
      className
    )}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
  );
}

interface RiskIconProps {
  level: RiskLevel;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RiskIcon({ level, size = "md", className }: RiskIconProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };
  
  const config = {
    safe: {
      icon: ShieldCheck,
      className: "text-success",
    },
    warning: {
      icon: ShieldAlert,
      className: "text-warning",
    },
    danger: {
      icon: ShieldX,
      className: "text-danger",
    },
  };
  
  const { icon: Icon, className: levelClass } = config[level];
  
  return <Icon className={cn(sizeClasses[size], levelClass, className)} />;
}
