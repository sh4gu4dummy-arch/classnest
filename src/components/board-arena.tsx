/** Full-viewport still behind the board. Dimmed in dark mode, never animated. */
export function BoardArenaLayer({ src }: { src: string | null }) {
  if (!src) return null;
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/35 via-bg/45 to-bg/60 dark:from-black/40 dark:via-black/55 dark:to-black/70" />
    </div>
  );
}
