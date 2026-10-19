# Monidoro — working notes and handoff

> **Picking this up in a fresh session?** Read this file, then skim
> `monidoro.html`, then run `git log --oneline`. Then just say *"continue"* and
> you are fully caught up. Nothing is lost.

A single-file pomodoro timer. `monidoro.html` is the entire app — no build step,
no dependencies, no network. Designed to be opened by double-click from
`file://` and to work offline.

## Running it

- Double-click `monidoro.html`, **or**
- `python -m http.server 8777 --bind 127.0.0.1`, then open
  <http://127.0.0.1:8777/monidoro.html>

Testing with the local server is easier to automate, but `file://` is the real
target and must keep working.

One file is no longer quite enough: **`swan-lake.ogg`** and
**`swan-lake-archive.ogg`** must sit next to `monidoro.html` for the two Swan
Lake focus noises to play the real recordings. Both are strictly optional — with
either file missing, that choice falls back to the app's own synthesised melody,
so a copy of the HTML on its own still makes every sound it ever did.

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
- Four synthesised alert sounds via Web Audio, with no files of their own
- Optional profile name, shown as a greeting
- Per-day history, month heatmap with prev/next navigation
- Backup export to JSON, import with full re-validation, erase history
- Theme: system / light / dark, plus an accent colour picker
- Background: six built-in backdrops (plain, dunes, aurora, forest, grid,
  stars) drawn as CSS gradients out of the theme's own colours, so one
  definition follows light/dark and the accent; plus a photo of the user's own.
  A picked image is shrunk to fit, kept in this browser only, and sits under a
  scrim whose strength is adjustable, so the timer stays readable over any
  picture. Pure CSS and canvas means no files and nothing downloaded
- Tags per session: chip row on the main screen, editable in Customize, with a
  per-tag breakdown of every day and a tag filter in the history heatmap
- Focus noise: rain / brown / cafe, synthesised from two noise buffers and
  filtered, plus two real Swan Lake recordings, both looped: `swan-lake.ogg`
  ("Swan Lake Vintage" — Barbirolli, 1933, the Scene alone, 2:30) and
  `swan-lake-archive.ogg` ("Swan Lake European" — European Archive, the Scene
  and on into the rest of Act II, 4:10). Both files were levelled to the same
  loudness on disk, so switching between them does not call for a different
  slider position. With a file missing, that choice plays the app's own
  transcription of the Scene, taken from the engraving's MusicXML (215 notes,
  182 s, looped), so the choice is never silent. One volume slider drives all of
  them. Plays only while a focus session runs
- Customize opens as a drawer from the right (it outgrew an inline panel) and
  History as a centred dialog; both close on the backdrop, on Escape, and return
  focus to the button that opened them. The drawer scrolls internally, because
  the settings are taller than a short screen
- Keyboard: Space starts and pauses, R puts the session back to the beginning.
  Both are left alone while a text field has focus, and while a button has focus
  Space is left to that button — except Start and Reset, which mean the same
  thing — so Tab to a noise chip and Space still presses the chip
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

## Storage keys (localStorage)

The app was originally called **Monodoro**; it is now **Monidoro**. The keys
were renamed with it, but the old names are still *read* so the rename did not
erase anyone's history.

| Key | Shape |
|---|---|
| `monidoro.settings` | `{focusSec, breakSec, longBreakSec, cycles, goalMinutes, theme, accent, sound, ambient, ambientVolume, backdrop, backdropDim, name, tags, activeTag}` |
| `monidoro.completed` | total focus sessions ever, as a string number |
| `monidoro.days` | `{"YYYY-MM-DD": {sessions, seconds, byTag?}}` |
| `monidoro.photo` | a `data:image/jpeg` URL for the chosen background photo |

`settings.tags` is `[{id, name, color}]` — `id` is a lowercase slug built
internally and never derived from the name, so renaming a tag cannot orphan the
history filed under it. `byTag` is `{tagId: {sessions, seconds}}` and is
**omitted entirely** when empty, so days recorded before tags existed keep the
shape they already had. There is no migration pass and reading old history never
rewrites it.

`settings.backdrop` is one of `plain | dunes | aurora | forest | grid | stars |
photo`, and `backdropDim` is the scrim strength over a photo (0-85). The photo
itself lives in its own key rather than in `settings`, for two reasons: it is big
enough to make every backup file unwieldy, and it is tied to the browser it was
picked in. A backup therefore carries `backdrop: "photo"` but not the image, and
`sanitizeSettings()` turns that back into `plain` when there is no photo — a
restored backup shows a preset instead of an empty page.

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

Nothing is queued. The three features that were planned here are done and
described above: keyboard shortcuts with a completion notification (7), the
plant with confetti (8), and backgrounds (9).

One thing stays unverified: the completion notification on `file://`. The
browser tool used to test everything else refuses `file://` URLs outright, so
the only way to check it is by hand — double-click the file and finish a
session. Every call is guarded (feature detection, permission check, `try`), so
the worst case is that nothing appears and the alert sound carries the moment.

Ideas raised along the way and deliberately not pursued, so nobody re-opens them
by accident:

- **Publishing to GitHub Pages.** The notification prompt would start appearing
  there, since it is a real origin rather than `file://`.
- **A record of dead plants.** Wilting leaves no trace anywhere: it is feedback
  for the moment, not a history of failure, and the day records stay about time
  spent.
- **A third Swan Lake transfer.** Checked and rejected (see the credits) — no
  modern freely licensed recording of the Scene exists to offer.
- **Bundled background photographs.** A real picture means another companion
  file, a licence to pick and a few hundred kilobytes in every copy, where the
  photo slot already takes any image the user owns and the CSS presets make the
  app look finished out of the box.

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
   deleted. The same goes for a rename *inside* a value: when the archive chip
   was renamed, its key went from `swanLong` to `swanArchive` and
   `sanitizeSettings()` maps the old name forward, because an unmatched value
   falls back to the default (`off`) — indistinguishable from the setting
   erasing itself.

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
   two-second harp intro (and so the preview length) was found.

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
    `swanRecordingVolume()`, where the slider *is* the element volume. Loudness is
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
    after.

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
