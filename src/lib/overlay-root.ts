/** Viewport-fixed mount for celebrations / theater. Not body: Radix dialogs
 *  and backdrop-filter on header turn `position:fixed` into a half-panel. */
const ID = "cn-overlay-root";

export function getOverlayRoot(): HTMLElement {
  let el = document.getElementById(ID);
  if (!el) {
    el = document.createElement("div");
    el.id = ID;
    document.documentElement.appendChild(el);
  }
  return el;
}
