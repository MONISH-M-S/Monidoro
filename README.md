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

## Notes

`NOTES.md` is the full working handoff: storage shapes, the gotchas that cost
real time, and how each feature was verified.

## Credits

The bundled recordings are public domain or CC0; the licences and sources are
listed in `NOTES.md`.
