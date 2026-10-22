<p align="center">
  <img src="logo.png" alt="Monidoro: a badger holding a tomato-shaped timer" width="180">
</p>

# Monidoro

A single-file pomodoro timer. `monidoro.html` is the entire app — no build step,
no dependencies, no network.

**Live: <https://monish-m-s.github.io/Monidoro/>**

Also runs by double-clicking `monidoro.html` from disk, and works offline.

## What it does

25/5 timer with presets, a plant that grows inside the progress ring, confetti
for a finished session, a task list that counts sessions into the task you were
on, tags, six synthesised focus noises plus three bundled recordings, five
CSS backdrops or a photo of your own, and a history heatmap with weekly bars and
a per-tag breakdown. Everything is stored in this browser's `localStorage`;
nothing is uploaded.

## The sound files

`swan-lake.ogg`, `swan-lake-archive.ogg` and `lofi.ogg` sit beside the page so
those three choices play the real recordings. They are strictly optional — with
a file missing, that choice falls back to the app's own synthesised melody.

Your own music is read from beside the page as `focus-music-1.ogg`,
`focus-music-2.ogg`, and on (`.mp3`, `.m4a` and `.wav` accepted too).

## The icon files

`logo.png` is the source drawing. The tab icon (`favicon.ico`,
`favicon-32.png`), the iOS touch icon and the 30 px mark beside the wordmark are
cut from it, and they are optional too: with none of them present the app is
unchanged, only without a tab icon.

## Installing it as a desktop app

The published copy is a PWA, so Windows, macOS, Linux and Android can install it
with its own window and its own Start-menu or dock entry — offline included.
Nothing is downloaded from a store and nothing needs a build:

- **Edge / Chrome on Windows:** open
  <https://monish-m-s.github.io/Monidoro/>, then either click the install glyph
  in the address bar, or **⋯ → Apps → Install this site as an app** (Chrome calls
  it *Cast, save and share → Install page as app*). It lands in the Start menu
  and can be pinned to the taskbar.
- **Safari on iOS / macOS:** Share → *Add to Home Screen* / *Add to Dock*.
- **Chrome on Android:** ⋮ → *Add to Home screen* → *Install*.

Installing adds `manifest.webmanifest` and `sw.js` to what the app already is.
The worker caches the page and its icons so the installed copy opens with no
network at all. Media requests are passed straight through (they stream as byte
ranges, and a cached partial response breaks playback), so offline the
recordings step aside to the app's own synthesised music — the same fallback a
missing file already gets.

If you would rather not install anything, `python -m http.server 8777` and a
browser tab are still all it takes, and double-clicking `monidoro.html` still
works with no server at all.

## Notes

`NOTES.md` is the full working handoff: storage shapes, the gotchas that cost
real time, and how each feature was verified.

## Credits

The bundled recordings are public domain or CC0; the licences and sources are
listed in `NOTES.md`.
