import React from "react";
import { cn } from "@/lib/utils"; // Make sure you have this utility file

interface ShineBorderProps {
  className?: string;
  children?: React.ReactNode;
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: string | string[]; // We'll use an orange color
  style?: React.CSSProperties;
}

export default function ShineBorder({
  className,
  children,
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = "hsl(var(--primary))", // Default to primary, can be overridden to orange
  style,
}: ShineBorderProps) {
  const SvgElement = ({
    color,
    borderWidth,
  }: {
    color: string;
    borderWidth: number;
  }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 101 101"
      className="absolute inset-0 -z-10 h-full w-full"
      style={{
        borderRadius: `calc(${borderRadius}px + ${borderWidth}px)`,
      }}
    >
      <rect
        width="100%"
        height="100%"
        rx={borderRadius}
        ry={borderRadius}
        stroke={color}
        strokeWidth={borderWidth}
        className="opacity-0"
        style={{
          mask: "url(#mask)",
          animation: `shine-border-opacity ${duration}s linear infinite`,
        }}
      />
      <defs>
        <mask id="mask">
          <rect width="100%" height="100%" fill="white" rx={borderRadius} ry={borderRadius} />
        </mask>
        <style>{`
          @keyframes shine-border-opacity {
            0%, 20%, 100% { opacity: 0; }
            10% { opacity: 1; }
          }
        `}</style>
      </defs>
    </svg>
  );

  return (
    <div
      style={
        {
          "--shine-border-color-1": Array.isArray(color) ? color[0] : color,
          "--shine-border-color-2": Array.isArray(color)
            ? color[1]
            : "transparent",
          "--shine-border-color-3": Array.isArray(color)
            ? color[2]
            : "transparent",
          "--shine-border-width": `${borderWidth}px`,
          "--shine-border-duration": `${duration}s`,
          "--shine-border-radius": `${borderRadius}px`,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "shine-border relative",
        "overflow-hidden",
        "before:bg-[conic-gradient(var(--shine-border-color-3),var(--shine-border-color-2),var(--shine-border-color-1),var(--shine-border-color-2),var(--shine-border-color-3)_50%,transparent_70%)]",
        "before:absolute before:-z-10 before:h-[calc(100%_+_var(--shine-border-width)_*_4)] before:w-[calc(100%_+_var(--shine-border-width)_*_4)] before:animate-[shine-border_var(--shine-border-duration)_linear_infinite] before:rounded-[calc(var(--shine-border-radius)_+_var(--shine-border-width)_*_2)] before:p-[var(--shine-border-width)] before:[mask:linear-gradient(rgb(0_0_0)_0_0)_content-box,linear-gradient(rgb(0_0_0)_0_0)] before:[mask-composite:intersect]",
        "after:absolute after:-z-10 after:h-full after:w-full after:animate-[shine-border_var(--shine-border-duration)_linear_infinite] after:rounded-[var(--shine-border-radius)] after:bg-[conic-gradient(transparent_50%,var(--shine-border-color-1)_70%)] after:p-[var(--shine-border-width)] after:[mask:linear-gradient(rgb(0_0_0)_0_0)_content-box,linear-gradient(rgb(0_0_0)_0_0)] after:[mask-composite:intersect]",
        className,
      )}
    >
      {children}
      {Array.isArray(color) && (
        <>
          <SvgElement color="var(--shine-border-color-2)" borderWidth={borderWidth} />
          <SvgElement color="var(--shine-border-color-3)" borderWidth={borderWidth} />
        </>
      )}
    </div>
  );
} 