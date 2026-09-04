import { getSkillIcon } from "@/lib/skill-icons";
import { cn } from "@/lib/utils";

export function SkillIcon({
  icon,
  className,
}: {
  icon?: string;
  className?: string;
}) {
  const Icon = getSkillIcon(icon);
  return <Icon className={cn("size-4 shrink-0", className)} />;
}
