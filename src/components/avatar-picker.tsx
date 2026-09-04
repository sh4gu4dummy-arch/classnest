import { useMemo, useState } from "react";
import { getAvatars, type AvatarCategory, type AvatarPack } from "@/lib/avatars";
import { cn } from "@/lib/utils";

interface AvatarPickerProps {
  value: number;
  onChange: (id: number) => void;
  pack?: AvatarPack;
  className?: string;
}

const CATEGORY_LABELS: Record<AvatarCategory | "all", string> = {
  all: "All",
  creature: "Creatures",
  animal: "Animals",
  fighter: "Fighters",
  scifi: "Sci-fi",
  human: "People",
  mythic: "Mythic",
  nature: "Nature",
  legendary: "Legendary",
};

export function AvatarPicker({
  value,
  onChange,
  pack = "kids",
  className,
}: AvatarPickerProps) {
  const avatars = getAvatars(pack);
  const [filter, setFilter] = useState<AvatarCategory | "all">("all");

  const categories = useMemo(() => {
    const set = new Set(avatars.map((a) => a.category));
    return ["all", ...Array.from(set)] as (AvatarCategory | "all")[];
  }, [avatars]);

  const visible = useMemo(
    () => (filter === "all" ? avatars : avatars.filter((a) => a.category === filter)),
    [avatars, filter],
  );

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
              filter === c
                ? "bg-accent text-accent-fg"
                : "bg-surface-2 text-muted-fg hover:bg-surface-3",
            )}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>
      <div className="grid max-h-[min(52vh,420px)] grid-cols-4 gap-2 overflow-y-auto pr-1 sm:grid-cols-5">
        {visible.map((a) => {
          const selected = value === a.id;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onChange(a.id)}
              className={cn(
                "group flex flex-col items-center gap-1 rounded-xl border-2 p-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected
                  ? "border-accent bg-accent/10 shadow-md scale-[1.02]"
                  : "border-transparent bg-surface-2/80 hover:border-border-strong hover:bg-surface",
              )}
              aria-label={a.name}
              aria-pressed={selected}
            >
              <span className="size-14 overflow-hidden rounded-xl sm:size-16">
                <img
                  src={a.src}
                  alt=""
                  className="size-full object-cover"
                  draggable={false}
                  loading="lazy"
                />
              </span>
              <span className="w-full truncate text-center text-[10px] font-semibold leading-tight text-fg">
                {a.name}
              </span>
              {a.vibe && (
                <span className="w-full truncate text-center text-[9px] leading-tight text-muted-fg">
                  {a.vibe}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
