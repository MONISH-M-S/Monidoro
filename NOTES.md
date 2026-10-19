# Monidoro — working notes and handoff

> **Picking this up in a fresh session?** Read this file, then skim
> `monidoro.html`, then run `git log --oneline`. Then just say *"continue"* and
> you are fully caught up. Nothing is lost.
>
> **The order for new work is the list under "Remaining work"**, and it is kept
> in the order it was agreed. Done: the contrast pass over the backdrops and the
> panels (14), the extra focus noises (15) and the history statistics (16).
>
> Next, and the owner has asked for **all of it**, one commit at a time and
> without asking again in between: the accent-and-tag palette fix (the only repair
> on the list, and it comes first), then the four task-list slices in the order
> they are written down — subtasks, reordering on touch, a due date or "today"
> list, a tag per task. The palette fix already has its analysis written up with
> it, down to the luminance bounds and candidate tones, so it can be started
> straight away. Nothing there is started — the tree is clean, and every feature
> described below was committed and pushed as it was finished.

A single-file pomodoro timer. `monidoro.html` is the entire app — no build step,
no dependencies, no network. Designed to be opened by double-click from
`file://` and to work offline.

## Running it

- Double-click `monidoro.html`, **or**
- `python -m http.server 8777 --bind 127.0.0.1`, then open
  <http://127.0.0.1:8777/monidoro.html>

Testing with the local server is easier to automate, but `file://` is the real
target and must keep working.

One file is no longer quite enough: **`swan-lake.ogg`**,
**`swan-lake-archive.ogg`** and **`lofi.ogg`** must sit next to `monidoro.html`
for the two Swan Lake focus noises and the lofi track to play the real
recordings. All three are strictly optional — with a file missing, that choice
falls back to the app's own synthesised melody, so a copy of the HTML on its own
still makes every sound it ever did.

Music of your own is read from beside the page rather than uploaded:
`focus-music-1.ogg`, then `focus-music-2.ogg` and on for a playlist (`.mp3`,
`.m4a` and `.wav` are accepted too). Nothing is needed for the app to work —
those names are looked for only when the choice is actually used, and with none
of them there it falls back to the synthesised melody as well.

The file was called `monodoro.html` until the app was renamed. If a browser
stored its data against the old *file path* rather than against `file://` as a
whole, opening the renamed file starts with an empty history — recover with the
backup export/import. The old filename is still in git history if a copy is ever
needed. What is now *known*, from reading the user's own `file://` tab instead of
guessing: storage works there, and it is its own bucket — the same browser held
seven sessions against `http://127.0.0.1:8777` and none against `file://`, so the
two never see each other's history. Whether `file://` is scoped per file or per
directory is still unverified, which is why the rename advice above stands. The
two recordings also load from disk with `readyState` 4 and their full durations
(150.0 s and 250.1 s); a shorter reading earlier came from the dev server's range
handling, not from the files.

## What exists today

All of the following is implemented, exercised in a real browser, committed,
and pushed.

- 25/5 timer, progress ring, drift-free countdown
- Long break every Nth focus session, with cycle dots
- Skip break (cannot earn a session)
- Presets: Classic 25/5, Deep 50/10, Ultradian 90/20
- Custom focus / break / long-break lengths, sessions per set, daily goal
- Daily goal progress bar (minutes) and current / best streaks
- Four synthesised alert sounds via Web Audio, with no files of their own
- Optional profile name, shown as a greeting
- Per-day history: a month heatmap with prev/next navigation, and under it eight
  weekly bars with the eight-week average drawn across them, the averages for the
  same window spelled out, and where the time went by tag — each tag with the
  eight weeks before this one as its comparison, because a total with nothing to
  compare it to is a number rather than a trend. The bars, the averages and the
  tag rows all follow the dialog's tag filter, so a filter that changed the grid
  but not the numbers under it can never happen. The window is fixed (the eight
  weeks ending with this one) and the month arrows do not move it, which is why
  the heading says which window it is rather than leaving you to work it out
- Backup export to JSON, import with full re-validation, erase history
- Theme: system / light / dark, plus an accent colour picker
- Background: five built-in backdrops (plain, dunes, aurora, grid, space) drawn
  as CSS gradients out of the theme's own colours, so one definition follows
  light/dark and the accent; plus a photo of the user's own. Forest and Stars
  were dropped after living with them: the green wash read as a smudge on the
  screen, and the tiled dot pattern read as graph paper rather than as a sky.
  Space replaced Stars and a stored `"stars"` maps forward to it.
  A picked image is shrunk to fit, kept in this browser only, and sits under a
  scrim whose strength is adjustable — but a scrim cannot promise contrast
  against a picture that happens to hold a patch the same tone as the words, so
  over a photo the text also carries a halo of the theme's own background (see
  14). Pure CSS and canvas means no files and nothing downloaded
- Tags per session: chip row on the main screen, editable in Customize, with a
  per-tag breakdown of every day and a tag filter in the history heatmap
- Focus sound: six synthesised noises — rain, brown and cafe, and then waves,
  wind and fire — built from two noise buffers and filters, plus three real
  recordings, all looped and all through one volume slider: `swan-lake.ogg`
  ("Swan Lake Vintage" — Barbirolli, 1933, the Scene alone, 2:30),
  `swan-lake-archive.ogg` ("Swan Lake European" — European Archive,
  the Scene and on into the rest of Act II, 4:10) and `lofi.ogg` ("Lofi" — a CC0
  instrumental, 3:35). All three files were levelled to the same loudness on
  disk, so switching between them does not call for a different slider position.
  With a file missing, that choice plays the app's own transcription of the
  Scene, taken from the engraving's MusicXML (215 notes, 182 s, looped), so the
  choice is never silent. Two of the noises are not a still texture: a layer's
  filter can be swept while it plays, which is the surf band in Waves and the
  whistle in Wind, both at a rate that deliberately does not divide into the
  swell's so the loop never lands back where it started. Fire throws off single
  crackles instead, scheduled one at a time with a random gap between them,
  because a loop of them would repeat its pattern of pops within a minute. All
  six are levelled to the same RMS by rendering each offline and computing the
  trim, so the slider position means the same thing whichever you pick. Plays
  only while a focus session runs
- Music of your own as a focus sound: files kept beside the page are shuffled
  when the session starts and played one after another, and a single file picked
  by hand plays for that visit. It is chosen from its own section in Customize
  rather than from the row of sounds, because two of that row's choices are
  already music and a chip labelled twice over was just confusing. Nothing is
  uploaded and nothing is stored: a browser cannot remember a file it was handed,
  so music that survives a reload is music with a name the app can look up again.
  The section's own button opens the picker when there is nothing to play, and
  with no file at all the choice falls back to the synthesised melody rather than
  to silence
- Customize opens as a drawer from the right (it outgrew an inline panel) and
  History as a centred dialog; both close on the backdrop, on Escape, and return
  focus to the button that opened them. The drawer scrolls internally, because
  the settings are taller than a short screen
- Keyboard: Space starts and pauses, R puts the session back to the beginning.
  Both are left alone while a text field has focus, and while a button has focus
  Space is left to that button — except Start and Reset, which mean the same
  thing — so Tab to a noise chip and Space still presses the chip
- The tab title carries the countdown and the kind of session it is ("12:34
  Focus - Monidoro"), because for anyone working in another tab the title is the
  only place the timer can be read. A finished session takes the title over too,
  but only in a hidden tab - that is where the title is the one place the news
  can land - blinking for 20 s and then staying put until the tab is returned to.
  Reduced motion gets the message without the blinking
- A desktop notification when a session ends ("Focus session complete" / "Break
  over"), asked for on the first start rather than at load. It is a bonus and
  never a promise: on `file://` the origin is opaque and the prompt may never
  appear, so every call is guarded and the alert sound is the real signal
- A plant grows inside the progress ring while a focus session runs: a stem
  first, then one leaf, the other, a bud, and the flower on the last stretch.
  Finishing leaves it in flower through the break - that flower *is* the reward
  for the finished session - and Reset part-way through wilts it, so the plant
  only ever stands for work that was done. Growth is read straight off the
  countdown and the whole curve is CSS: JavaScript sets one custom property
  (`--grow`) and nothing else
- Confetti falls for a finished focus session: DOM nodes animated by one CSS
  keyframe, and one timer takes them away. Nothing falls if the system asks for
  reduced motion, where the flower opening is the celebration on its own
- A task list, in a dialog of its own and in the app's own idiom rather than
  Notion's: type a name, press Enter, type the next. Each task is a checkbox, an
  editable name, an optional estimate of how many focus sessions it should take
  and a count of how many it has actually had, and the one you are *working on*
  is marked with a dot. A finished focus session is counted against that task,
  which is the whole reason the list is in a timer rather than in a notes app.
  The task you are working on is also shown under the timer, because a list you
  have to open is a list you stop looking at, and clicking that line opens the
  list. Rows are reordered by dragging, or with Alt and the arrow keys from the
  field you are already typing in. Finished tasks stay until they are cleared,
  which says how many it is about to take. Alt + arrows aside, every control is
  a button with a label, and the list is capped so a runaway import cannot fill
  the store
- Every text colour measured, in both themes, against the pixels actually
  painted behind it — main screen, drawer, both dialogs and the calendar's five
  heat levels — and everything it failed fixed at the colour, not argued away.
  The worst case in any preset is now 4.68:1 (dark dunes, the title) and 4.75:1
  in the light theme, where the floor is the Start button's own accent colour.
  What it changed: `--mut` is darker in the light theme and lighter in the dark
  one, `--warn` is darker in the light theme, the notice carries its warning on
  a tint of its own instead of in its words (2.5:1 over the backdrop before,
  12.5:1 after), the "test mode" badge uses the theme's own ink pair instead of
  white on gold (2:1 in the dark theme), each calendar heat step names the ink it
  can actually carry, and the current task's row is tinted 8% rather than 14%
  because its own accent and delete glyphs read 4.37:1 against the stronger tint.
  Over a photo, where no scrim can promise anything, each line carries a halo of
  the theme background instead: measured 5.11:1 or better for every line that
  has no background of its own, at every dimming step, over a pure white photo
  and a pure black one. The reference numbers are in the verification section

## Storage keys (localStorage)

The app was originally called **Monodoro**; it is now **Monidoro**. The keys
were renamed with it, but the old names are still *read* so the rename did not
erase anyone's history.

| Key | Shape |
|---|---|
| `monidoro.settings` | `{focusSec, breakSec, longBreakSec, cycles, goalMinutes, theme, accent, sound, ambient, ambientVolume, backdrop, backdropDim, name, tags, activeTag}` |
| `monidoro.completed` | total focus sessions ever, as a string number |
| `monidoro.days` | `{"YYYY-MM-DD": {sessions, seconds, byTag?}}` |
| `monidoro.tasks` | `{current, items: [{id, text, done, est, used}]}` |
| `monidoro.photo` | a `data:image/jpeg` URL for the chosen background photo |

`settings.tags` is `[{id, name, color}]` — `id` is a lowercase slug built
internally and never derived from the name, so renaming a tag cannot orphan the
history filed under it. `byTag` is `{tagId: {sessions, seconds}}` and is
**omitted entirely** when empty, so days recorded before tags existed keep the
shape they already had. There is no migration pass and reading old history never
rewrites it.

`settings.backdrop` is one of `plain | dunes | aurora | grid | space | photo`, and
`backdropDim` is the scrim strength over a photo (0-85). A stored `"stars"` is
mapped forward to `space` by `sanitizeSettings()` before the list is checked, the
way `swanLong` became `swanArchive` — see gotcha 8. The photo
itself lives in its own key rather than in `settings`, for two reasons: it is big
enough to make every backup file unwieldy, and it is tied to the browser it was
picked in. A backup therefore carries `backdrop: "photo"` but not the image, and
`sanitizeSettings()` turns that back into `plain` when there is no photo — a
restored backup shows a preset instead of an empty page.

`monidoro.tasks` keeps the list **and** the pointer to the task being worked on
in one record, so a pointer can never arrive without the list it points into.
`text` is capped at 200 characters, `est` and `used` at 99 and 9999, and the list
itself at 200 tasks; an id is a
lowercase slug built internally like a tag's, and `sanitizeTasks()` drops an
entry that cannot be read rather than guessing — including a duplicate id, since
every lookup is by id and a duplicate would leave one row unreachable and
undeletable. `current` is kept only when it lands on a task that is really there,
so a stored pointer cannot outlive its task.

Two rules for a to-do list that is not history:

- **A backup that predates tasks must not wipe the list.** An old file has no
  `tasks` key at all, and absent means "this backup was made before tasks
  existed", not "there were none" — so `applyBackup()` leaves the existing list
  alone when the key is missing and takes it at its word when it is present,
  empty list included. The status line only mentions tasks when the file actually
  carried any.
- **Erasing history does not erase tasks.** The erase button is about the record
  of time spent, which is the only thing that cannot be recreated; a task list
  can be typed again, and it is your work rather than the app's log.

Four tagging rules worth keeping:

- A session is filed under the tag selected when it **started** (`sessionTag`),
  not when it finished, so switching chips mid-session cannot rewrite where the
  session belongs.
- Untagged sessions count towards the day total but sit in **no** `byTag`
  bucket. A heatmap filtered to a tag therefore shows older, untagged days as
  empty — honest rather than wrong.
- Removing a tag never touches recorded time and never rewrites history. It only
  drops the breakdown, which is why removal warns only when there is a breakdown
  to lose, and why a tag id is generated internally and never reused.
- A *stored* tag list that is still exactly the old shipped defaults is treated
  as "never configured" and follows the new defaults; anything the user has
  changed is left alone. This is how the default third tag ("Life") was dropped
  without reaching into anyone's own list — the check is `isOldDefaultTags()`.

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

Nothing here is half-finished. Everything asked for so far is in and described
above: keyboard shortcuts with a completion notification (7), the plant with
confetti (8), backgrounds (9), the countdown in the tab title (10), music from
files of your own (11), the bundled lofi track (12), the task list (13), the
contrast pass (14), the extra focus noises (15) and the history statistics (16).

The notification question on `file://` is **answered**, and the answer is that it
does nothing there — see gotcha 23. Every call was already guarded, so it
degrades to the alert sound rather than to an error, and only a real origin would
ever prompt.

What is worth doing next, in the order it was raised:

- **The accent swatches and the tag colours are mid-tones, and a mid-tone cannot
  carry small text.** Found by the contrast pass and measured rather than
  guessed. The six accent chips (`#4a9d64`, `#3f80c4`, `#8a6fd1`, `#d08a3a`,
  `#d1629a`, `#3aa39a`) are painted behind a `--bg` label on the Start button,
  and in the light theme that reads 3.28:1, 3.65:1, 3.53:1, 2.52:1, 3.13:1 and
  2.71:1 respectively — #d08a3a, "Amber", is the worst, and it is also a tag
  colour, so the pressed tag chips and the fourth calendar heat step inherit the
  same failure. In the dark theme they pass too, though not as comfortably as
  first written down: Blue sits at 4.51:1 there, the tightest of the six, against
  5.24-6.53 for the rest. The shape is the fix: each swatch needs a
  light-theme tone and a dark-theme tone, the way the default accent already has
  one (`#3b7748` / `#6dbb7f`), or the label has to be chosen by measuring the
  colour it sits on. Both are the same idea — keep each accent out of the middle
  of the luminance range in the theme it is used in — and both are more than a
  colour tweak, which is why the pass left this alone and wrote it down instead.
  The calendar's third step has the same fault for those accents (4.01:1 with
  Amber in the dark theme) and will be fixed by the same change. The history
  statistics gave the same problem a second, more visible home: the History
  dialog's own tag filter paints a pressed chip in its tag's colour, and with
  Study pressed in the light theme that chip measures 3.65:1 *in situ* — the same
  number as the swatch, found again in a different part of the app, which is the
  argument for fixing the palette rather than the six places it shows up.
- **That repair, worked out, so it can be started rather than re-derived.** Both
  labels imply a luminance bound, because `--bg` is the label on every one of
  these surfaces: in the light theme an accent must have a luminance of at most
  0.157 for `--bg` on it to reach 4.5:1, and in the dark theme at least 0.204.
  The six swatches sit at 0.27, 0.20, 0.21, 0.34, 0.25 and 0.29 — all inside the
  band that fails in the light theme, and only just above the line in the dark
  one. (Computed label ratios: light 2.96, 3.65, 3.53, 2.52, 3.14, 2.70; dark
  5.57, 4.51, 4.67, 6.53, 5.24, 6.09 — the in-situ 3.65 for Blue matched the
  computed figure exactly, which is why these can be trusted for the rest.)
  Swapping the label to `--ink` instead is **not** enough, and that is worth
  recording because it is the cheap fix someone will reach for first: in the light
  theme the six then read 5.21, 4.22, 4.37, 6.11, 4.90 and 5.70, so Blue and
  Purple still fail and the colours themselves have to move.
  So: a pair per swatch, keyed by the hex that is already stored, which means
  **nothing in settings changes and no migration is needed** — the stored hex
  stays the swatch's identity and `applyTheme()` resolves it to the tone for the
  theme it is drawing. Keep each one's hue and move its lightness until it clears
  5:1 against that theme's own `--bg` (headroom over the 4.5 the app requires, the
  same bar the built-in pair sits on). Scaled evenly in RGB that gives light tones
  `#367349`, `#346aa2`, `#705aa9`, `#8c5d27`, `#9f4a75`, `#29726c`, and dark tones
  `#4388d0` and `#9073d9` for Blue and Purple, with Green, Amber, Pink and Teal
  already clear at 5.57-6.53:1 and so free to stay as they are.
  The same table resolves a *tag* colour, which is the point of doing it as a
  lookup: the two default tags are two of the six (Study `#3f80c4`, Work
  `#d08a3a`), so the pressed tag chips, the History dialog's filter chips and the
  calendar's filtered heat steps all get the right tone from the one place. The
  swatch buttons in Customize should preview the tone they will actually apply,
  in the theme they will apply it in.
  Two things not to forget when measuring the result. The contrast pass ran with
  `settings.accent = ""`, so nothing it measured was an *accent-coloured line*:
  with a swatch selected `--accent` is also used as text (`.hint[data-state="ok"]`,
  the task row's pick / done / count glyphs), and those have to be measured with
  each accent selected, not just with the default. And the calendar's third step
  must be re-measured with a tag filter active, because the filter is what puts a
  tag colour into `--cal-accent` in the first place.
- **The next slice of the task list**, in the order it is most likely to be
  wanted:
  - **Subtasks**, i.e. an indent level, which is the one Notion idea this
    deliberately left out. It changes the shape of the list (a tree, not a row
    of items) and every reorder and count has to decide what a parent's count
    means, so it is a feature of its own rather than a tweak.
  - **Reordering on a touch screen.** Drag and drop is a mouse gesture and Alt
    and the arrow keys need a keyboard, so on a phone the order is fixed. A
    press-and-hold drag, or an explicit move mode, is the answer.
  - **A due date or a "today" list.** The app has no notion of a day's plan yet.
    A task belongs to no day at all right now, which is what keeps the daily
    goal and the streaks about time rather than about chores.
  - **A tag per task**, so the history filter and the task you were on could be
    read together. Deliberately not in: the session's tag already comes from the
    chip row and two sources of the same label is how they drift apart.

Ideas raised along the way and deliberately not pursued, so nobody re-opens them
by accident:

- **Publishing to GitHub Pages.** The notification prompt would start appearing
  there, since it is a real origin rather than `file://`.
- **A record of dead plants.** Wilting leaves no trace anywhere: it is feedback
  for the moment, not a history of failure, and the day records stay about time
  spent.
- **Shipping the famous game lofi albums.** Asked for by name and checked, so
  nobody spends a happy hour on it again: the Pokémon lofi releases (Mikel's
  *Poké & Chill*, the *Poké Tape* series) are GameChops' and their own pages say
  `all rights reserved`, with the compositions licensed cover versions of
  Nintendo's music on top — nothing there can be redistributed from a public
  repository. The "your own music" slot is the answer instead: buy the album
  (much of it is name-your-price on Bandcamp, so the arranger gets paid), keep
  the files beside the page as `focus-music-1.ogg` and on, and the timer plays
  them without the app shipping anything.
- **A third Swan Lake transfer.** Checked and rejected (see the credits) — no
  modern freely licensed recording of the Scene exists to offer.
- **Bundled background photographs.** A real picture means another companion
  file, a licence to pick and a few hundred kilobytes in every copy, where the
  photo slot already takes any image the user owns and the CSS presets make the
  app look finished out of the box.
- **Longer noise buffers.** The four-second loop is in every synthesised noise
  and its periodicity is measurable (see the verification section), so lengthening
  the buffers to a minute or two would clearly be an improvement. It is not done
  here because it is a change to the three noises that were already shipped and
  accepted, not to the three new ones, and because a minute of stereo-free float
  per buffer is real memory for a noise nobody has complained about. Worth doing
  as its own small commit if anyone ever does hear it.

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
   to fail for no reason is often a cached file. It applies to the companion
   audio files too, and there it is worse than confusing: a `focus-music-1.ogg`
   that had already been deleted kept being *found* and reported as "Found 1
   track", because the successful probe was served from the cache. `file://`
   re-reads the disk and has no such problem, which is one more reason the
   server is only ever the testing harness.

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
   deleted. The same goes for a rename *inside* a value: when the archive chip
   was renamed, its key went from `swanLong` to `swanArchive` and
   `sanitizeSettings()` maps the old name forward, because an unmatched value
   falls back to the default (`off`) — indistinguishable from the setting
   erasing itself. Removing a choice is the same problem, which is why a stored
   `"stars"` still selects Space; a removal with no successor (`"forest"`) is
   allowed to fall back, but that has to be a decision rather than an oversight.

9. **Audio can be measured, so measure it.** Every noise and tone is verified by
   building the real graph on an `OfflineAudioContext`, rendering it, and
   checking RMS, peak and zero-crossing rate. That is how two silent bugs were
   caught: Cafe was 4x quieter than Brown (a narrow band-pass discards far more
   energy than a wide low-pass), and a `DynamicsCompressorNode` set to a -3 dB
   threshold was squashing the *whole* signal to about 40% of its intended level
   rather than catching peaks, because noise is dense enough to keep a
   compressor engaged continuously. It now sits at -1 dB and reports 0.00 dB of
   reduction, which is what a safety net should look like. The bundled recording
   is measured the same way — `decodeAudioData()` in the page gives its duration,
   RMS and a per-second envelope, which is how its level was checked and how the
   two-second harp intro (and so the preview length) was found. The three noises
   added later were levelled identically, with the spec quoted from the shipped
   file rather than retyped into the harness, and each rendered six times — the
   noise buffers are randomised per render, so one run says less than six. The
   method is self-checking: run against the three noises that were already
   trimmed, it recovered their trims to within a few percent (rain 1.89 against a
   stored 1.9, cafe 3.57 against 3.6), which says the harness is measuring what
   the app plays and not an idealised version of it. Fire's crackles are measured
   on their own, because a fifty-millisecond impulse is invisible in an average:
   one peaks at 0.19 - 0.29 at the top of the spread each crackle draws its level
   from - against the fire stack's 0.54, and even both peaks together stay under
   the limiter's 0.89.

10. **A melody is not a row of chimes.** The alert sounds decay across the whole
    note - a pluck. Right for a "ding", wrong for a tune: the Swan Lake theme
    first used that envelope and read as individual notes, each fading to silence
    before the next began. It now gives every note a fast attack, a *hold* for its
    written length, and a short release that runs past the note into the next one,
    which is what makes a phrase legato. Measured on an `OfflineAudioContext`: the
    opening held note keeps its level (RMS 0.207 early vs 0.207 late, where a
    pluck decays away) and the quietest 20 ms across a note join is 0.176, not
    silence. Pitch and rhythm come from the public-domain engraving's MusicXML
    (the whole Scene, bars 2-70), not the ear, so the data is MIDI numbers plus a
    beat count and can be re-checked against that score. The melody also needed
    its own level:
    sustained and legato it is far denser than a pluck, so it is trimmed to match
    the noises' RMS rather than their peak.

11. **In a piano reduction the top note is not the tune.** The Swan Lake source is
    a piano reduction - two hands on two staves - and the melody changes hands
    between passages. Bars 27-33 put the tune in the *left* hand under a
    right-hand tremolo, so "take the highest note" dutifully plays the
    accompaniment and drops the melody altogether. The reliable signal is the
    MusicXML `<voice>` element: the tune sits in one voice per passage, so pick
    the voice and read the top note *within* it. Two more traps in the same file:
    a tremolo is often written as long notes (so "the longest note is the melody"
    picks the wrong hand), and a moving figure writes the tune as a held note plus
    a lower neighbour, which has to be thinned back to the tune by hand. Bars that
    are pure texture - the intro, the chordal-tremolo bars - are better left out
    than faked, which is what the `SKIP` set in the generator does.

12. **A loop seam is usually a stop you did not need.** The melody is scheduled a
    whole statement at a time and re-armed by a timer just before the end.
    Re-arming also stopped whatever the previous statement still had scheduled.
    That was invisible while the notes ended exactly on the seam, but the next
    statement starts a little *after* the re-arm fires, so the stop left a ~60 ms
    hole at the loop point. The old notes are already timed to finish on the seam,
    so the fix is to let them end by themselves. Measured with
    `OfflineAudioContext.suspend()` - a plain offline render finishes too fast for
    a `setTimeout` re-arm to ever fire, so the suspend callback has to stand in for
    it - the quietest 20 ms at the seam went from 0.0000 to 0.0137 against a body
    level of 0.0944, i.e. the statements now overlap instead of gapping.

13. **A media element is not on the graph's volume curve.** The recording plays
    through a plain `<audio>` element rather than through the noise graph, because
    routing a media element into a graph taints it when the page is opened from
    `file://` — and a tainted source is *silence*, a failure that looks exactly
    like a broken file. That puts it on a different scale: the noises' curve tops
    out at 0.28 (a stack of noise layers adds up) while an element tops out at
    1.00. Matching the transfer's RMS to the noises left the default 40% at 0.19
    volume, about 14 dB below a normal track, and a band-limited 1933 mono
    transfer sounds fainter still at the same RMS — it was reported straight away
    as "the volume was low". The recording therefore gets
    `recordingVolume()`, where the slider *is* the element volume. Loudness is
    a judgement, so check it by ear and not only by RMS. The corollary is that a
    transfer *quieter* than the current one cannot be fixed in the app at all:
    volume stops at 1.00, so giving it extra gain would only buy dead travel at
    the top of the slider and still end up short. The archive recording measured
    10.7 dB below the HMV one once its peaks were equal, so it is levelled on
    disk instead — see gotcha 14 and the credits.

14. **Levelling a recording is where the quiet bugs live.** Three things cost
    time when preparing the archive transfer, all worth knowing before touching
    an audio file again. (a) `alimiter`'s `limit` is a linear amplitude
    (0.0625–1), but its `level` option — *auto level*, **on by default** —
    scales the output straight back up to undo the gain reduction. A ceiling
    that appears to do nothing is that option; pass `level=0`. (b) Lossy Vorbis
    puts back a peak slightly above whatever ceiling you asked for (~0.2-0.6 dB
    here), so leave headroom and verify the *decoded* file, not the filter's
    intent. (c) `ffmpeg -ac 1` downmixes dual-mono input by summing to √2, i.e.
    +3 dB, so measuring a stereo file's loudness and then downmixing it
    double-counts the level by 3 dB. There is no shortcut around measuring the
    finished file: loudness in LUFS, peak, and inter-sample peak, before and
    after. (d) A modern master can arrive *already clipping* — the lofi track
    measured a true peak of +0.1 dBTP — and then the whole job is to turn it
    down until it matches the loudness of what it will sit beside, which
    unclipped it for free. Matching loudness is the goal; matching peaks is not.

15. **Do not steal a key that already has an owner, and match the event you are
    actually given.** Space already means "press the focused button", so the
    shortcut defers to any focused button and lets the browser press it —
    otherwise Tab, Space on a noise chip would start a session instead of
    previewing rain. That has a visible corollary: Escape closes a drawer and
    puts focus back on the button that opened it, so the next Space reopens the
    drawer rather than starting. And the key has to be matched as `event.key`,
    not `event.code`: some keyboards, and most automation, send a space bar as
    `key: " "` with an empty `code`, so a `code`-only check is dead exactly where
    it is being tested. The browser tool's `press` also delivers the key to
    `<body>` rather than to `document.activeElement`, so "Space on the focused
    button" has to be tested by dispatching a `KeyboardEvent` on the element —
    through `press` the shortcut fires and the app looks broken when it is not.

16. **A browser API on `file://` is a bonus, not a promise.** The completion
    notification is guarded on every call (feature detection, permission check,
    `try`) because from an opaque origin like `file://` the API may be missing
    or the prompt may never appear. Permission can also only be asked for from a
    gesture, so it is requested when a session starts — and only once per visit,
    because a browser that stays at "default" was dismissed, and asking every
    session is nagging. The alert sound is the real signal; the notification is
    on top of it.

17. **Two ways a working feature can look broken, both of which happened to the
    plant.** (a) `.dial svg` — the rule that sizes and tips the progress ring —
    also matched the plant SVG added inside the dial much later, so the plant
    arrived 260px across and rotated onto its side. A descendant selector
    quietly claims anything of that type added afterwards; the plant now carries
    its own `.dial .plant` rule that outranks it. (b) Reading
    `getComputedStyle(node).transform` or `getBoundingClientRect()` immediately
    after setting the value returns the *previous* value, because a CSS
    `transition` has not started yet: a perfectly good growth curve measures as
    `matrix(0,0,0,0,0,0)` and looks dead. Suspend the transitions, or wait, and
    only then believe a measurement.

20. **Anything that owns the tab title has to say so.** `render()` repaints
    `document.title` on every tick, so a completion message written straight to
    the title lasted under a second and then vanished - a bug that never
    happened, from the user's side. The message now takes the title with a flag
    (`titleDone`) that the tick respects, and it hands the title back when the
    tab becomes visible again. Same shape as the plant's `--grow`: state that
    lives outside the render loop needs a way to outrank it.

18. **`hidden` loses to any author rule that sets `display`.** The photo-dimming
    slider stayed on screen with no photo to dim, because `.field{display:block}`
    outranks the browser's own `[hidden]{display:none}`. That is why `.drawer`,
    `.modal`, `.tags`, `.skip` and the rest each carry their own `[hidden]` rule;
    any new element type with a `display` of its own needs one too. The same
    family of trap is specificity: `.btn-row button` (0,1,1) beats a bare
    `.backdrop-tile` (0,1,0), so the tiles — like the accent swatches before
    them — are styled as `.btn-row …`, otherwise the selected tile paints itself
    the accent colour and hides the very backdrop it is choosing.

19. **A background photo has to be shrunk before it is stored.** `localStorage`
    holds roughly 5 MB for the whole origin and base64 adds a third to the bytes,
    so a phone photo fails on the first save. A picked image is drawn to a canvas
    at most 1920 px on its long edge and re-encoded as JPEG at 0.82, and anything
    still over about 1.9 M characters is refused with a message rather than
    dropped quietly. `store.set()` deliberately swallows a quota error, so the
    photo write is read back and checked; a setting is not worth that ceremony,
    but a user's picture is.

21. **A page cannot list a folder, so finding a file by name costs failed
    requests.** The user's music is looked for by asking for names —
    `focus-music-1.ogg`, `.mp3`, `.m4a`, `.wav`, then `focus-music-2.…` — and
    eight of those come back 404 when there is nothing there at all. So the scan
    runs only when the choice is used or the drawer opens, it stops at the first
    number with no file whatsoever (numbering has to be consecutive, which is why
    the drawer reports a count: a gap is then visible rather than mysterious), and
    a probe that neither loads nor fails is treated as absent instead of being
    allowed to hold the scan open. Anything added while the page is open is only
    noticed after a reload.

22. **A page cannot remember a file the user picked.** A blob URL from
    `URL.createObjectURL` plays perfectly and dies with the document, the File
    System Access API does not exist where this app actually lives (`file://`),
    and a whole album will never fit in `localStorage`. That is why music you own
    is played from named companion files — the same reason the two Swan Lake
    transfers sit next to the HTML — and why a picked file is labelled as lasting
    for the visit instead of pretending otherwise.

23. **On `file://` the notification permission is permanently denied, and that is
    fine.** Checked in a real `file://` tab rather than assumed: `Notification`
    exists, `Notification.permission` reads `"denied"`, and asking resolves
    without ever prompting, so `notify()` and `askToNotify()` return quietly
    instead of throwing. Nothing needs fixing — but it does mean the alert sound
    is the only signal in the app's real home, and that a GitHub Pages deployment
    would behave differently, because that is a real origin and would prompt.

24. **A backdrop is a background, not a picture: it must stay out of the way of
    the text.** Two of the presets were dropped after living with them. A wash of
    one colour (Forest) reads as a smudge rather than as scenery, and a tiled dot
    pattern (`radial-gradient` on a 46 px grid, "Stars") reads as graph paper,
    because the eye locks onto the repeat. Space replaces it by placing each star
    as its own tiny radial gradient at its own position — no tile, no repeat, so
    no pattern to notice — over two nebula washes and a base gradient. Every
    colour still comes from the theme (`--bg`, `--card`, `--ink`, `--mut`), which
    is what makes one definition work in both light and dark: a hardcoded night
    sky would leave dark text on a dark background the moment the theme flipped.
    Any new preset has to survive that double check before it ships.

25. **A list you rebuild under a caret is a list that swallows what you type.**
    The task rows save as you type, so typing in a name may not re-render the
    list: `renderTasks()` replaces every row with a fresh element, which takes
    the caret with it and makes a name field drop keystrokes. Only a change that
    alters the *shape* of the list — adding, deleting, finishing, reordering,
    importing — rebuilds it, and everything else updates the one node it touches.
    That includes a session finishing while the panel is open: the badge is
    repainted where it stands (`renderTaskCount()`), because a session can end
    while a name is half-typed. The move with Alt and an arrow key *is* a
    rebuild, so it hands focus back to the same field on the moved row by class
    name afterwards. Verified by typing into a name, letting a session finish
    under it, and checking that focus and the text are both still there.

26. **Absent is not the same as empty.** A backup made before the task list
    existed has no `tasks` key, and a restore that treats a missing key as "an
    empty list" silently deletes the work someone is in the middle of. So the
    importer replaces the list only when the file actually carries one, and an
    old file restores history and leaves the tasks alone. The same distinction
    shows up in the app itself: an empty list and a list of one unnamed task are
    different states, which is why a name cleared to nothing springs back on blur
    rather than becoming a row nobody can read.

27. **A form control does not inherit `text-shadow`.** Measured, not assumed: put
    a shadow on a container and a `span` inside it shows it while a `button`
    inside the same container reports `none`. The photo halo therefore names
    every line it needs — `.tags .tag-chip`, `.skip`, `.panel-buttons button`
    and `.task-current` are all buttons and all listed themselves — instead of
    setting the shadow on `main` and trusting it to reach the children. An
    element with a background of its own is left out, because a glow the colour
    of its own label only blurs the label.

28. **A mid-tone background cannot carry small text at 4.5:1, in either
    direction.** This is a rule about colours, not about a page. A surface whose
    luminance sits near 0.18 is the worst case for dark and light labels at once:
    it is the point where their two ratios cross, at 4.6:1 even for a perfectly
    black or perfectly white label — and a theme's ink and background are never
    pure, so with the real pair the same surface lands near 3.8–4.1:1 whichever
    one you pick. It is why the calendar's third heat step takes a fixed dark ink
    (`#1c1a15`) while its second takes the theme's `--ink`, why the "test mode"
    badge gave up `--warn` and took the theme's own ink pair, and why the accent
    swatches are the one thing the contrast pass could not fix — they *are*
    mid-tones, and the fix is to give each one a tone at the light end and a tone
    at the dark end. Reach for a plate, a tint or a halo; do not reach for a
    cleverer label colour.

29. **Measure the painted pixel, and make sure your parser can read it.** The
    contrast pass rasterises the body's own backdrop inside the page (an SVG
    `foreignObject` holding the computed `background-*`, drawn to a canvas and
    read back with `getImageData`) and samples a grid inside each text box, which
    is far better than eyeballing a gradient. Two traps in that harness are worth
    repeating. (a) Rasterise the **whole body box**, not the window: with a
    viewport-sized raster everything below the fold is skipped silently, which is
    how the stats line and the notice went unmeasured at first. (b) Chrome
    serialises `color-mix()` as `color(srgb 0.23 0.46 0.28)` — a colour space
    *word* followed by three numbers — so a parser that takes the first number as
    red produces `NaN`. And because every comparison against `NaN` is false, a
    `NaN` element is never counted as a failure: it looks like a pass. That is
    exactly how the tinted task row and the calendar's mixed steps stayed
    invisible until the parser was fixed. (c) An overlay that scrolls on its own
    has a fold too: the body-sized raster samples body coordinates, so anything
    below the *dialog's* fold — which is where the tag rows under the statistics
    were — has no sample inside the raster and is skipped just as silently.
    Scroll the dialog to the bottom and scan again, or measure the whole thing in
    two passes. Assert on the finding, not on the absence of a finding.

## How features were verified

Every feature was driven in a real browser: click real elements, read back real
state, assert on exact values, and check the console for errors. Toggles like
the cycle state machine were walked transition by transition, and the importer
was attacked with deliberately hostile files. When a result looked wrong, the
cause was found rather than the test relaxed — that is how the broken ring
colour and the missing button listeners were both caught.

The photo pipeline is driven the same way, through the real file input: a canvas
paints an image, `toBlob` makes a `File`, a `DataTransfer` puts it in
`photoFile.files`, and the input's own `change` event runs the code a real pick
would. Then the stored data URL is decoded back to check its dimensions, and the
refusal paths get a text file and a 1920 px field of random noise (which no JPEG
can squeeze under the cap). Reload, remove and re-import are checked as separate
steps, because "it worked once" is not what this file is trying to prove.

The music a user owns was driven the same way, with `play` and `pause` spied on
before any chip was pressed, so every claim is a recorded event rather than an
inference: the bundled track starts when a focus session starts, stops when the
break begins and comes back on the next focus. The scan was timed and counted
over the server log (eight requests, then four per track, four at the end), the
shuffle was run more than once to see a different track open the session, the
picked file went in through the real input, a text file was refused, and the
folder with only the HTML in it was run to prove the empty case: every missing
recording fell back to the synthesised melody and the empty chip opened its
picker. The bundled lofi track was measured rather than trusted, before and
after its conversion: -9.8 LUFS and +0.1 dBTP going in, -18 LUFS coming out, and
the decoded file read back for duration, RMS and peak instead of believing the
encoder.

The task list was driven the same way, through the real controls: three tasks
typed into the field and added with a dispatched Enter, the estimate set and the
badge read back, the pointer moved with the dot button, a name renamed and
cleared and the label on the timer screen checked after each, a drag performed
with real `DragEvent`s and a `DataTransfer`, and the move with Alt and an arrow
key checked for both the order in the DOM and the order written to storage and
for where focus ended up. A focus session was then run to its end with a short
`?focusSec=2` and the counter, the badge and the line under the timer all read
back — including the case where the session ends while a name is being typed.
Clear-finished was checked against a stubbed `confirm` (both answers), the
export blob was captured and parsed rather than downloaded, and the importer was
fed a file with a duplicate id, an uppercase id, a blank name, a 300-character
name and `used: -4` — all five handled exactly as the sanitizer promises. A
backup with no `tasks` key at all was imported last, to prove the list survives
it.

The contrast pass was measured, not eyeballed. The painted backdrop is rasterised
inside the page — the body's own computed `background-*` goes into an SVG
`foreignObject`, which is drawn to a canvas and read back with `getImageData`, so
the numbers come from real pixels (the harness was checked against a
black-to-white gradient, which reads exactly `rgb(128,128,128)` at its centre) —
then every element carrying text of its own is sampled on a grid inside its box,
with the element's translucent background and its ancestors' composited over the
pixel actually painted there, keeping the worst point and requiring 4.5:1 (3:1
for large text). Between 16 and 26 lines are found in each state. Worst case per
area, after the fixes:

| Area | Light | Dark |
|---|---|---|
| Plain backdrop | 4.75:1 | 8.02:1 |
| Dunes | 4.75:1 | 4.68:1 |
| Aurora | 4.75:1 | 5.54:1 |
| Grid | 4.75:1 | 5.52:1 |
| Space | 4.75:1 | 6.23:1 |
| Customize drawer | 4.75:1 | 7.69:1 |
| Tasks dialog | 4.74:1 | 6.44:1 |
| History dialog | 4.75:1 | 4.82:1 |
| Calendar, five heat steps | 4.75–9.19:1 | 4.82–8.02:1 |
| Photo, white and black, dimming 0/55/85 | 4.75:1, halo 5.11:1+ | 8.02:1, halo 6.4:1+ |

Every light row bottoms out at the same pair: the Start button's label on its own
accent, which is the tightest in the app and is what fixed the light theme's
accent colour. Before the pass the same measurements read: the test-mode badge
2.00:1 (dark) and 3.25:1 (light), the notice 2.53:1 (light aurora), the title
3.88:1 (dark dunes), the mode label 3.76:1 (light grid), the Start button 4.38:1,
the calendar's plain cells 3.76:1 in the light theme — and its mixed steps were
NaN, i.e. silently counted as passes, until the parser was fixed (gotcha 29). The
photo case could not be argued into a promise, so it was measured too: over a
flat photo the scrim alone brings the *primary* text to 4.5:1 at 55% dimming in
the light theme and 65% in the dark one, and it never brings the muted text there
at any visible dimming — 4.39:1 at 85% in the dark theme is as good as it gets —
because any photo can hold a patch the same tone as the words. Hence the halo,
and hence its own measurement: the strongest shadow layer is the theme background
at 90%, so the surface a letter carries is `0.9 x scrim + 0.1 x behind`, and
against that every line without a background of its own reads 5.11:1 or better at
every dimming step, over a pure white photo and a pure black one, in both themes.
The six accent swatches and the tag colours were measured too and are the one
thing left broken — see the measurements in "Remaining work".

The six noises were checked by ear *and* by counting. Each is rendered offline
for its level (gotcha 9), but the three new ones needed a different check,
because what is new about them is movement and events rather than a level: the
graph is spied on instead. `AudioContext.prototype.createBufferSource` is wrapped
to record when a buffer source is made, so picking Fire and waiting four seconds
shows the two layer sources plus eight crackles arriving at the gaps the spec
asks for, picking Off shows that count stop dead (the scheduler really is
cancelled and not merely silenced), and picking a chip with nothing running shows
the preview ending by itself — nothing stopped before 4 s for Rain and nothing
stopped before 5 s for Waves, which is the 4 s and 9 s holds the specs ask for.
Ten chips wrap into three rows in the drawer at 320 px with no horizontal
overflow. One trap in that spy is worth repeating: `BaseAudioContext` and
`AudioContext` both carry `createBufferSource`, so wrapping both wraps the
wrapper, every source is counted twice, and Fire appears to crackle twice as
fast as it does.

The two moving noises were checked for the thing the comments claim. Rendering
Waves offline and taking the RMS of each second of it gives peaks twelve seconds
apart (at 3 s, 15 s and 27 s), with the loudest second 154% above the quietest —
a swell you would hear as a swell, at the period the spec asks for. Wind's
brightness, counted as zero crossings per second, moves from 64 to 610 within one
pass and back, which is the whistle travelling over its octave rather than
sitting still. Neither number comes from trusting the spec: they are what the
rendered noise does.

The same measurement shows the one inherited limit on the noises: the buffers are
four seconds and loop, and the per-second loudness of the low-passed ones varies
by up to a third within a single pass, so a four-second periodicity *is* in the
signal. Nobody has reported hearing it, and the fix is the obvious one —
lengthen the buffers — but that changes rain, brown and cafe as much as it
changes the new three, so it is written down here rather than done in passing.

The history statistics were checked against arithmetic done by hand rather than
against themselves. Eleven seeded days spanning the window and the eight weeks
before it — both tags, one deliberately untagged day, one empty week — were read
back out of the DOM: eight bars whose heights are their share of the best week,
labels in the calendar's own convention ("30 Aug", then 6 Sep, 13, 20, 27, then
"4 Oct", 11, 18), the average line at 52% of the peak where 373 min over eight
weeks puts it against a best week of 90 min, and the tag rows whose shares add to
100% (59 / 34 / 7) and whose
deltas land on the figures you get with a pencil: Study 30 min → 220 min is
+633%, Work 60 min → 128 min is +114%, untagged has nothing before it and says
"new". Then the same block under a tag filter: the heading becomes "Last 8 weeks ·
Work", the bars recolour to that tag, the weeks recompute (20, 10, 83, 15 min),
and the tag list is one row at 100%. Two negatives were checked as well: the
month arrows change the heading to August 2026 and leave every number alone, and
an empty history hides the whole block rather than showing eight bars of zero.
The first run also caught a real bug that a shape-check would have passed — the
per-day and per-session averages were divided in seconds and printed as minutes,
so the line read "2489 min a day"; the numbers have to be read, not just counted.

The new text was measured like the rest of the pass, which meant discovering trap
(c) in gotcha 29: the tag rows sit under the dialog's own scroll fold, so the
first scan never sampled them and said nothing about them. With the dialog
scrolled to the bottom they read 7.08:1 in the light theme and 7.69:1 in the dark
— `--mut` on the card, the same pair as every other secondary line. The only
failure anywhere in the dialog is the pre-existing pressed tag chip, which is the
deferred palette item and now has a second home on record. Layout was checked at
320, 360, 414 and 1200 px: no overflow of the page or of the dialog's scroller,
bars 24 px wide at the smallest, no tag value clipped — and with the content
scrolled to its end the close button has not moved, which is the whole reason the
dialog's content scrolls instead of the panel.

Keep that bar. It has already paid for itself twice.

## Credits and licensing

- **`swan-lake.ogg`** — *Swan Lake*, Op. 20, Act II No. 10, "Scène": the London
  Philharmonic Orchestra under John Barbirolli, HMV, 22 July 1933. Transferred by
  [CHARM](https://www.charm.rhul.ac.uk/) and hosted on
  [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Tchaikovsky_Swan_Lake_Op.20_No.10._Sc%C3%A8ne.ogg)
  as public domain. Tchaikovsky died in 1893, so the composition itself is long
  out of copyright everywhere.
- **`swan-lake-archive.ogg`** — the same Scene and the numbers that follow it,
  released as "Act II Pt. 1" by the European Archive through
  [Musopen](https://musopen.org/) under a public domain mark, hosted on
  [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Tchaikovsky_-_Swan_Lake_Op.20_-_Act_II_Pt.1.ogg).
  Neither the orchestra nor the recording date is stated anywhere in the release,
  so the chip names the source rather than inventing a performer. It arrived
  about 10 dB quieter than the HMV transfer at equal peaks and was levelled to it
  before shipping (both now measure -18 LUFS and an RMS of 0.114, against 0.9
  peaks), which took about +10.4 dB of gain with roughly 3 dB of peak limiting —
  louder than the transfer is, deliberately, because the alternative was a second
  focus sound that sounded broken next to the first.
- The HMV transfer's own status is the murky part, and worth knowing before this
  is ever republished: Commons files it under a PD-EU rationale (a pre-1957 sound
  recording is out of copyright in the EU after 50 years), but pre-1972 US sound
  recordings are protected for 100 years from publication, i.e. into the 2030s.
  Fine for a private timer; not a clean US redistribution.
- **`lofi.ogg`** — "When Time Called Me Darling ( Lofi, Relaxing, Chill)" by
  [HoliznaCC0](https://freemusicarchive.org/music/holiznacc0/), from the album
  *Public Domain Lofi*, dedicated to the public domain under
  [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). The dedication
  requires no attribution and allows redistribution, which is why this is the one
  piece of the app that could be shipped inside a public repository without
  argument; it is credited here anyway because that is the right thing to do.
  Taken from the
  [Free Music Archive](https://freemusicarchive.org/music/holiznacc0/public-domain-lofi/when-time-called-me-darling-lofi-relaxing-chill),
  encoded to Vorbis at quality 4 (113 kbps, 215.3 s, 3.0 MB). The master measured
  **-9.8 LUFS with a true peak of +0.1 dBTP** — a hot modern master, already
  clipping — so it took about -8.2 dB to reach the transfers' own -18 LUFS. That
  is the whole job: it arrives loud and gets turned *down*, where the European
  Archive transfer arrived quiet and had to be raised with limiting. After
  decoding it measures an RMS of 0.100 and a peak of 0.41, so no limiting was
  needed at all. Its spectrum is the reason it sounds like lofi rather than like
  a mistake: 27% of its energy sits below 150 Hz and 1.2% above 8 kHz, against
  the 1933 transfer's dead stop at 6 kHz.
- Considered and **not** used, for whoever looks next: a 1959 Valiant LP
  transfer of Act II (CC0, released by Gerard Arthus, and easily the brightest of
  the lot — energy to 16 kHz where the HMV one stops dead at 6 kHz — but a
  budget-label performance, and the Scene's position inside its 6:32 medley
  could not be located by signal analysis), a duller ~4 kHz Musopen sibling, and
  a 1946 Decca transfer by Sidney Beer on the National Symphony Orchestra of
  London, which exists on Commons only as a 144 MB FLAC whose file 404s. The
  wider finding stands: **there is no modern freely-licensed recording of the
  Scene.** Everything free is a 1933-1959 orchestral transfer, so the only real
  choice is between old transfers, not between old and new.
- Everything else in the app is written from scratch, and the synthesised melody
  is transcribed from a public-domain engraving's MusicXML rather than by ear.
