type GaugeProps = {
  value: number;
  color?: string;
  showLabels?: boolean;
  min?: string;
  max?: string;
};

export default function Gauge({
  value,
  color = "#ef4d23",
  showLabels = false,
  min,
  max,
}: GaugeProps) {
  const ticks = 40;
  const activeCount = Math.round((value / 100) * ticks);
  const center = 100;
  const radius = 80;

  return (
    <div className="mx-auto w-full max-w-[260px]">
      <svg viewBox="0 0 200 120" className="w-full" aria-label={`${value}%`}>
        {Array.from({ length: ticks }, (_, index) => {
          const angle = Math.PI + (index / (ticks - 1)) * Math.PI;
          const x1 = center + Math.cos(angle) * (radius - 10);
          const y1 = center + Math.sin(angle) * (radius - 10);
          const x2 = center + Math.cos(angle) * radius;
          const y2 = center + Math.sin(angle) * radius;

          return (
            <line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={index < activeCount ? color : "#d4d4d8"}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          );
        })}
        <text
          x="100"
          y="105"
          textAnchor="middle"
          fontSize="22"
          fontWeight="600"
          fill="#111827"
        >
          {value}%
        </text>
      </svg>
      {showLabels && (
        <div className="-mt-1 flex justify-between px-1 text-[11px] text-neutral-500">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}
