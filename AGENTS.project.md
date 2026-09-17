# ClassNest — standing teacher rules

Read **`docs/START-HERE.md` first** (current job, what not to redo).
Then this file. Direct chat instructions still win.

## Videos and generated art

- **Never delete, overwrite, or “clean up” Ultra videos** (intros, adventures,
  posters, shot stills) without asking first and getting a yes.
- Same for Ultra character stills (s1/s2/s3, board thumbs). If art is replaced,
  **archive the old file** under `public/avatars/archive/` — do not trash it.
- Do not strip audio from a video that already has it. Do not re-encode over
  the only copy. Copy first, then encode a new file.
- Catalog intros/adventures are **silent on purpose**. **Home films**
  (`public/avatars/ultra/homes/`) are the exception: they keep diegetic
  sound. Recipe + QA stills: `docs/ultra-home-films.md` and
  `docs/home-film-qa/NOTES.md`. Full legend stories for films:
  `docs/ultra-lore-bible.md`. **Next Home batch (do not shoot until `go`):**
  `docs/home-round-11-15.md` (ids 11–15). Do not generate or remake until the
  teacher says `go`. Do not redo 01–10 unless they name those ids. Do not
  delete current Home mp4s without a yes.

## Other standing rules

- Do not wipe classroom saves on update.
- Keep the +10 default skill. Do not delete teacher-edited skills.
- Version bump + git commit on each change. Tell the teacher the new
  version number in the reply. Rebuild portable / full / APK **only when
  asked**. Rebuild code-only zip each change.
- **Always push to GitHub after the commit** (`origin` =
  `sh4gu4dummy-arch/classnest`, branch `main`). Use `sh scripts/push-github.sh`.
  Auth is the connected GitHub account / `gh` — never paste a PAT in chat.
  Zip packs stay out of git (100 MB cap). Videos (`*.mp4` etc.) stay out of
  git; the teacher has a backup. Avatar stills stay in git. When the
  Offline APP is rebuilt, also `gh release create` (or upload onto the
  version tag) with the portable zip. Avatar media only on a release when
  that pack actually changed.
- **Never commit Grok Build / sandbox files to GitHub.** That includes
  `.grok/`, `startup.sh`, root `AGENTS.md`, `attachments/`, `server/`,
  `scripts/grok-pwa-*`. ClassNest product rules stay in `AGENTS.project.md`.
  `scripts/push-github.sh` refuses the push if those paths are tracked.
  The Android keystore **is** tracked (private hobby app; needed to sign
  the same APK).

- **Handoff habit:** When you change bot-facing docs or finish a batch, give
  the teacher a **copy-paste message for the next bot** (where to start,
  current job, what not to do). Keep that blurb in sync with
  `docs/START-HERE.md` (section “Paste this to the next bot”).

- Remind about a git commit if it has been a while — but current rule is
  commit each change.
- Sounds on by default; no first-run sound pop-up.
- Smartboard mode is the default.
- **“lmk” (let me know) = talk only.** If the teacher says `lmk`, answer in
  chat with info / options / sizes. Do **not** edit files, rebuild packs,
  delete anything, or push. A later “do it” / “go ahead” is required.

## Process (do not turn bugs into a patch list)

This file is **product** rules plus **one class of engineering invariant**.
It is not an incident log.

**Do not append** “never use `bg-ink`”, “mount on `#cn-overlay-root`”,
“`REEL_WINDOW_H` must be 208”, “toast at `bottom-center`”. Those are
patches from a single miss. If you catch yourself writing a selector,
token, or constant into this file, stop — write the invariant instead.

When the same *kind* of failure happens twice (clipped art, half-screen
panel, name only in a toast, overlay trapped in a parent), **fix the
mechanism**, not the last CSS line. Then leave the invariant below as-is.

### Visibility (the actual underlying issue)

ClassNest is used on a board, at a distance, in a Grok preview iframe,
and as an Offline APP. Anything that takes over the screen — evolution,
random pick, catalog, video, dialog — must work in all of those.

1. **The layer is the window.** Not a leftover parent, not half the
   board, not “fixed” that is actually a column. Theme tokens for
   *text* are not a scrim.
2. **The subject is whole.** Face, art, and name are fully visible.
   Clipping is a bug. If a box uses overflow hidden, it is larger than
   what it contains. Prefer contain over cover for character art.
3. **The outcome is on the surface.** After pick / evolve / award, the
   teacher can read **who and what** on the overlay or board itself,
   long enough to say the name out loud. A toast is never the only
   announcement. Toasts are easy to miss (banner, overlay stacking,
   3-second fade).

**Done** means you treated this as the acceptance test, not “the code
path runs.” Screenshot or say you could not. Do not claim a visibility
fix from grep or a constant check alone.
