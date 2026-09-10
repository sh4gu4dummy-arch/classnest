import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import { SoundToggle } from "@/components/sound-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { APP_VERSION_LABEL, IS_PORTABLE } from "@/lib/app-version";
import { cn } from "@/lib/utils";
import { BoardArenaLayer } from "@/components/board-arena";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  className?: string;
  /** Full-page still (class board arena). */
  backdropSrc?: string | null;
}

export function AppShell({
  children,
  title,
  subtitle,
  backTo,
  backLabel = "Back",
  actions,
  className,
  backdropSrc = null,
}: AppShellProps) {
  // Pause CSS infinite animations when tab/board app is hidden (Seewo multi-window)
  useEffect(() => {
    const sync = () => {
      document.documentElement.classList.toggle(
        "cn-paused",
        document.visibilityState === "hidden",
      );
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return (
    <div className="relative min-h-[calc(100dvh-var(--grok-banner-h,0px))] text-fg">
      <BoardArenaLayer src={backdropSrc} />
      <header
        className={cn(
          "sticky top-[var(--grok-banner-h,0px)] z-40 border-b border-border/80 shadow-md",
          backdropSrc
            ? "bg-surface/70 supports-[backdrop-filter]:bg-surface/55 supports-[backdrop-filter]:backdrop-blur-md"
            : "bg-surface/90 supports-[backdrop-filter]:bg-surface/80 supports-[backdrop-filter]:backdrop-blur-md",
        )}
      >
        <div
          aria-hidden
          className="h-1 w-full bg-gradient-to-r from-accent via-violet-500 to-orange-400"
        />
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-2 px-3 sm:h-14 sm:gap-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            {backTo ? (
              <Link
                to={backTo}
                className="shrink-0 text-sm font-semibold text-accent transition-colors hover:text-fg active:scale-95"
                data-hide-presentation
              >
                {backLabel}
              </Link>
            ) : (
              <Link to="/" className="flex shrink-0 items-center gap-2 active:scale-95">
                <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-accent via-violet-500 to-orange-400 text-accent-fg shadow-md sm:size-9">
                  <GraduationCap className="size-4" />
                </span>
                <span className="hidden font-bold tracking-tight sm:inline">
                  ClassNest
                </span>
              </Link>
            )}
            {(title || subtitle) && (
              <div className="min-w-0 border-l border-border pl-2 sm:border-l-2 sm:border-accent/20 sm:pl-3">
                {title && (
                  <h1 className="truncate text-sm font-bold leading-tight sm:text-base">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="truncate text-xs font-medium text-muted-fg">{subtitle}</p>
                )}
              </div>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <span
              className="mr-1 rounded-full border border-border px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-muted-fg"
              title="ClassNest version"
            >
              {APP_VERSION_LABEL}
            </span>
            {actions}
            <SoundToggle />
            <ThemeToggle />
            <AuthSlot />
          </div>
        </div>
      </header>
      <main
        className={cn(
          "relative z-10 mx-auto max-w-5xl px-3 py-4 sm:px-6 sm:py-6",
          className,
        )}
      >
        <MissingAvatarMediaBanner />
        {children}
      </main>
    </div>
  );
}

function MissingAvatarMediaBanner() {
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    if (!IS_PORTABLE) return;
    let gone = false;
    const img = new Image();
    img.onload = () => {
      if (!gone) setMissing(false);
    };
    img.onerror = () => {
      if (!gone) setMissing(true);
    };
    img.src = `/avatars/kids/01.jpg?probe=${Date.now()}`;
    return () => {
      gone = true;
    };
  }, []);
  if (!IS_PORTABLE || !missing) return null;
  return (
    <div className="mb-4 rounded-xl border-2 border-amber-400/50 bg-amber-400/15 px-3 py-2.5 text-sm font-semibold text-amber-950 dark:text-amber-100">
      Avatar pictures are missing. Unzip the Avatar media pack into the
      avatars folder (the one that says “copy avatar media files here”), then
      refresh.
    </div>
  );
}

function AuthSlot() {
  if (IS_PORTABLE) return null;
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="size-8 animate-pulse rounded-full bg-surface-2" />;
  }
  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        {user ? null : (
          <Link
            to="/login"
            className="hidden text-sm font-semibold text-accent hover:text-fg sm:inline"
            data-hide-presentation
          >
            Sign in
          </Link>
        )}
      </SignedOut>
    </>
  );
}
