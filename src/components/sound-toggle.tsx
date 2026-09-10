import { Volume1, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSoundEnabled } from "@/hooks/use-sound-enabled";
import { playSound, unlockAudio } from "@/lib/sounds";

export function SoundToggle() {
  const { pack, ready, toggle } = useSoundEnabled();

  const label =
    pack === "off"
      ? "Sounds off — tap for light"
      : pack === "light"
        ? "Light sounds — tap for full"
        : "Full sounds — tap to mute";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      title={label}
      onClick={() => {
        unlockAudio();
        const next = toggle();
        if (next !== "off") {
          window.setTimeout(() => playSound("ui"), 30);
        }
      }}
      disabled={!ready}
    >
      {pack === "off" ? (
        <VolumeX className="size-4" />
      ) : pack === "light" ? (
        <Volume1 className="size-4" />
      ) : (
        <Volume2 className="size-4" />
      )}
    </Button>
  );
}
