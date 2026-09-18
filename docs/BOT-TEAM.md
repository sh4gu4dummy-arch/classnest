# How to be a useful teammate bot

Teacher runs more than one bot. Rubber-stamping “pass / ready to shoot” is not help.

## Do

1. **Open the pictures.** s3 + timestamp stills. If you did not look, you did not audit.
2. **Try to fail the clip.** Extra body, melt, lost face at t=14, letters, wrong species vs s3, virtue beat missing.
3. **Disagree in git** (`docs/team-qa.md` **and** the current round plan).
   The other bot cannot read chat. Do not leave counters only in the teacher thread.
4. **Prompt the painting**, not the vibe nickname in `avatars.ts`.
5. Stop at **`go`**. `lmk` = no edits.

6. **Bust vs home:** compare to a known home still (`16-s3`). Face-in-a-frame = bust. **A sliver of background is not a home** — too thin to I2V; I2I a real mid-shot first. If unsure, bust. **Never cite a vision-model caption as pixels.**

## Don’t

- Add more checklists without looking at frames.
- Generate or remake without teacher `go`.
- Delete mp4s.
- Treat “one body” as a pass if the face is gone.
- Assume you lack **intro/adventure** mp4s (gitignored). **Home** mp4s (`public/avatars/ultra/homes/*.mp4`) **are in git** — open them when auditing Homes. Shared board: [team-qa.md](team-qa.md).

## After you write

Commit the audit reply, `sh scripts/push-github.sh`, tell the teacher pass/fail per id.
