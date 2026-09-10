/** Lightweight CSS confetti — few pieces, compositor-only motion. */

export function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null;
  // 16 pieces is plenty on a smartboard; 36 was GPU-heavy under blur
  const pieces = Array.from({ length: 16 }, (_, i) => i);
  const colors = [
    "#fbbf24",
    "#34d399",
    "#60a5fa",
    "#f472b6",
    "#a78bfa",
    "#fb923c",
    "#2dd4bf",
  ];

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      aria-hidden
    >
      {pieces.map((i) => {
        const left = (i * 19 + 7) % 100;
        const delay = (i % 8) * 0.05;
        const duration = 1.2 + (i % 4) * 0.12;
        const rot = (i * 47) % 360;
        const color = colors[i % colors.length]!;
        const size = 7 + (i % 3) * 2;
        return (
          <span
            key={i}
            className="absolute top-0 animate-confetti-fall rounded-sm"
            style={{
              left: `${left}%`,
              width: size,
              height: size * (i % 2 === 0 ? 0.55 : 1.15),
              background: color,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              transform: `rotate(${rot}deg)`,
              willChange: "transform, opacity",
            }}
          />
        );
      })}
    </div>
  );
}
