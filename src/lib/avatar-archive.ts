/** Replaced Ultra art kept for history / teacher catalog. */

export type ArchiveItem = {
  id: string;
  avatarId: number;
  pack: "ultra" | "kids" | "teens";
  stage: number;
  version: string;
  note: string;
  src: string;
  label: string;
};

/**
 * Static fallback if /avatars/archive/manifest.json is missing.
 * Prefer loading the manifest at runtime in the catalog.
 */
export const ARCHIVED_AVATARS: ArchiveItem[] = [
  {
    id: "11-s3-v1-villain",
    avatarId: 11,
    pack: "ultra",
    stage: 3,
    version: "v1",
    note: "villain (retired)",
    src: "/avatars/archive/ultra/11-s3-v1-villain.jpg",
    label: "Quillburst · old legend",
  },
];

export async function loadArchiveManifest(): Promise<ArchiveItem[]> {
  try {
    const res = await fetch("/avatars/archive/manifest.json", {
      cache: "no-cache",
    });
    if (!res.ok) return ARCHIVED_AVATARS;
    const data = (await res.json()) as { items?: ArchiveItem[] };
    if (!data.items?.length) return ARCHIVED_AVATARS;
    // Prefer retired-only in catalog (skip duplicates of current active art)
    return data.items.filter(
      (i) => !i.note.includes("scribe legend") && i.version !== "v2",
    );
  } catch {
    return ARCHIVED_AVATARS;
  }
}
