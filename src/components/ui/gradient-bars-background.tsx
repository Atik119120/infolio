import React from "react";

interface GradientBarsProps {
  numBars?: number;
  gradientFrom?: string;
  gradientTo?: string;
  animationDuration?: number;
  className?: string;
}

const calculateHeight = (index: number, total: number) => {
  const position = index / (total - 1);
  const maxHeight = 100;
  const minHeight = 30;
  const center = 0.5;
  const distanceFromCenter = Math.abs(position - center);
  const heightPercentage = Math.pow(distanceFromCenter * 2, 1.2);
  return minHeight + (maxHeight - minHeight) * heightPercentage;
};

export const GradientBars: React.FC<GradientBarsProps> = ({
  numBars = 15,
  gradientFrom = "rgb(255, 60, 0)",
  gradientTo = "transparent",
  animationDuration = 2,
  className = "",
}) => {
  return (
    <>
      <style>{`
        @keyframes gb-pulseBar {
          0% { transform: scaleY(var(--initial-scale)); }
          100% { transform: scaleY(calc(var(--initial-scale) * 0.7)); }
        }
      `}</style>
      <div
        className={`absolute inset-0 flex items-end justify-between overflow-hidden pointer-events-none ${className}`}
        aria-hidden
      >
        {Array.from({ length: numBars }).map((_, index) => {
          const heightPct = calculateHeight(index, numBars);
          return (
            <div
              key={index}
              className="flex-1 origin-bottom"
              style={
                {
                  height: "100%",
                  background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
                  transform: `scaleY(${heightPct / 100})`,
                  animation: `gb-pulseBar ${animationDuration}s ease-in-out ${index * 0.1}s infinite alternate`,
                  ["--initial-scale" as any]: heightPct / 100,
                  opacity: 0.6,
                } as React.CSSProperties
              }
            />
          );
        })}
      </div>
    </>
  );
};

interface ComponentProps extends GradientBarsProps {
  backgroundColor?: string;
  children?: React.ReactNode;
}

export default function GradientBarsBackground({
  numBars = 7,
  gradientFrom = "rgb(255, 60, 0)",
  gradientTo = "transparent",
  animationDuration = 2,
  backgroundColor = "rgb(10, 10, 10)",
  className = "",
  children,
}: ComponentProps) {
  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ background: backgroundColor }}
    >
      <GradientBars
        numBars={numBars}
        gradientFrom={gradientFrom}
        gradientTo={gradientTo}
        animationDuration={animationDuration}
      />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}

export { GradientBarsBackground as Component };
