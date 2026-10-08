import type { SyntheticEvent } from "react";
import { avatarFallbackSrcs, type AvatarDisplay, type AvatarPack } from "@/lib/avatars";
import { markScrubFramesMissing, scrubIdFromSrc } from "@/lib/ultra-scrub";

/**
 * One-shot <img> onError chain. Each candidate is tried at most once per
 * element; when the list runs out the image stays broken instead of
 * re-requesting the same missing file forever.
 */
export function imgFallback(
  candidates: (string | null | undefined)[],
): (e: SyntheticEvent<HTMLImageElement>) => void {
  const list = candidates.filter((s): s is string => !!s);
  return (e) => {
    const el = e.currentTarget;
    const failed = el.getAttribute("src");
    const scrubId = scrubIdFromSrc(failed);
    if (scrubId != null) markScrubFramesMissing(scrubId);
    let step = Number(el.dataset.fbStep ?? "0");
    while (step < list.length) {
      const next = list[step]!;
      step += 1;
      if (next !== failed) {
        el.dataset.fbStep = String(step);
        el.setAttribute("src", next);
        return;
      }
    }
    el.dataset.fbStep = String(list.length);
  };
}

/** onError for avatar art: classic stage art, then base art, then stop. */
export function avatarImgFallback(
  id: number | undefined | null,
  pack: AvatarPack,
  points: number,
  display: AvatarDisplay = "full",
) {
  return imgFallback(avatarFallbackSrcs(id, pack, points, display));
}
