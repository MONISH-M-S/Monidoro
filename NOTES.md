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

## Storage keys (localStorage)

The app was originally called **Monodoro**; it is now **Monidoro**. The keys
were renamed with it, but the old names are still *read* so the rename did not
erase anyone's history.

| Key | Shape |
|---|---|
| `monidoro.settings` | `{focusSec, breakSec, longBreakSec, cycles, goalMinutes, theme, accent, sound, name}` |
| `monidoro.completed` | total focus sessions ever, as a string number |
| `monidoro.days` | `{"YYYY-MM-DD": {sessions, seconds}}` |

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

### 7. Tags per session (the data migration)

Agreed design, not yet built:

- `settings.tags`: `[{id, name, color}]`, defaults Study / Work / Life,
  manageable from the Customize panel.
- An active tag is chosen on the main screen as a chip row.
- `days[key]` gains `byTag: {tagId: {sessions, seconds}}`.
- **Old days without `byTag` must be treated as untagged, not rewritten on
  load.** Never migrate by writing on read.
- The heatmap gets a tag filter and/or a colour-by-tag mode.

This is the only change that alters the shape of saved data. Export/import was
built first specifically so a backup exists before this lands.

### 8. Ambient focus noise + volume

Rain / brown noise / cafe hum, synthesised through Web Audio so there are still
zero asset files. Volume slider. Start and stop with the focus session.

### 9. Keyboard shortcuts + notification

- `Space` = start / pause, `R` = reset.
- A desktop notification when time is up.
- **Test the Notification API on `file://` before promising it works.** A file
  page has an opaque origin and the permission prompt may not appear at all.
  It is expected to work fine on GitHub Pages, if that ever happens.

### 10. Confetti + tree

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

7. `renderCalendar()` builds the grid with `innerHTML`. That is safe *only*
   because every interpolated value is a number. Do not add user text to it.

8. **A rename must never drop data.** Renaming the app meant renaming the
   storage keys, which would have looked to every existing user like a total
   wipe. `readStored()` reads the new key first and falls back to the old one,
   so nothing is lost and everything migrates forward on the next save. Any
   future rename of a key must repeat this, and the old key must be *read*, not
   deleted.

## How features were verified

Every feature was driven in a real browser: click real elements, read back real
state, assert on exact values, and check the console for errors. Toggles like
the cycle state machine were walked transition by transition, and the importer
was attacked with deliberately hostile files. When a result looked wrong, the
cause was found rather than the test relaxed — that is how the broken ring
colour and the missing button listeners were both caught.

Keep that bar. It has already paid for itself twice.
