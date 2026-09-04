# How to get Imagine videos into the app

A working playbook from ClassNest (70+ native `.mp4` files in the product).
Copy this file to any project that says “Imagine plays in chat but never writes a file.”

---

## The one-sentence rule

Imagine **does** write an `.mp4` on disk. It always lands at:

```text
/workspace/artifacts/imagine_videos/<uuid>.mp4
```

You then **copy that exact path** into your app (`public/…`).  
If you never get a path, the save locker is broken — not your app folder, not a missing API key.

---

## What is actually happening

There are **two different videos**:

| Where | What it is | Can the app use it? |
| --- | --- | --- |
| The clip that plays **in chat** | A CDN / thread preview | **No.** There is no download URL in this sandbox. |
| The file under **`/workspace/artifacts/imagine_videos/`** | The real `.mp4` on the machine | **Yes.** `cp` it into `public/`. |

The generate step can succeed (chat plays) while the **save-to-locker** step fails. That is why people say “it rendered, then the save folder stayed empty.”

`/workspace/artifacts` is a **live FUSE mount** (`grok-files`), not a normal disk folder.

```text
findmnt /workspace/artifacts
# TARGET               SOURCE     FSTYPE OPTIONS
# /workspace/artifacts grok-files fuse   rw,nosuid,nodev,...
```

FUSE directories **always report `size 0`** even when they are full of files. `stat` / `du` on the folder will lie. Use `ls` or `test -r` on the uuid path.

ClassNest still had **140** readable `.mp4`s in that “empty” (`size 0`) folder.

---

## The trap (this is what other projects are doing)

They see permission-denied or `size 0`, decide the locker is dead, and “fix” it:

```bash
# DO NOT DO THIS
umount -l /workspace/artifacts
rm -rf /workspace/artifacts
mkdir -p /workspace/artifacts/imagine_videos
```

What happens next:

1. Chat still plays the clip (CDN).
2. Imagine still tries to save into the **FUSE locker**.
3. The locker is gone, so the tool returns **“generated, no file path.”**
4. The new empty `mkdir` folder stays empty. Expected.
5. There is no second API (`video.url`) in this sandbox, and often no `XAI_API_KEY` either.

You did not fix Imagine. You deleted the only place it can write.

**If the locker is actually dead:** remount the **same FUSE locker**. Do not replace it with a fake disk folder.

---

## Working recipe (do this in order)

### 1. Leave the locker alone. Probe it.

```bash
mkdir -p /workspace/artifacts/imagine_videos /workspace/artifacts/imagine_images
echo ok > /workspace/artifacts/imagine_videos/_write_test.txt
cat /workspace/artifacts/imagine_videos/_write_test.txt
# must print: ok
```

If that write fails, remount the **FUSE** backend. Do not `rm -rf` + `mkdir` a normal directory.

### 2. Generate with the Imagine **tools**, not “chat Imagine”

Use these tools (names matter):

- `imagine_text_to_video` — no still. 6 / 10 / 15 seconds.
- `imagine_image_to_video` — animate one still. 6 / 10 / 15 seconds. **Best for character consistency.**
- `imagine_reference_to_video` — 1+ stills as references, new scene. 6 / 10 seconds only.

Reliable settings we used in production:

- `resolution_name`: `"480p"` (smaller, more likely to save)
- `duration`: `"10"` (or `"6"` for more cuts)
- Keep the subject **mostly still**; move the camera / weather / light
- Prompt: `No talking, no text, no humans.` (or no faces)

Stills first, then motion:

1. `imagine_image_to_image` (or text-to-image) → 16:9 still  
   Saved at `/workspace/artifacts/imagine_images/<uuid>.jpg`
2. `imagine_image_to_video` on **that still path** → clip  
   Saved at `/workspace/artifacts/imagine_videos/<uuid>.mp4`

### 3. Read the tool result. You need a path.

Success looks like:

```text
Video saved to: /workspace/artifacts/imagine_videos/3ceac258-eee2-48ca-8ab5-db8ba61fcd3f.mp4
Video generated successfully. Duration: 10.0s.
```

**No path = no file you can use.** Do not search the repo. Do not invent a URL. Fix the locker and generate again.

Images work the same way:

```text
file_path: /workspace/artifacts/imagine_images/<uuid>.jpg
```

### 4. Copy immediately. Do not wait.

`artifacts` can vanish or remount across restarts. Copy the uuid path into the app **in the same turn**.

```bash
# example — one intro
cp /workspace/artifacts/imagine_videos/3ceac258-….mp4 \
   /workspace/public/avatars/ultra/intros/26.mp4

cp /workspace/artifacts/imagine_images/<poster-uuid>.jpg \
   /workspace/public/avatars/ultra/intros/26.jpg
```

Point the UI at the **public** path (`/avatars/ultra/intros/26.mp4`), never at `artifacts`.

### 5. Re-encode (optional but recommended)

Raw Imagine files are large. We crushed 10s 480p clips to ~0.2–1.2 MB:

```bash
ffmpeg -y -i /workspace/artifacts/imagine_videos/<uuid>.mp4 \
  -vf "scale=854:480:force_original_aspect_ratio=decrease,pad=854:480:(ow-iw)/2:(oh-ih)/2" \
  -c:v libx264 -preset veryfast -crf 28 -pix_fmt yuv420p -an \
  -movflags +faststart \
  /workspace/public/your-folder/name.mp4
```

### 6. Stitch a longer film (30s, etc.)

Imagine max is 15s per clip (10s for reference-to-video). For 30s, shoot **three 10s beats** from consistent stills, then concat.

All shots must be the **same** size / fps / codec before concat:

```bash
# encode each beat
for s in 1 2 3; do
  ffmpeg -y -i beat-$s.raw.mp4 \
    -vf "scale=854:480:force_original_aspect_ratio=decrease,pad=854:480:(ow-iw)/2:(oh-ih)/2,fps=24" \
    -c:v libx264 -preset veryfast -crf 28 -pix_fmt yuv420p -an \
    -movflags +faststart beat-$s.mp4
done

# concat list
cat > list.txt << EOF
file 'beat-1.mp4'
file 'beat-2.mp4'
file 'beat-3.mp4'
EOF

ffmpeg -y -f concat -safe 0 -i list.txt -c copy out-30s.mp4
```

ClassNest: 3 acts × 10s = **00:00:30.13** for every Ultra.

---

## Consistency (so shot 2 still looks like shot 1)

1. Make one hero still (`16:9`) from the character art (`imagine_image_to_image` on the s3 / final portrait).
2. Edit **that still** into beat 2, beat 3 (`imagine_image_to_image` again, “same character, next beat…”).
3. Animate each still with `imagine_image_to_video` (camera move, subject mostly still).
4. Do **not** text-to-video a new creature each shot — identity drifts.

Complex, busy frames warp. Prefer: still subject + moving weather / light / camera.

---

## What the UI should load

```html
<video controls playsInline preload="metadata" poster="/avatars/ultra/intros/26.jpg">
  <source src="/avatars/ultra/intros/26.mp4" type="video/mp4" />
</video>
```

- File lives under `public/` (or your static root).
- Use a **relative** URL so offline / portable builds still work.
- `playsInline` for iPad / smartboard.
- `preload="metadata"` so 35 videos don’t all download at once.

---

## Checks that tell you the truth

```bash
# locker still FUSE? good
findmnt /workspace/artifacts

# can WE write? good
echo ok > /workspace/artifacts/imagine_videos/_write_test.txt

# after a generate, the uuid from the tool result must exist
test -r /workspace/artifacts/imagine_videos/<uuid>.mp4 && echo READ_OK

# directory size is a lie
stat -c 'dir size=%s' /workspace/artifacts/imagine_videos
# often prints 0 even with hundreds of files

# count for real
ls /workspace/artifacts/imagine_videos/*.mp4 | wc -l
```

If `test -r` on the **tool’s path** fails, Imagine did not save. Generate again after fixing the locker.  
If `test -r` works, `cp` it. You are done.

---

## There is no backup download API

In this sandbox:

- No `video.url` on the Imagine tool result (chat preview is not a download).
- Often **no `XAI_API_KEY`**, so you cannot call xAI’s video API yourself.
- Searching `artifacts` after “no file path” will not find a secret second copy.

The uuid path in the tool result **is** the file. Copy it.

---

## ClassNest numbers (proof it works)

| Asset | Count | Where the app serves them |
| --- | --- | --- |
| 10s home intros | 35 | `/public/avatars/ultra/intros/{id}.mp4` |
| 30s adventures (3×10s stitched) | 35 | `/public/avatars/ultra/adventures/{id}.mp4` |
| Posters | 70 | same folders, `{id}.jpg` |

Pipeline we actually ran:

1. `imagine_image_to_image` on each Ultra’s final portrait → 16:9 home / beat still.
2. `imagine_image_to_video` `480p` `duration: 10` on that still.
3. `cp` uuid → `public/avatars/ultra/…`
4. `ffmpeg` scale to 854×480, crf 28, no audio, `+faststart`.
5. Adventures: three beats, concat demuxer, `-c copy`.

Teacher catalog plays both under each legend: **Meet · 10s** and **Adventure · 30s**.

---

## Short message you can paste to another agent

> Imagine videos **do** write into the project. They land at
> `/workspace/artifacts/imagine_videos/<uuid>.mp4`.
>
> That folder is a **FUSE locker** (`grok-files`). Do **not** remount it as a
> normal `mkdir` folder. Chat can play the clip even when the locker save
> fails. If you replace the locker, the tool returns “generated, no file path”
> and your empty folder stays empty.
>
> Recipe: (1) write-test the existing FUSE path, (2) generate with
> `imagine_image_to_video` / `imagine_text_to_video` at 480p, (3) copy the
> **exact uuid path from the tool result** into `public/` in the same turn,
> (4) ignore `stat` size 0 on `artifacts`. There is no second download API
> and no `video.url` here. When a clip lands, copy it out immediately.

---

## Do / don’t

**Do**

- Keep `/workspace/artifacts` as FUSE.
- Use the Imagine **tools** (they return `file_path`).
- Copy the uuid path into `public/` the same turn.
- Prefer 480p, 6–10s, still subject + moving camera.
- Re-encode + concat yourself for length / size.

**Don’t**

- `umount` / `rm -rf` / `mkdir` a fake artifacts folder.
- Trust chat playback as “the file is in the project.”
- Wait for a `video.url` or an API key.
- Point the app at `/workspace/artifacts/…` (it will vanish).
- Believe `du` / `stat` on the artifacts directory.

That’s the whole method. The file is there when the tool prints a path. Copy it.
