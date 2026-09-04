import {
  NEEDS_ICON_KEYS,
  POSITIVE_ICON_KEYS,
  getSkillIcon,
} from "@/lib/skill-icons";
import type { BehaviorKind } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SkillIconPicker({
  value,
  kind,
  onChange,
}: {
  value: string;
  kind: BehaviorKind;
  onChange: (icon: string) => void;
}) {
  const keys = kind === "needs_work" ? NEEDS_ICON_KEYS : POSITIVE_ICON_KEYS;
  return (
    <div className="flex flex-wrap gap-1.5">
      {keys.map((key) => {
        const Icon = getSkillIcon(key);
        const on = value === key;
        return (
          <button
            key={key}
            type="button"
            title={key}
            aria-label={key}
            aria-pressed={on}
            onClick={() => onChange(key)}
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-xl border-2 transition",
              on
                ? "border-accent bg-accent/15 text-fg"
                : "border-border bg-surface text-muted-fg hover:border-border-strong hover:text-fg",
            )}
          >
            <Icon className="size-5" />
          </button>
        );
      })}
    </div>
  );
}
