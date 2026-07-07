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
| `Companion.jsx` (the character) | ⚠️ Built, needs rework | Single-mascot component — needs to become the Melody/Harmony twin system described in §5. No twin portrait assets exist yet (8 PNGs needed: 4 per twin) |
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

## 5. The Twins — Melody & Harmony

Locked. Names, casting, art direction, dialogue style, and expression set are final — this replaces the earlier "Feel/Logic, unnamed" placeholder.

### Core Identity

| Aspect | Melody | Harmony |
|---|---|---|
| Name | Melody | Harmony |
| Japanese | メロディ (Merodī) | ハーモニ (Hāmoni) |
| Nationality | German | German (twin) |
| Role | The Feel — emotion, intuition, passion | The Logic — structure, precision, analysis |
| Philosophy | "How does this feel?" | "Why does this work?" |
| Voice | Warm, expressive, slightly theatrical | Cool, precise, slightly dry |
| Accent | Soft German, melodic, romantic | Crisp German, measured, amused |

### Appearance

| Element | Melody | Harmony |
|---|---|---|
| Hair | Long, flowing, slightly messy, warm brown with pink undertones | Neat, shorter, sharp cut, dark with cyan undertones |
| Eyes | Warm amber/gold, expressive, slightly larger | Cool silver/blue, focused, slightly narrower |
| Posture | Open, animated, gestures with hands | Controlled, precise, still hands |
| Style | Flowing fabrics, slightly disheveled, warm tones | Structured clothing, neat, cool tones |
| Signature | Always has a pen tucked behind her ear | Always has a notebook or tablet |
| Color Accent | Neon Pink `#FF6B9D` | Neon Cyan `#00D4FF` |
| Expression Set | Warm, dramatic, emotional | Analytical, amused, precise |

### Sprites — 8 total (4 per twin), locked

Each portrait is a full illustrated scene (background + mood), not a bare face — which is why 4 expressions each is the right count, not a limitation. More states would dilute the per-portrait presence, not add to it.

| Melody | Harmony |
|---|---|
| `melody-neutral.png` | `harmony-neutral.png` |
| `melody-teaching.png` | `harmony-teaching.png` |
| `melody-excited.png` | `harmony-intrigued.png` |
| `melody-thinking.png` | `harmony-analyzing.png` |

Art style: monochrome ink-wash illustration base, single neon accent color per twin, transparent PNG background with subtle ink splatter, 512×512px.

Expression details:

| State | Melody | Harmony |
|---|---|---|
| Neutral | Calm, open, warm smile, waiting | Composed, observant, slight smile, waiting |
| Teaching | Passionate, animated, gesturing, eyes bright | Precise, pointing, explaining, focused |
| Excited / Intrigued | Big smile, bright eyes, hands clasped | Small smile, raised eyebrow, "Hmm." |
| Thinking / Analyzing | Searching skyward, hand on chin, dreaming | Reading, calculating, tapping chin |

### Dialogue Style

| Aspect | Melody | Harmony |
|---|---|---|
| Tone | Warm, emotional, metaphorical | Cool, logical, literal |
| German words | Used for emphasis, ~10% of dialogue | Same, ~10% of dialogue |
| Metaphors | Feeling-first ("this chord is the sky falling") | Function-first ("this is the vi chord — the relative minor") |
| Encouragement | Warm, exclamatory | Precise, measured praise |
| Frustration | Warm but exasperated | Dry, blunt correction |
| Humor | Warm, playful, slightly chaotic | Dry, sarcastic, amused |

### The Dynamic

They're twins — one origin, two philosophies. They don't argue and they don't compete; they contrast. Melody always speaks first in the `explanation` phase and gives the feeling; Harmony follows with the structure. They finish each other's sentences over time, and their contrasting metaphors become running inside jokes across lessons rather than one-off lines.

Lore (optional, background flavor — not required for any mechanic): raised together in Germany, trained under different teachers with different philosophies — Melody in Berlin, where the feeling of music lives; Harmony in Leipzig, where the structure of music lives. They've come back to teach together, as a duet.

### Current code reality

`Companion.jsx` is still a single-mascot component. It needs to become a twin-aware system (two sprite sets, `melody-*` / `harmony-*`, both wired to speak in sequence during `explanation`) before any of this can render — this is a rebuild, not an extension, of what exists today.

---

## 6. UI Theme — Ink Wash Gothic Neon

Locked, alongside the twins — this is the visual language for the whole app, not just the twins' portraits.

### Color Palette

| Element | Hex | Name | Usage |
|---|---|---|---|
| Background | `#0A0A0F` | Void Black | Main background |
| Card Background | `#1A1A24` | Ink Wash | Cards, panels |
| Borders | `#2A2A3A` | Dry Ink | Dividers, outlines |
| Melody Accent | `#FF6B9D` | Neon Pink | Melody's glow, buttons, highlights |
| Harmony Accent | `#00D4FF` | Neon Cyan | Harmony's glow, buttons, highlights |
| Warm Glow | `#FFB347` | Amber | Playhead, hover states, warmth |
| Text Primary | `#F5F0EB` | Bone White | Main text |
| Text Secondary | `#8A8A9A` | Ghost Grey | Subtext, metadata |
| Melody Glow | `#FF6B9D33` | Pink Shadow | 20% opacity aura |
| Harmony Glow | `#00D4FF33` | Cyan Shadow | 20% opacity aura |

### Visual Principles

| Element | Ink Wash | Neon |
|---|---|---|
| Backgrounds | Splatter textures, irregular edges | Subtle glow behind key elements |
| Typography | Hand-drawn brushstroke headings | Neon accent on key words |
| Borders | Irregular, organic, ink-bleed edges | Sharp, precise lines with glow |
| Sprites | Monochrome ink wash + accent glow | Melody: pink / Harmony: cyan |
| UI Elements | Ink splatters as decoration | Neon outlines on active states |
| Dialogue | Ink-bleed edge bubbles | Glowing text on key phrases |

### Layout Structure

App header (logo, XP, level) sits above a two-column layout: a left sidebar listing all 6 units with per-unit twin-color completion indicators, and a main content area holding the lesson title + phase indicator, the twin dialogue boxes (Melody's line, then Harmony's line, each in their own accent-bordered bubble), transport controls, and the BTS/Konva canvas (piano roll / waveform / effects tabs) beneath it. A bottom bar carries overall progress, transport, and XP display.

### Component Specs

- **App Shell** — `#0A0A0F` background with subtle ink-splatter SVG texture; page transitions are an ink-bleed dissolve (300ms); brushstroke headings + clean sans-serif body text.
- **Sidebar** — `#1A1A24` ink-wash texture, organic brushstroke border; units show twin-color completion indicators (neon checkmark = done, twin accent glow = active, ghost grey = dimmed/preview); ink-wash progress bar with glow.
- **Lesson Header** — brushstroke title in bone white; monospace ghost-grey metadata (e.g. `BPM 120 • 4/4`); phase indicator as 1–6 ink-wash-style dots; small circular twin avatars with glow.
- **Dialogue Box** — ink-wash card, irregular edges; speaker name in that twin's accent color with neon glow; German words highlighted in accent color; small twin sprite beside the text; ink-bleed dissolve between lines.
- **Block Palette (Test phase)** — ink-stroke outlines with drag handles, color-coded by block type (chord/drum/melody); neon glow in twin accent color while dragging; ghost-grey ink-wash tooltips.
- **Timeline (Test phase)** — ink-wash grid lines with subtle glow; amber (`#FFB347`) playhead; dropped blocks color-coded with neon borders; magnetic snap with a subtle pulse.
- **BTS View (Konva canvas)** — `#0A0A0F` background with subtle grid; piano roll notes in pink (melody) / cyan (harmony); ink-wash waveform with amber glow; effect chain as neon node connections; standard zoom/scroll/playhead controls.
- **Transport Bar** — brushstroke play/stop buttons with neon glow; monospace ghost-grey BPM display; ink-wash progress bar; amber glow on tempo tap.
- **Shop Page** — ink-wash gallery layout; ink-bleed-bordered item cards; unlocked items get twin-accent neon glow, locked items are ghost-grey with an ink-wash overlay; brushstroke equip button with glow.
- **Domain Expansion (level-up)** — ink-explosion SVG background effect; brushstroke bone-white text with neon glow; pink + cyan confetti particles; auto-dismisses after 3 seconds.

### Typography

| Use | Font Style | Size | Color |
|---|---|---|---|
| App Title | Brushstroke | 28px | Bone White + Neon Glow |
| Lesson Title | Brushstroke | 24px | Bone White |
| Unit Name | Serif, irregular | 18px | Bone White |
| Dialogue | Sans-serif | 16px | Bone White |
| Emphasis Word | Sans-serif, bold | 16px | Twin Accent |
| Metadata | Monospace | 12px | Ghost Grey |
| Button Text | Sans-serif | 14px | Bone White |

### Animation

| Element | Animation | Duration |
|---|---|---|
| Page Transition | Ink-bleed dissolve | 300ms |
| Dialogue Advance | Fade + slide up | 200ms |
| Twin Switch | Fade + ink-bleed | 300ms |
| Block Drag | Glow + follow cursor | Instant |
| Drop Block | Ink-splash effect | 200ms |
| Transport Play | Amber glow pulse | 500ms |
| Domain Expansion | Ink explosion + confetti | 3000ms |
| Hover State | Neon glow | 200ms |

### CSS Variables (starting point)

```css
:root {
  /* Backgrounds */
  --color-void: #0A0A0F;
  --color-ink: #1A1A24;
  --color-dry-ink: #2A2A3A;

  /* Twins */
  --color-melody: #FF6B9D;
  --color-harmony: #00D4FF;
  --color-amber: #FFB347;

  /* Text */
  --color-bone: #F5F0EB;
  --color-ghost: #8A8A9A;

  /* Glows */
  --glow-melody: 0 0 30px rgba(255, 107, 157, 0.3);
  --glow-harmony: 0 0 30px rgba(0, 212, 255, 0.3);
  --glow-amber: 0 0 30px rgba(255, 179, 71, 0.3);
}

.neon-melody {
  color: var(--color-melody);
  text-shadow: 0 0 10px rgba(255, 107, 157, 0.5);
}

.neon-harmony {
  color: var(--color-harmony);
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.dialogue-melody {
  background: var(--color-ink);
  border-left: 4px solid var(--color-melody);
  box-shadow: var(--glow-melody);
}

.dialogue-harmony {
  background: var(--color-ink);
  border-left: 4px solid var(--color-harmony);
  box-shadow: var(--glow-harmony);
}
```

Ink-wash textures and ink-bleed borders (splatter SVGs, irregular border-image slices) still need actual SVG assets — the CSS above references them but they don't exist as files yet.

---

## 7. State — Stores (as they actually are, not as originally planned)

The original plan called for three stores split as progress / lesson / audio. Reality diverged slightly:

- **`progressStore.js`** — XP, coins, `completedLessons` (object map, not array), equipped wallpaper/outfit, `lastVisited`. Level is **derived**, not stored: `getLevel()` computes `floor(xp / 150) + 1`, uncapped. At a ~25 XP/lesson average across 75 lessons (~1,875 XP total), this comfortably spans well past level 10 without hitting an artificial ceiling — no rescaling needed for the 75-lesson target.
- **`lessonStore.js`** — currently just companion expression + dialogue, and only for one mascot. Still needs: current lesson, current phase (1–6, not 1–3), attempt count, last result, user-placed blocks, dialogue line index, hints shown, and support for driving two twins' expressions/dialogue independently. This is the real gap — the phase state machine described in the original build guide doesn't exist yet.
- **`audioStore.js`** — stub, not started. Will hold Transport state, BPM, playback status once `audioEngine.js` exists.

---

## 8. Folder Structure

```
BlockBeats/
├── public/
│   ├── audio/            # drums, sample packs (lo-fi / EDM / hip-hop)
│   ├── sprites/          # twin portraits (melody-*.png, harmony-*.png) — not yet created
│   └── wallpapers/       # Shop-unlockable backgrounds
│
├── src/
│   ├── components/
│   │   ├── character/    # Companion.jsx — needs rebuild into twin-aware system
│   │   ├── blocks/       # BlockPalette, BlockItem, Timeline, DroppedBlock — stub
│   │   ├── lesson/       # LessonCanvas, PhaseIndicator, DialogueBox, HintSystem, BTSPanel — stub
│   │   ├── bts/          # BTSView, PianoRoll, WaveformView, EffectChain — stub, doubles as mini DAW UI
│   │   ├── ui/           # Sidebar, BottomBar, XPDisplay, DomainExpansion, TransportBar — stub
│   │   └── layout/       # AppLayout.jsx
│   │
│   ├── data/
│   │   ├── lessons/      # per-lesson JSON, organized unit1..unit6 — not started
│   │   ├── units.js      # unit + lesson-title index — 21/75 lessons drafted, full 75 locked (§3)
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

## 9. Build Order

Roughly the order that unblocks the most downstream work first:

1. **Audio foundation** — `audioEngine.js` (Tone.js singleton), `musicTheoryEngine.js` (chords/scales/progressions), wire a single chord to play on a button click.
2. **Blocks + DnD** — block type definitions, palette, timeline as a drop target, basic exact-match validation.
3. **Twins + lesson state machine** — rebuild `Companion.jsx` into the Melody/Harmony twin system (§5), rework `lessonStore` (or a sibling store) to track the 6-phase structure (§3) plus attempts/blocks, then wire `LessonCanvas`, `DialogueBox`, `PhaseIndicator`, `HintSystem` against it.
4. **First real lesson** — pick one lesson from Unit 1, write its JSON across all 6 phases, get it working end-to-end with real audio, both twins, and real Test validation. This is the proof that the whole pipeline works before scaling to 75.
5. **BTS / mini DAW** — Konva renderers, starting with `PianoRoll` (chord/melody) and `WaveformView` (drums), built with both lesson-scoped and free-play modes in mind from the start (§4). `EffectChain` comes with Unit 6 mechanics.
6. **UI theme pass** — ink-wash textures/SVG assets, neon glow CSS, brushstroke typography (§6) applied across the app shell, sidebar, dialogue boxes, and transport bar.
7. **Progression polish** — Domain Expansion, twin sprite integration into Shop-driven cosmetics, Shop wiring.
8. **Content** — the other 74 lesson JSONs (both twins' dialogue for each), the 8 twin portrait PNGs, audio presets.

---

## 10. Contributing

Read the actual source before writing new code — several things here (stores, companion naming, XP formula) have already drifted from earlier planning docs, and this README reflects the current real state, not the original pitch. Favor incremental patches over rewrites. Architecture/design discussion before implementation, always.