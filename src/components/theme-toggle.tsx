import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggleTheme, ready } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={
        theme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      onClick={toggleTheme}
      disabled={!ready}
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
