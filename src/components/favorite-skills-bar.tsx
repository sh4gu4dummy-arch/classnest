import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillIcon } from "@/components/skill-icon";
import {
  loadFavoriteSkillIds,
  saveFavoriteSkillIds,
  toggleFavoriteSkillId,
  MAX_FAVORITES,
} from "@/lib/prefs";
import { useClassStore } from "@/lib/store";
import type { Behavior } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FavoriteSkillsBarProps {
  classId?: string;
  /** Who gets the award — if empty, buttons disabled with hint */
  targetLabel?: string;
  disabled?: boolean;
  onAward: (behavior: Behavior) => void;
  className?: string;
}

export function FavoriteSkillsBar({
  classId,
  targetLabel,
  disabled,
  onAward,
  className,
}: FavoriteSkillsBarProps) {
  const behaviors = useClassStore((s) =>
    classId ? s.classBehaviors(classId) : s.behaviors,
  );
  const [favIds, setFavIds] = useState<string[]>([]);

  useEffect(() => {
    setFavIds(loadFavoriteSkillIds());
    const onFav = () => setFavIds(loadFavoriteSkillIds());
    window.addEventListener("classnest-favorites-changed", onFav);
    return () => window.removeEventListener("classnest-favorites-changed", onFav);
  }, [behaviors]);

  const favs = favIds
    .map((id) => behaviors.find((b) => b.id === id))
    .filter((b): b is Behavior => !!b);

  if (favs.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5 rounded-xl border-2 border-border bg-surface px-2 py-1.5 shadow-sm",
        className,
      )}
      data-chrome="teacher"
      data-favorite-bar
    >
      <span className="px-1 text-[10px] font-bold uppercase tracking-wide text-muted-fg">
        Favorites
        {targetLabel ? (
          <span className="ml-1 font-semibold normal-case text-fg">→ {targetLabel}</span>
        ) : null}
      </span>
      {favs.map((b) => {
        const pos = b.kind === "positive";
        return (
          <Button
            key={b.id}
            type="button"
            size="sm"
            variant="secondary"
            disabled={disabled || !targetLabel}
            data-favorite-skill
            className={cn(
              "h-9 min-h-9 gap-1.5 px-2.5 text-xs sm:h-10",
              pos ? "border-positive/30" : "border-danger/30",
            )}
            title={
              targetLabel
                ? `Award ${b.label} to ${targetLabel}`
                : "Tap a student first"
            }
            onClick={() => onAward(b)}
          >
            <SkillIcon icon={b.icon} />
            <span className="max-w-[6rem] truncate font-semibold">{b.label}</span>
            <span className="tabular-nums font-bold">
              {b.points > 0 ? `+${b.points}` : b.points}
            </span>
          </Button>
        );
      })}
    </div>
  );
}

/** Star toggle on each skill in the award panel */
export function FavoriteSkillToggle({ behaviorId }: { behaviorId: string }) {
  const [on, setOn] = useState(() => loadFavoriteSkillIds().includes(behaviorId));

  useEffect(() => {
    setOn(loadFavoriteSkillIds().includes(behaviorId));
  }, [behaviorId]);

  return (
    <button
      type="button"
      aria-label={on ? "Remove favorite" : "Add favorite"}
      title={
        on
          ? "Remove from favorites bar"
          : `Pin to favorites (max ${MAX_FAVORITES})`
      }
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg transition active:scale-95",
        on
          ? "text-amber-500 hover:bg-amber-500/10"
          : "text-muted-fg hover:bg-surface-2 hover:text-fg",
      )}
      onClick={(e) => {
        e.stopPropagation();
        const next = toggleFavoriteSkillId(behaviorId);
        setOn(next.includes(behaviorId));
        window.dispatchEvent(new Event("classnest-favorites-changed"));
      }}
    >
      <Star className={cn("size-4", on && "fill-current")} />
    </button>
  );
}
