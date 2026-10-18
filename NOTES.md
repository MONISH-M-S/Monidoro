# Monidoro — working notes and handoff

> **Picking this up in a fresh session?** Read this file, then skim
> `monidoro.html`, then run `git log --oneline`. Then just say
> *"continue with feature 7"* and you are fully caught up. Nothing is lost.

A single-file pomodoro timer. `monidoro.html` is the entire app — no build step,
no dependencies, no network. Designed to be opened by double-click from
`file://` and to work offline.

## Running it

- Double-click `monidoro.html`, **or**
- `python -m http.server 8777 --bind 127.0.0.1`, then open
  <http://127.0.0.1:8777/monidoro.html>

Testing with the local server is easier to automate, but `file://` is the real
target and must keep working.

The file was called `monodoro.html` until the app was renamed. If a browser
stored its data against the old *file path* rather than against `file://` as a
whole, opening the renamed file starts with an empty history — recover with the
backup export/import. Whether `file://` storage is scoped per-file cannot be
observed from automation, so it is untested; the old filename is still in git
history if a copy is ever needed.

## What exists today

All of the following is implemented, exercised in a real browser, committed,
and pushed.

- 25/5 timer, progress ring, drift-free countdown
- Long break every Nth focus session, with cycle dots
- Skip break (cannot earn a session)
- Presets: Classic 25/5, Deep 50/10, Ultradian 90/20
- Custom focus / break / long-break lengths, sessions per set, daily goal
- Daily goal progress bar (minutes) and current / best streaks
- Four synthesised alert sounds via Web Audio — no audio files
- Optional profile name, shown as a greeting
- Per-day history, month heatmap with prev/next navigation
- Backup export to JSON, import with full re-validation, erase history
- Theme: system / light / dark, plus an accent colour picker
- Tags per session: chip row on the main screen, editable in Customize, with a
  per-tag breakdown of every day and a tag filter in the history heatmap
- Focus noise: rain / brown / cafe, synthesised from two noise buffers and
  filtered, with a volume slider. Plays only while a focus session runs

## Storage keys (localStorage)

The app was originally called **Monodoro**; it is now **Monidoro**. The keys
were renamed with it, but the old names are still *read* so the rename did not
erase anyone's history.

| Key | Shape |
|---|---|
| `monidoro.settings` | `{focusSec, breakSec, longBreakSec, cycles, goalMinutes, theme, accent, sound, ambient, ambientVolume, name, tags, activeTag}` |
| `monidoro.completed` | total focus sessions ever, as a string number |
| `monidoro.days` | `{"YYYY-MM-DD": {sessions, seconds, byTag?}}` |

`settings.tags` is `[{id, name, color}]` — `id` is a lowercase slug built
internally and never derived from the name, so renaming a tag cannot orphan the
history filed under it. `byTag` is `{tagId: {sessions, seconds}}` and is
**omitted entirely** when empty, so days recorded before tags existed keep the
shape they already had. There is no migration pass and reading old history never
rewrites it.

Three tagging rules worth keeping:

- A session is filed under the tag selected when it **started** (`sessionTag`),
  not when it finished, so switching chips mid-session cannot rewrite where the
  session belongs.
- Untagged sessions count towards the day total but sit in **no** `byTag`
  bucket. A heatmap filtered to a tag therefore shows older, untagged days as
  empty — honest rather than wrong.
- Removing a tag never touches recorded time and never rewrites history. It only
  drops the breakdown, which is why removal warns only when there is a breakdown
  to lose, and why a tag id is generated internally and never reused.

Older layouts still readable, never written again:

| Legacy key | Why it exists |
|---|---|
| `monodoro.settings` / `.completed` / `.days` | pre-rename names, read via `readStored()` |
| `monodoro.sound` | the sound choice used to live in a key of its own |

The old keys are left in place rather than deleted — silently destroying user
data during an upgrade is worse than leaving stale keys behind. `readStored()`
prefers the new key and falls back to the old one, and values migrate forward
on their own because the next save writes the new key. **An old backup file
(`app: "monodoro"`) still imports**, because `applyBackup()` deliberately does
not validate the `app` field.

Two rules that must not be broken:

1. **Everything is stored in seconds**, never minutes, even though the UI takes
   minutes.
2. **Day keys are LOCAL dates**, built by `dateKey()`. Never `toISOString()`,
   which is UTC and files a late-evening session under tomorrow for anyone east
   of Greenwich.

## Remaining work

### 7. Swan Lake alert sound

Requested, researched, not yet written. It is a fifth entry in `SOUNDS`, added
to `SOUND_KEYS` and to the `data-sound` button row — the sound picker already
handles rendering and preview, so the work is confined to one function.

Tchaikovsky, *Swan Lake* Op. 20, Act II No. 10 (1876) — **public domain**, and
synthesised like the others, so no asset file. The theme is in B minor (two
sharps: F♯ and C♯). Bars 2-3, the recognisable opening:

```
F♯5 | B4 C♯5 D5 E5 | F♯5 D5 F♯5 D5
```

Frequencies for `tone()`: B4 493.88, C♯5 554.37, D5 587.33, E5 659.25,
F♯5 739.99. A triangle wave with the existing envelope reads as a music box and
suits the app. Plan was to hold the opening F♯ and the final D, and keep the
whole thing under about 3.5 seconds so it stays an alert rather than a song.
The second phrase (`C♯ D E F♯ G | A G F♯ G A | B A G A B`) continues it if a
longer version is ever wanted.

### 8. Keyboard shortcuts + notification

- `Space` = start / pause, `R` = reset.
- A desktop notification when time is up.
- **Test the Notification API on `file://` before promising it works.** A file
  page has an opaque origin and the permission prompt may not appear at all.
  It is expected to work fine on GitHub Pages, if that ever happens.
- Note the existing `keydown` listener that closes the calendar on `Escape`;
  shortcuts must not fire while a text field has focus, or typing a name would
  start and stop the timer.

### 9. Confetti + tree

A CSS-only celebration on completion, and a Forest-style tree that grows while
focusing and dies if you bail early.

## Gotchas that cost real time — read before editing

1. **Never add a CSS transition to a property whose value comes from a custom
   property** (`background: var(--bg)`, `stroke: var(--accent)`, ...). Chromium
   freezes such a transition at the old value permanently. This silently stopped
   the timer ring from ever turning blue on a break — from the first version
   until commit `da1fc64`. `button { transition: transform }` and
   `.bar i { transition: width }` are fine; those values are not custom
   properties.

2. **Wire event listeners immediately next to the functions they call.**
   A full-file rewrite once dropped `el.go` / `el.reset` and silently killed
   both buttons (fixed in `054650b`). Prefer targeted edits over rewriting the
   whole file — rewriting a 900-line file to change 20 lines is how that
   happened.

3. **Cache-bust when testing through the local server.** Chrome will happily
   serve a stale copy: append `?cb=<anything>` to the URL. A test that appears
   to fail for no reason is often a cached file.

4. **Validate everything, twice.** `sanitizeSettings()` and `sanitizeDays()` are
   used for *both* localStorage *and* imported backup files, because a file the
   user picked off disk is no more trustworthy than stored data. The importer
   has been tested against `null`, arrays, junk keys like `../../evil`, negative
   and non-numeric values, and `__proto__` prototype pollution.

5. **Never reuse a storage key with a changed meaning.** The daily goal moved
   from sessions to minutes; it got a new key (`goalMinutes`) rather than being
   reinterpreted, because the stored `goal: 4` would otherwise have become
   "4 minutes".

6. **Do not hand-roll date arithmetic.** Streak calculation walks one day at a
   time through `Date` via `shiftDay()`, so month ends, year ends and leap days
   are handled for free. Tested against Feb 29 2028 and Feb 28 → Mar 1 2027.

7. **User text and markup.** `renderCalendar()` builds the grid with
   `innerHTML`, and since tags exist it now interpolates a tag name into the day
   tooltip, escaped with `escapeHtml()`. Anything else added there must be a
   number or escaped. The tag chips take the opposite approach deliberately:
   `createElement` plus `textContent`, never markup, because a tag name is user
   text. Verified with the name `" ><img src=x>`, which renders as plain text
   and injects nothing.

8. **A rename must never drop data.** Renaming the app meant renaming the
   storage keys, which would have looked to every existing user like a total
   wipe. `readStored()` reads the new key first and falls back to the old one,
   so nothing is lost and everything migrates forward on the next save. Any
   future rename of a key must repeat this, and the old key must be *read*, not
   deleted.

9. **Audio can be measured, so measure it.** Every noise and tone is verified by
   building the real graph on an `OfflineAudioContext`, rendering it, and
   checking RMS, peak and zero-crossing rate. That is how two silent bugs were
   caught: Cafe was 4x quieter than Brown (a narrow band-pass discards far more
   energy than a wide low-pass), and a `DynamicsCompressorNode` set to a -3 dB
   threshold was squashing the *whole* signal to about 40% of its intended level
   rather than catching peaks, because noise is dense enough to keep a
   compressor engaged continuously. It now sits at -1 dB and reports 0.00 dB of
   reduction, which is what a safety net should look like.

## How features were verified

Every feature was driven in a real browser: click real elements, read back real
state, assert on exact values, and check the console for errors. Toggles like
the cycle state machine were walked transition by transition, and the importer
was attacked with deliberately hostile files. When a result looked wrong, the
cause was found rather than the test relaxed — that is how the broken ring
colour and the missing button listeners were both caught.

Keep that bar. It has already paid for itself twice.
