/**
 * Student names are shown in FULL everywhere (v0.143). Long names wrap
 * (see `.cn-name` in styles.css) and the board card shrinks the font a step.
 */
export function nameLength(name: string | null | undefined): "long" | "xlong" | undefined {
  const n = (name ?? "").trim().length;
  if (n > 22) return "xlong";
  if (n > 14) return "long";
  return undefined;
}
