import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import { APP_VERSION_LABEL } from "@/lib/app-version";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  authClient,
  authEnabled,
  GROK_PROVIDERS,
  getBearerToken,
  signIn,
} from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [oauthBusy, setOauthBusy] = useState<string | null>(null);

  /**
   * After email auth, refresh the client session. Bearer is captured in
   * `authClient` onSuccess from the `set-auth-token` header (preview iframe
   * can't rely on cookies). If neither cookie-backed session nor bearer
   * appears, fall back to offline mode messaging.
   */
  async function finishEmailAuth(): Promise<boolean> {
    try {
      const { data } = await authClient.getSession();
      if (data?.session || data?.user) return true;
    } catch {
      /* fall through */
    }
    if (getBearerToken()) return true;
    toast.message("Could not keep a session in this preview", {
      description:
        "Classroom data still works offline without an account. Use Google/X (pop-up) or continue without signing in.",
    });
    return false;
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setBusy(true);
    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: "/",
      });
      if (error) {
        toast.error(error.message || "Could not sign in");
        return;
      }
      const ok = await finishEmailAuth();
      if (!ok) return;
      toast.success("Signed in");
      void navigate({ to: "/" });
    } catch {
      toast.error("Could not sign in");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password || password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setBusy(true);
    try {
      const { error } = await authClient.signUp.email({
        email: email.trim(),
        password,
        name: name.trim() || email.trim().split("@")[0] || "Teacher",
        callbackURL: "/",
      });
      if (error) {
        toast.error(error.message || "Could not create account");
        return;
      }
      const ok = await finishEmailAuth();
      if (!ok) return;
      toast.success("Account created");
      void navigate({ to: "/" });
    } catch {
      toast.error("Could not create account");
    } finally {
      setBusy(false);
    }
  }

  async function handleOAuth(providerId: string) {
    setOauthBusy(providerId);
    try {
      await signIn(providerId, { callbackURL: "/" });
      void navigate({ to: "/" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign-in failed";
      toast.error(msg);
    } finally {
      setOauthBusy(null);
    }
  }

  return (
    <main className="relative grid min-h-[calc(100dvh-var(--grok-banner-h,0px))] place-items-center bg-bg px-4 py-10">
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-muted-fg">
          {APP_VERSION_LABEL}
        </span>
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-sm border-2 border-accent/20">
        <CardHeader className="items-center text-center">
          <span className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-fg">
            <GraduationCap className="size-6" />
          </span>
          <CardTitle>ClassNest account</CardTitle>
          <CardDescription>
            Optional. Classroom data already saves offline on this device — you can skip
            sign-in and start teaching.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full" size="lg">
            <Link to="/">Continue without account</Link>
          </Button>
          <p className="text-center text-[11px] leading-snug text-muted-fg">
            Recommended in the live preview. Points, avatars, and classes stay on this
            device either way.
          </p>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-fg">
              or sign in
            </span>
            <Separator className="flex-1" />
          </div>

          {!authEnabled ? (
            <p className="text-center text-sm text-muted-fg">Sign-in is disabled.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                {GROK_PROVIDERS.map((p) => (
                  <Button
                    key={p.providerId}
                    type="button"
                    variant="outline"
                    disabled={Boolean(oauthBusy)}
                    onClick={() => void handleOAuth(p.providerId)}
                  >
                    {oauthBusy === p.providerId ? "…" : p.label}
                  </Button>
                ))}
              </div>
              <p className="text-center text-[11px] text-muted-fg">
                Google / X open a short pop-up (works when cookies are blocked in the
                preview).
              </p>

              <Tabs
                value={mode}
                onValueChange={(v) => setMode(v as "signin" | "signup")}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Email sign in</TabsTrigger>
                  <TabsTrigger value="signup">Create account</TabsTrigger>
                </TabsList>
                <TabsContent value="signin" className="mt-4">
                  <form onSubmit={handleSignIn} className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@school.edu"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" variant="secondary" className="w-full" disabled={busy}>
                      {busy ? "Signing in…" : "Sign in with email"}
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="signup" className="mt-4">
                  <form onSubmit={handleSignUp} className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-name">Name</Label>
                      <Input
                        id="signup-name"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ms. Rivera"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@school.edu"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        minLength={8}
                        required
                      />
                    </div>
                    <Button type="submit" variant="secondary" className="w-full" disabled={busy}>
                      {busy ? "Creating…" : "Create account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
