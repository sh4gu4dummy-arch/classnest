import { useCallback, useEffect, useState } from "react";
import {
  cycleSoundPack,
  getSoundPack,
  isSoundEnabled,
  setSoundEnabled,
  setSoundPack,
  unlockAudio,
  type SoundPack,
} from "@/lib/sounds";

export function useSoundEnabled() {
  const [enabled, setEnabled] = useState(true);
  const [pack, setPack] = useState<SoundPack>("full");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEnabled(isSoundEnabled());
    setPack(getSoundPack());
    setReady(true);
    const onChange = () => {
      setEnabled(isSoundEnabled());
      setPack(getSoundPack());
    };
    window.addEventListener("classnest-sounds-changed", onChange);
    return () => window.removeEventListener("classnest-sounds-changed", onChange);
  }, []);

  const toggle = useCallback(() => {
    unlockAudio();
    const next = cycleSoundPack();
    setPack(next);
    setEnabled(next !== "off");
    return next;
  }, []);

  const setOn = useCallback((on: boolean) => {
    unlockAudio();
    setSoundEnabled(on);
    setEnabled(on);
    setPack(on ? "full" : "off");
  }, []);

  const setPackMode = useCallback((p: SoundPack) => {
    unlockAudio();
    setSoundPack(p);
    setPack(p);
    setEnabled(p !== "off");
  }, []);

  return { enabled, pack, ready, toggle, setOn, setPackMode };
}
