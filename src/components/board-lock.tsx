import { useState } from "react";
import { Lock, LockOpen } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  checkPin,
  getTeacherPin,
  isBoardLocked,
  setBoardLocked,
  setTeacherPin,
} from "@/lib/prefs";

interface BoardLockProps {
  locked: boolean;
  onLockedChange: (locked: boolean) => void;
}

export function BoardLockButton({ locked, onLockedChange }: BoardLockProps) {
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pin2, setPin2] = useState("");
  const hasPin = !!getTeacherPin();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasPin) {
      if (pin.length < 4) {
        toast.error("PIN needs at least 4 digits");
        return;
      }
      if (pin !== pin2) {
        toast.error("PINs don’t match");
        return;
      }
      if (!setTeacherPin(pin)) {
        toast.error("Could not save PIN");
        return;
      }
      setBoardLocked(true);
      onLockedChange(true);
      toast.success("Board locked");
      setOpen(false);
      setPin("");
      setPin2("");
      return;
    }

    if (locked) {
      if (!checkPin(pin)) {
        toast.error("Wrong PIN");
        return;
      }
      setBoardLocked(false);
      onLockedChange(false);
      toast.success("Board unlocked");
      setOpen(false);
      setPin("");
      return;
    }

    // lock with existing pin confirm
    if (!checkPin(pin)) {
      toast.error("Wrong PIN");
      return;
    }
    setBoardLocked(true);
    onLockedChange(true);
    toast.success("Board locked");
    setOpen(false);
    setPin("");
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={locked ? "Unlock board" : "Lock board"}
        title={
          locked
            ? "Unlock teacher tools (PIN)"
            : "Lock board — hide Settings & sensitive tools (PIN)"
        }
        onClick={() => {
          setPin("");
          setPin2("");
          setOpen(true);
        }}
        data-chrome="teacher"
      >
        {locked ? <Lock className="size-4 text-amber-600" /> : <LockOpen className="size-4" />}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {!hasPin
                  ? "Set teacher PIN"
                  : locked
                    ? "Unlock board"
                    : "Lock board"}
              </DialogTitle>
              <DialogDescription>
                {!hasPin
                  ? "4–6 digit PIN hides Settings & sensitive actions from curious fingers."
                  : locked
                    ? "Enter your PIN to unlock teacher tools."
                    : "Confirm PIN to lock Settings and archive controls."}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-3">
              <div className="space-y-1">
                <Label htmlFor="pin">PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  autoFocus
                  placeholder="••••"
                />
              </div>
              {!hasPin && (
                <div className="space-y-1">
                  <Label htmlFor="pin2">Confirm PIN</Label>
                  <Input
                    id="pin2"
                    type="password"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={6}
                    value={pin2}
                    onChange={(e) => setPin2(e.target.value.replace(/\D/g, ""))}
                    placeholder="••••"
                  />
                </div>
              )}
            </div>
            <DialogFooter className="mt-5">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {!hasPin ? "Set & lock" : locked ? "Unlock" : "Lock"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function useBoardLockState() {
  const [locked, setLocked] = useState(() =>
    typeof window !== "undefined" ? isBoardLocked() : false,
  );
  return { locked, setLocked };
}
