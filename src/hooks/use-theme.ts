import { useCallback, useEffect, useState } from "react";
import {
  applyTheme,
  getStoredTheme,
  resolveTheme,
  setTheme as persistTheme,
  toggleTheme as flipTheme,
  type Theme,
} from "@/lib/theme";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const resolved = resolveTheme(getStoredTheme());
    setThemeState(resolved);
    applyTheme(resolved);
    setReady(true);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    persistTheme(next);
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => flipTheme(current));
  }, []);

  return { theme, setTheme, toggleTheme, ready };
}
