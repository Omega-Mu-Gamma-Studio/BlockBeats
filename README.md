# 🎵 BlockBeats

Drag-and-drop music theory & production for total beginners, taught by twin mascots who explain everything through two opposing lenses — **Feel** and **Logic** — so every concept lands twice, two different ways, before you're asked to try it yourself.

BlockBeats teaches the *whole* song: rhythm, bass, harmony, melody, arrangement, **and** production/mixing. It's not a music-theory quiz app — it's meant to take someone from "what's a beat" to "I mixed a track," using blocks instead of a mouse-and-plugin DAW. No sheet music, no exam-style theory — the whole point is that someone with zero background can open this and have fun.

Part of the Omega Mu Gamma Studio suite.

---

## 1. Status — What Actually Exists Right Now

This section is honest about where the repo is today vs. the plan below it. Update it as things land.

| Piece | Status | Notes |
|---|---|---|
| App shell (`App.jsx`, `AppLayout.jsx`, routing) | ✅ Built | |
| `Home.jsx`, `UnitPage.jsx`, `LessonPage.jsx`, `Shop.jsx` | ✅ Built | Pages exist and render; lesson *content* inside them is not wired to real lesson JSON yet |
| `progressStore.js` (XP, coins, completed lessons, unit progress) | ✅ Built | Already diverged from early plan — see §6 |
| `lessonStore.js` | ⚠️ Built, needs rework | Currently drives a single companion's expression + dialogue bubble. Does **not** yet track lesson phase (now 6 phases, not 3) / attempts / user-placed blocks, and doesn't yet support two mascots at once — see §5 |
| `Companion.jsx` (the character) | ⚠️ Built, needs rework | Single-mascot component — needs to become the twin system (Feel + Logic) described in §5. Base sprite set only; no outfit-based sprite swapping wired in yet, even though `equippedOutfit` exists in the store |
| `data/units.js` | ✅ Built, needs expansion | Currently 5 units / 21 lessons. Full 6-unit / 75-lesson list is locked (§3) — still needs transcribing into this file |
| `data/shopItems.js` | ✅ Built | Wallpapers + gear, cosmetic-accent only (no alt sprites yet) |
| Lesson JSON files (per-lesson content) | ❌ Not started | Zero lesson JSON files exist yet — only the unit/lesson-title index |
| `audioEngine.js`, `musicTheoryEngine.js`, `validationEngine.js` | ❌ Stub (0 bytes) | Core engines — nothing plays sound yet |
| Block components (`BlockPalette`, `Timeline`, `DroppedBlock`, etc.) | ❌ Stub (0 bytes) | No drag-and-drop yet despite `@dnd-kit` being installed |
| BTS / Konva rendering (`PianoRoll`, `WaveformView`, `EffectChain`, `BTSRenderer`) | ❌ Stub (0 bytes) | This is also the planned home of the mini DAW (§4) |
| Lesson-flow components (`DialogueBox`, `HintSystem`, `PhaseIndicator`, `LessonCanvas`) | ❌ Stub (0 bytes) | |
| `DomainExpansion.jsx` (level-up celebration) | ❌ Stub (0 bytes) | |
| `audioStore.js` | ❌ Stub (0 bytes) | |
| Dependencies (tone, konva, dnd-kit, framer-motion, canvas-confetti, zustand) | ✅ Installed | package.json already matches the target stack |

**tl;dr:** the shell, progression system, and companion character are real. The actual "game" — blocks, audio, lessons, BTS/DAW — is unbuilt. That's the work ahead.

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 19 + Vite | Studio standard (GateLab, ArchVisor) |
| Styling | Tailwind v3 (not v4) + Framer Motion | v3 is the studio's settled choice after the ArchVisor v4 migration pain. Framer Motion drives companion expressions, phase transitions, Domain Expansion |
| Audio | Tone.js | Web Audio API wrapper — synthesis, sampling, effects, and `Tone.Transport` as the global clock everything schedules against |
| BTS / Mini DAW rendering | Konva.js (`react-konva`) | 2D canvas, same `Stage → Layer → Shape` model as GateLab's gate rendering |
| Drag & drop | `@dnd-kit` | Better touch support than `react-dnd`, less boilerplate |
| State | Zustand | Three-ish stores: progress, lesson/companion, audio (see §6) |
| Routing | React Router v7 | Home → Unit → Lesson nesting |
| Confetti | `canvas-confetti` | Domain Expansion celebration |

All of the above are already installed in `package.json`.

---

## 3. The Syllabus — 6 Units, 75 Lessons

BlockBeats teaches the whole song, not just theory — which is why there's a 6th unit for production/mixing alongside the five music-writing units.

| # | Unit | Lessons | Teaches |
|---|---|---|---|
| 1 | The Beat | 12 | Rhythm, drums, groove, swing, syncopation, time signatures, genre drum patterns, fills |
| 2 | The Bassline | 11 | Root notes, locking with the kick, walking bass, genre bass styles, bass as harmonic glue |
| 3 | Chords & Harmony | 15 | Triads → 7ths/extensions, diatonic families, secondary dominants, modal interchange, circle of fifths, modulation |
| 4 | Melody | 13 | Scales as a toolbox, phrasing, motif/contour, hooks, counter-melody, melody over changes |
| 5 | Arrangement | 12 | Song structure, layering, automation basics, build-ups/drops, full-song maps |
| 6 | Production & Mix Basics | 12 | EQ, compression, reverb/delay, panning, gain staging, effect chains, a first full mixdown |
| | **Total** | **75** | |

Units are **all unlocked from the start** — no hard gating. `requiredLevel` on a unit is cosmetic (dims/previews an under-leveled unit) and never blocks access. This is deliberate: not everyone comes for theory — some just want to build beats or learn mixing, and they shouldn't have to grind through Unit 1 to get there.

### Full Lesson List

Titles + one-line "teaches" for all 75. Writing (dialogue, both twins' metaphors, actual JSON) comes later — this is the locked syllabus to write against. Every lesson here needs to support two genuinely different Feel/Logic metaphors before it gets written; if one doesn't fit cleanly when we get to it, flag it rather than force it.

**Unit 1 — The Beat**
1. What Is a Beat? — the pulse underneath every song, why your foot taps on its own
2. Kick and Snare — the two-note skeleton of almost every groove
3. Hi-Hats and Groove — filling the gaps between kick and snare
4. Swing and Feel — why "on the grid" isn't the same as "in the pocket"
5. Time Signatures 101 — counting in 4, counting in 3, why it changes everything
6. Syncopation — hitting where you don't expect, and why it's exciting
7. Ghost Notes — the notes you barely hear but definitely feel
8. Velocity and Dynamics — loud hits vs. quiet hits, same pattern
9. Drum Fills — how to signal "something's about to change"
10. Genre Patterns: Hip-Hop vs. House — same kit, completely different feel
11. Polyrhythm Intro — two patterns at once without falling apart
12. Build Your First Loop — putting it all together into something that repeats

**Unit 2 — The Bassline**
1. Why Bass Matters — the note you feel in your chest before you hear it
2. Root Notes — picking the one note that anchors everything
3. Locking with the Kick — bass and kick as a single rhythmic unit
4. Basslines with Movement — root notes that walk instead of sit still
5. Walking Bass — a line that strolls between chords
6. Octave Jumps — same note, different register, big energy shift
7. Syncopated Bass — bass that dances around the beat instead of on it
8. Call-and-Response: Bass and Kick — trading rhythmic ideas
9. Genre Bass Styles — funk vs. trap vs. house low-end
10. Bass as Harmonic Glue — how the bassline quietly defines the chord
11. Sub-Bass vs. Mid-Bass — the production-side distinction between felt and heard

**Unit 3 — Chords & Harmony**
1. What Is a Chord? — three notes that become one idea
2. Major vs. Minor — the two moods every chord starts from
3. Chord Progressions — chords that lead somewhere
4. Voicing and Inversions — same chord, rearranged, different feel
5. Tension and Release — why some chords beg to resolve
6. 7th Chords — adding one note, changing the whole flavor
7. Extended Chords (9ths+) — jazzier, dreamier, more color
8. Diatonic Chord Families — every chord that "belongs" in a key
9. Secondary Dominants — borrowing tension from outside the key
10. Modal Interchange — borrowing whole chords from a parallel key
11. Chord Substitution — swapping one chord for a cousin that still works
12. The Circle of Fifths — the map that explains why keys relate the way they do
13. Key Changes and Modulation — moving the whole song to a new home
14. Sus and Add Chords — chords that hover instead of settling
15. Write Your First Progression — open creative capstone

**Unit 4 — Melody**
1. Scales as a Toolbox — the notes you're allowed to pick from
2. Phrasing a Melody — where a musical sentence breathes
3. Melodic Contour — the shape a melody traces up and down
4. Motif and Repetition — a small idea, repeated until it's memorable
5. Chord Tones vs. Passing Tones — notes that belong vs. notes just passing through
6. Call and Response — a melody that asks, then answers
7. Hooks and Earworms — why some four notes won't leave your head
8. Counter-Melody — a second melody that complements the first
9. Melody Over Changes — writing a line that tracks the chords underneath
10. Rhythm of Melody vs. Harmony — melody doesn't have to move when the chords do
11. Modes for Melody — dorian, mixolydian, and the moods they unlock
12. Melodic Tension — using "wrong" notes on purpose
13. Write a Full 8-Bar Melody — creative capstone

**Unit 5 — Arrangement**
1. Verse vs. Chorus Energy — why the chorus has to feel bigger
2. Song Structure Maps — verse, chorus, bridge, and how they fit together
3. Transitions and Fills — smoothing the seam between sections
4. Layering and Density — when to add instruments, when to strip back
5. Intro and Outro Design — how a song invites you in and lets you go
6. Automation Basics — parameters that change over time, not just once
7. Build-Ups — stacking tension before a drop or chorus
8. Drops and Payoffs — the moment all that tension resolves
9. Genre Arrangement Templates — how pop, EDM, and hip-hop structure differ
10. The Bridge — the one section that's allowed to break the pattern
11. Dynamics Across a Song — loud sections need quiet ones to mean anything
12. Arrange a Full Track — creative capstone tying every unit together

**Unit 6 — Production & Mix Basics**
1. What Is Mixing? — turning a pile of tracks into one balanced song
2. Gain Staging — getting levels right before anything else
3. EQ Basics — carving space for each instrument to be heard
4. Cutting vs. Boosting — two ways to shape a frequency, different results
5. Compression Basics — taming the loud parts so the quiet parts survive
6. Attack and Release — how compression's timing changes its personality
7. Reverb and Space — making a mix feel like it's in a room
8. Delay — echoes as rhythm, not just atmosphere
9. Panning and Stereo Width — using left-right space on purpose
10. Effect Chains — the order effects go in, and why it matters
11. Genre Mixing Approaches — how a lo-fi mix differs from an EDM mix
12. Your First Full Mixdown — creative capstone, mixing a complete track

### Lesson JSON schema — same 6 phases, every lesson

Every lesson is a JSON file (`data/lessons/unit{N}/{N}-{M}.json`), read and rendered by the app. Because every lesson uses the *exact same* phase structure, a lesson JSON is almost entirely dialogue plus a pointer to what the mini DAW should show — no per-lesson component logic required. See §5 for the twins themselves.

1. **`intro`** — a quick, concrete hook. Why should the player care about this concept at all? No theory yet — just makes it feel real (e.g. "this is why that drop hits so hard"). One twin only, whichever fits.
2. **`explanation`** — the actual teaching. **Both twins always speak here, back to back** — Feel gives the intuitive/emotional metaphor first, then Logic gives the structural/technical one for the *same* concept. This back-and-forth contrast is the core teaching mechanic of the whole app.
3. **`examples_bts`** — a concrete working example played out, with the mini DAW/BTS view open alongside it (piano roll / waveform / effect chain, whichever fits the unit) so the player can see and hear the concept at once.
4. **`bad_example`** — the deliberately wrong version, plus an `error_explanation` for why it fails. (This is the old "See It Break" phase, unchanged in spirit.)
5. **`test`** — the player drags blocks onto a timeline to rebuild or solve the concept, with escalating hints (`hint_1`, `hint_2`, then a `solution_reveal`) after repeated failed attempts. Required to complete the lesson.
6. **`challenge`** — **optional, bonus XP only.** Not a harder version of Test — a small open-ended production task using what was just taught (e.g. "build a classical-feeling melody with today's tools"). Looser than Test: no single scripted solution, evaluated more like a mini free-play goal than strict validation.

Test's validation isn't always exact-match: a `validation_mode` field per lesson picks between strict positional matching, order-only matching, or "musically correct" matching (e.g. accepting any valid diatonic substitute, not just the one scripted answer) — important once Unit 3+ lessons get more open-ended. Challenge deliberately skips this in favor of a looser goal-check.

Unit 6 lessons follow the same 6-phase shape but swap chord/rhythm blocks for **effect blocks** placed on a chain (EQ, compression, reverb, etc.), each with tweakable parameters — see §4.

---

## 4. The BTS View *Is* the Mini DAW

This is the one deliberate scope departure from a "linear lesson app": the Behind-the-Scenes panel isn't just a read-only diagram — it doubles as a **free-play mini DAW**.

- **Inside a lesson**, BTS shows the constrained, validated version of what's happening: piano roll for chord/melody blocks, waveform for drum blocks, effect chain for Unit 6 signal flow — scoped to that lesson's blocks only.
- **Outside lessons**, the same Konva-based rendering opens as a standalone **free-play mode**: full palette unlocked regardless of progress (every chord, every drum kit, every effect, blocks from any unit), no validation, no XP, no save/export. It's a sandbox for messing around, not a second progression system — keep it disposable and low-stakes; session state resets on reload.

Unit 6's mechanic (drag an effect block onto a chain, then tweak its parameters via sliders) is the same interaction in both lesson and free-play contexts — just gated by lesson validation in one and not the other.

Practically, this means `BTSRenderer.js` / `PianoRoll.js` / `WaveformView.js` / `EffectChain.js` need to support two modes from the start (constrained + free), rather than being built lesson-only and retrofitted later.

---

## 5. The Twins — Feel & Logic

This replaces the single-companion model from earlier planning. **Not settled yet: names, gender/casting, and final personality details** — that's intentionally left to the studio's creative direction, not locked here. What *is* locked is the mechanic.

**The axis:** every concept in the syllabus gets explained twice, by two mascots with opposing but equally valid philosophies:

- **Feel** — the intuitive, emotional, body-first explainer. Talks in metaphor, sensation, vibe. ("This chord feels like it's falling.")
- **Logic** — the structural, technical explainer. Talks in pattern, function, why-it-works. ("This is the vi chord — it borrows the tonic's notes, which is why it still feels like home.")

Neither twin is "the real one" or "the bonus one" — they always appear together in the `explanation` phase (§3), back to back, same concept, two lenses. This is deliberate: contrast is what makes a concept stick for a beginner, and it means every one of the 75 lessons needs **two** metaphors written for it, not one.

**Art direction:** gothic ink-wash, modern take — muted/monochrome ink-wash technique with a pop of modern neon/color accent (rather than fully desaturated traditional ink wash). Distinct from the flat sprite-based style used elsewhere in the studio's Chan apps.

**Open design questions, deliberately not decided here:**
- Do Feel and Logic ever disagree or banter with each other, or do they always agree and just phrase things differently?
- How many expressions does each twin need, and do they share an expression set or have their own?
- Does the `bad_example` phase have a "twin opinion" on the failure (e.g. Logic explaining *why* it's wrong, Feel reacting to how *bad* it sounds), or is it presented more neutrally?

**Current code reality:** the existing `Companion.jsx` is a single-mascot component (sprite + dialogue bubble driven by `lessonStore`). It needs to become two components (or one component with a `twin` prop) before any of this can be built — this is a rebuild, not an extension, of what exists today.

---

## 6. State — Stores (as they actually are, not as originally planned)

The original plan called for three stores split as progress / lesson / audio. Reality diverged slightly:

- **`progressStore.js`** — XP, coins, `completedLessons` (object map, not array), equipped wallpaper/outfit, `lastVisited`. Level is **derived**, not stored: `getLevel()` computes `floor(xp / 150) + 1`, uncapped. At a ~25 XP/lesson average across 75 lessons (~1,875 XP total), this comfortably spans well past level 10 without hitting an artificial ceiling — no rescaling needed for the 75-lesson target.
- **`lessonStore.js`** — currently just companion expression + dialogue. Still needs: current lesson, current phase (1/2/3), attempt count, last result, user-placed blocks, dialogue line index, hints shown. This is the real gap — the phase state machine described in the original build guide doesn't exist yet.
- **`audioStore.js`** — stub, not started. Will hold Transport state, BPM, playback status once `audioEngine.js` exists.

---

## 7. Folder Structure

```
BlockBeats/
├── public/
│   ├── audio/            # drums, sample packs (lo-fi / EDM / hip-hop)
│   ├── sprites/          # companion art (base set exists; outfit sets planned)
│   └── wallpapers/       # Shop-unlockable backgrounds
│
├── src/
│   ├── components/
│   │   ├── character/    # Companion.jsx
│   │   ├── blocks/       # BlockPalette, BlockItem, Timeline, DroppedBlock — stub
│   │   ├── lesson/       # LessonCanvas, PhaseIndicator, DialogueBox, HintSystem, BTSPanel — stub
│   │   ├── bts/          # BTSView, PianoRoll, WaveformView, EffectChain — stub, doubles as mini DAW UI
│   │   ├── ui/           # Sidebar, BottomBar, XPDisplay, DomainExpansion, TransportBar — stub
│   │   └── layout/       # AppLayout.jsx
│   │
│   ├── data/
│   │   ├── lessons/      # per-lesson JSON, organized unit1..unit6 — not started
│   │   ├── units.js      # unit + lesson-title index — 21/75 lessons drafted
│   │   ├── shopItems.js  # wallpapers + gear
│   │   └── presets/      # hiphop / edm / lofi audio presets — not started
│   │
│   ├── engines/          # audioEngine, musicTheoryEngine, validationEngine, dawEquivalent — all stub
│   ├── rendering/        # Konva BTS/DAW renderers — stub
│   ├── hooks/            # useLesson, useProgress, useAudio
│   ├── pages/            # Home, UnitPage, LessonPage, Shop — built
│   ├── store/            # progressStore (built), lessonStore (built, partial), audioStore (stub)
│   ├── services/         # lessonService, storageService — stub
│   └── utils/            # xpCalculator, patternMatcher, midiParser — stub
```

---

## 8. Build Order

Roughly the order that unblocks the most downstream work first:

1. **Audio foundation** — `audioEngine.js` (Tone.js singleton), `musicTheoryEngine.js` (chords/scales/progressions), wire a single chord to play on a button click.
2. **Blocks + DnD** — block type definitions, palette, timeline as a drop target, basic exact-match validation.
3. **Twins + lesson state machine** — rebuild `Companion.jsx` into the Feel/Logic twin system (§5), rework `lessonStore` (or a sibling store) to track the 6-phase structure (§3) plus attempts/blocks, then wire `LessonCanvas`, `DialogueBox`, `PhaseIndicator`, `HintSystem` against it.
4. **First real lesson** — pick one lesson from Unit 1, write its JSON across all 6 phases, get it working end-to-end with real audio, both twins, and real Test validation. This is the proof that the whole pipeline works before scaling to 75.
5. **BTS / mini DAW** — Konva renderers, starting with `PianoRoll` (chord/melody) and `WaveformView` (drums), built with both lesson-scoped and free-play modes in mind from the start (§4). `EffectChain` comes with Unit 6 mechanics.
6. **Progression polish** — Domain Expansion, companion outfit-swapping, Shop wiring.
7. **Content** — the other 74 lesson JSONs, sprite art for outfits, audio presets.

---

## 9. Contributing

Read the actual source before writing new code — several things here (stores, companion naming, XP formula) have already drifted from earlier planning docs, and this README reflects the current real state, not the original pitch. Favor incremental patches over rewrites. Architecture/design discussion before implementation, always.