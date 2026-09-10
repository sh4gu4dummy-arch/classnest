# ClassNest — standing teacher rules

Read this before changing ClassNest. Direct chat instructions still win.

## Videos and generated art

- **Never delete, overwrite, or “clean up” Ultra videos** (intros, adventures,
  posters, shot stills) without asking first and getting a yes.
- Same for Ultra character stills (s1/s2/s3, board thumbs). If art is replaced,
  **archive the old file** under `public/avatars/archive/` — do not trash it.
- Do not strip audio from a video that already has it. Do not re-encode over
  the only copy. Copy first, then encode a new file.
- Catalog videos are currently **silent on purpose** (encoded with no audio
  track). Do not add voice/music until the teacher asks.

## Other standing rules

- Do not wipe classroom saves on update.
- Keep the +10 default skill. Do not delete teacher-edited skills.
- Version bump + git commit on each change. Tell the teacher the new
  version number in the reply. Rebuild portable / full / APK **only when
  asked**. Rebuild code-only zip each change.
- **Always push to GitHub after the commit** (`origin` =
  `sh4gu4dummy-arch/classnest`, branch `main`). Use `sh scripts/push-github.sh`.
  Auth is the connected GitHub account / `gh` — never paste a PAT in chat.
  Zip packs stay out of git (100 MB cap). When the Offline APP is rebuilt,
  also `gh release create` (or upload onto the version tag) with the portable
  zip. Avatar media only on a release when that pack actually changed.
- Remind about a git commit if it has been a while — but current rule is
  commit each change.
- Sounds on by default; no first-run sound pop-up.
- Smartboard mode is the default.
