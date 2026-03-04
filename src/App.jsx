import { useState, useEffect, useRef, useCallback } from "react";

// ── Data ──
const BUILT_IN = [
  {
    id: "co2",
    name: "CO\u2082 Tolerance Table",
    desc: "Progressive breath holds with decreasing rest. Builds CO\u2082 tolerance and mental resilience.",
    target: "Controlled Pauses",
    diff: "Advanced",
    rounds: [
      { p: "Inhale", d: 4 },{ p: "Hold", d: 30 },{ p: "Exhale", d: 6 },{ p: "Rest", d: 120 },
      { p: "Inhale", d: 4 },{ p: "Hold", d: 30 },{ p: "Exhale", d: 6 },{ p: "Rest", d: 100 },
      { p: "Inhale", d: 4 },{ p: "Hold", d: 30 },{ p: "Exhale", d: 6 },{ p: "Rest", d: 80 },
      { p: "Inhale", d: 4 },{ p: "Hold", d: 30 },{ p: "Exhale", d: 6 },{ p: "Rest", d: 60 },
      { p: "Inhale", d: 4 },{ p: "Hold", d: 30 },{ p: "Exhale", d: 6 },{ p: "Rest", d: 40 },
      { p: "Inhale", d: 4 },{ p: "Hold", d: 30 },{ p: "Exhale", d: 6 },{ p: "Rest", d: 20 },
      { p: "Inhale", d: 4 },{ p: "Hold", d: 30 },{ p: "Exhale", d: 6 },{ p: "Rest", d: 10 },
      { p: "Inhale", d: 4 },{ p: "Hold", d: 30 },{ p: "Exhale", d: 8 },
    ],
  },
  {
    id: "o2",
    name: "O\u2082 Depletion Table",
    desc: "Increasing breath holds with fixed rest. Trains performance under low oxygen.",
    target: "Controlled Pauses",
    diff: "Advanced+",
    rounds: [
      { p: "Inhale", d: 4 },{ p: "Hold", d: 30 },{ p: "Exhale", d: 6 },{ p: "Rest", d: 120 },
      { p: "Inhale", d: 4 },{ p: "Hold", d: 45 },{ p: "Exhale", d: 6 },{ p: "Rest", d: 120 },
      { p: "Inhale", d: 4 },{ p: "Hold", d: 60 },{ p: "Exhale", d: 6 },{ p: "Rest", d: 120 },
      { p: "Inhale", d: 4 },{ p: "Hold", d: 75 },{ p: "Exhale", d: 6 },{ p: "Rest", d: 120 },
      { p: "Inhale", d: 4 },{ p: "Hold", d: 90 },{ p: "Exhale", d: 6 },{ p: "Rest", d: 120 },
      { p: "Inhale", d: 4 },{ p: "Hold", d: 105 },{ p: "Exhale", d: 6 },{ p: "Rest", d: 120 },
      { p: "Inhale", d: 4 },{ p: "Hold", d: 120 },{ p: "Exhale", d: 8 },
    ],
  },
  {
    id: "dia",
    name: "Diaphragmatic Endurance Ladder",
    desc: "Escalating inhale/exhale ratios. Fatigues diaphragm and intercostals.",
    target: "Respiratory Musculature",
    diff: "Advanced",
    rounds: [
      { p: "Inhale", d: 6 },{ p: "Hold", d: 4 },{ p: "Exhale", d: 8 },{ p: "Hold", d: 4 },
      { p: "Inhale", d: 8 },{ p: "Hold", d: 6 },{ p: "Exhale", d: 10 },{ p: "Hold", d: 4 },
      { p: "Inhale", d: 10 },{ p: "Hold", d: 8 },{ p: "Exhale", d: 12 },{ p: "Hold", d: 4 },
      { p: "Inhale", d: 12 },{ p: "Hold", d: 10 },{ p: "Exhale", d: 15 },{ p: "Hold", d: 6 },
      { p: "Inhale", d: 14 },{ p: "Hold", d: 12 },{ p: "Exhale", d: 18 },{ p: "Hold", d: 8 },
      { p: "Inhale", d: 16 },{ p: "Hold", d: 14 },{ p: "Exhale", d: 20 },{ p: "Hold", d: 8 },
      { p: "Inhale", d: 6 },{ p: "Hold", d: 2 },{ p: "Exhale", d: 10 },
    ],
  },
  {
    id: "inter",
    name: "Intercostal Blaster",
    desc: "Rapid segmented breathing with holds at partial lung volumes.",
    target: "Respiratory Musculature",
    diff: "Advanced+",
    rounds: [
      { p: "Sip In", d: 2 },{ p: "Hold", d: 3 },{ p: "Sip In", d: 2 },{ p: "Hold", d: 3 },
      { p: "Sip In", d: 2 },{ p: "Hold", d: 3 },{ p: "Sip In", d: 2 },{ p: "Hold", d: 5 },
      { p: "Exhale", d: 12 },{ p: "Rest", d: 15 },
      { p: "Sip In", d: 2 },{ p: "Hold", d: 3 },{ p: "Sip In", d: 2 },{ p: "Hold", d: 3 },
      { p: "Sip In", d: 2 },{ p: "Hold", d: 3 },{ p: "Sip In", d: 2 },{ p: "Hold", d: 5 },
      { p: "Exhale", d: 12 },{ p: "Rest", d: 15 },
      { p: "Inhale", d: 6 },{ p: "Sip Out", d: 2 },{ p: "Hold", d: 3 },{ p: "Sip Out", d: 2 },
      { p: "Hold", d: 3 },{ p: "Sip Out", d: 2 },{ p: "Hold", d: 3 },{ p: "Sip Out", d: 2 },
      { p: "Hold", d: 5 },{ p: "Rest", d: 15 },
      { p: "Inhale", d: 6 },{ p: "Sip Out", d: 2 },{ p: "Hold", d: 3 },{ p: "Sip Out", d: 2 },
      { p: "Hold", d: 3 },{ p: "Sip Out", d: 2 },{ p: "Hold", d: 3 },{ p: "Sip Out", d: 2 },
      { p: "Hold", d: 5 },{ p: "Rest", d: 15 },
      { p: "Sip In", d: 2 },{ p: "Hold", d: 2 },{ p: "Sip In", d: 2 },{ p: "Hold", d: 2 },
      { p: "Sip In", d: 2 },{ p: "Hold", d: 4 },{ p: "Sip Out", d: 2 },{ p: "Hold", d: 2 },
      { p: "Sip Out", d: 2 },{ p: "Hold", d: 2 },{ p: "Sip Out", d: 2 },{ p: "Hold", d: 4 },
      { p: "Exhale", d: 8 },
    ],
  },
  {
    id: "vac",
    name: "Exhale Packing & Vacuum Hold",
    desc: "Extended exhales into residual volume with vacuum holds.",
    target: "Both",
    diff: "Elite",
    rounds: [
      { p: "Inhale", d: 5 },{ p: "Exhale", d: 10 },{ p: "Inhale", d: 5 },{ p: "Exhale", d: 10 },
      { p: "Inhale", d: 4 },{ p: "Max Exhale", d: 15 },{ p: "Empty Hold", d: 15 },{ p: "Recovery", d: 20 },
      { p: "Inhale", d: 4 },{ p: "Max Exhale", d: 15 },{ p: "Empty Hold", d: 20 },{ p: "Recovery", d: 20 },
      { p: "Inhale", d: 4 },{ p: "Max Exhale", d: 15 },{ p: "Empty Hold", d: 25 },{ p: "Recovery", d: 20 },
      { p: "Inhale", d: 4 },{ p: "Max Exhale", d: 15 },{ p: "Empty Hold", d: 30 },{ p: "Recovery", d: 25 },
      { p: "Inhale", d: 4 },{ p: "Max Exhale", d: 15 },{ p: "Empty Hold", d: 35 },{ p: "Recovery", d: 30 },
      { p: "Inhale", d: 5 },{ p: "Exhale", d: 10 },{ p: "Inhale", d: 5 },{ p: "Exhale", d: 10 },
    ],
  },
];

const PHASE_GROUPS = {
  standard: ["Inhale", "Exhale", "Hold", "Rest"],
  advanced: ["Sip In", "Sip Out", "Max Exhale", "Empty Hold", "Recovery"],
};

const PC = {
  Inhale: { bg: "#0a2a2a", r: "#4ecdc4", g: "rgba(78,205,196,.3)" },
  "Sip In": { bg: "#0a2a2a", r: "#4ecdc4", g: "rgba(78,205,196,.3)" },
  Exhale: { bg: "#2a0a1a", r: "#ff6b9d", g: "rgba(255,107,157,.3)" },
  "Max Exhale": { bg: "#2a0a1a", r: "#ff6b9d", g: "rgba(255,107,157,.3)" },
  "Sip Out": { bg: "#2a0a1a", r: "#ff6b9d", g: "rgba(255,107,157,.3)" },
  Hold: { bg: "#1a1a0a", r: "#ffd93d", g: "rgba(255,217,61,.3)" },
  "Empty Hold": { bg: "#2a1a0a", r: "#ff8c42", g: "rgba(255,140,66,.3)" },
  Rest: { bg: "#0a1a0a", r: "#95e87a", g: "rgba(149,232,122,.3)" },
  Recovery: { bg: "#0a1a0a", r: "#95e87a", g: "rgba(149,232,122,.3)" },
};

const PI = {
  Inhale: "Deep nasal inhale \u2014 expand belly then ribs",
  "Sip In": "Small nasal sip \u2014 stack air on top",
  Exhale: "Slow controlled exhale through pursed lips",
  "Max Exhale": "Push ALL air out \u2014 contract abs fully",
  "Sip Out": "Small controlled release \u2014 hold partial volume",
  Hold: "Seal airway \u2014 stay relaxed, no tension",
  "Empty Hold": "Hold empty \u2014 resist urge to inhale",
  Rest: "Breathe naturally \u2014 reset",
  Recovery: "Gentle nasal breathing \u2014 let system settle",
};

const BREATH_SCALE = {
  Inhale: { from: 0.6, to: 1.0 },
  "Sip In": { grow: 0.08 },
  Exhale: { from: 1.0, to: 0.6 },
  "Max Exhale": { from: 1.0, to: 0.4 },
  "Sip Out": { shrink: 0.08 },
  Hold: { hold: true },
  "Empty Hold": { hold: true },
  Rest: { from: 0.7, to: 0.85, breathe: true },
  Recovery: { from: 0.7, to: 0.85, breathe: true },
};

const DIFFICULTIES = [
  { label: "Light", mult: 0.6, color: "#95e87a" },
  { label: "Standard", mult: 1.0, color: "#4ecdc4" },
  { label: "Hard", mult: 1.3, color: "#ffd93d" },
  { label: "Brutal", mult: 1.6, color: "#ff6b9d" },
];

const SOUND_THEMES = [
  { id: "beeps", name: "Minimal", icon: "\u25C9" },
  { id: "bowls", name: "Bowls", icon: "\u25CE" },
  { id: "synth", name: "Synth", icon: "\u25C7" },
];

const IG_URL = "https://www.instagram.com/ryandobbeckofficial";
const defaultDurs = {
  Inhale: 4, Exhale: 6, Hold: 20, Rest: 30,
  "Sip In": 2, "Sip Out": 2, "Max Exhale": 15, "Empty Hold": 20, Recovery: 20,
};

// ── Zone highlight positions (angle in degrees on the orb, 0=top) ──
const ZONE_HIGHLIGHTS = {
  belly: { angle: 180, label: "Belly", color: "#4ecdc4" },
  lateral: { angle: 90, label: "Lateral Ribs", color: "#ffd93d", dual: true },
  posterior: { angle: 0, label: "Back", color: "#ff8c42" },
  chest: { angle: 0, label: "Upper Chest", color: "#a78bfa" },
  wave: { angle: null, label: "Full Wave", color: "#4ecdc4", wave: true },
};

const POSITION_DATA = {
  supine: { label: "Supine", short: "Lying face up" },
  prone: { label: "Prone", short: "Lying face down" },
  "left-lateral": { label: "Left Side", short: "Lying on left" },
  "right-lateral": { label: "Right Side", short: "Lying on right" },
  seated: { label: "Seated", short: "Upright seated" },
  standing: { label: "Standing", short: "Standing upright" },
  "guard-bottom": { label: "Guard Bottom", short: "Supine, knees up, weight on chest" },
  turtle: { label: "Turtle", short: "Prone, tucked tight" },
  clinch: { label: "Clinch", short: "Standing, arms locked high" },
  sprawl: { label: "Sprawl", short: "Prone, hips extended" },
  "wall-sit": { label: "Wall Sit", short: "Back against wall, thighs parallel" },
  plank: { label: "Plank", short: "Forearm plank hold" },
  "hollow-body": { label: "Hollow Body", short: "Supine, legs + shoulders raised" },
};

const POS_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "foundation", label: "Foundation" },
  { id: "zone", label: "Zone" },
  { id: "combat", label: "Combat" },
  { id: "combo", label: "Combo" },
];

const POS_CAT_COLORS = {
  foundation: "#4ecdc4",
  zone: "#ffd93d",
  combat: "#ff6b9d",
  combo: "#a78bfa",
};

// ── Positional Breathing Sessions ──
const POSITIONAL_SESSIONS = [
  // ─── FOUNDATION ───
  {
    id: "pos-supine-360", category: "foundation", name: "Supine 360\u00B0 Expansion",
    desc: "Master full ribcage expansion from the easiest position. Belly, ribs, back, chest, then integrate.",
    position: "supine", equipment: [],
    phases: [
      { p: "Inhale", d: 5, zone: "belly", via: "nose", cue: "Breathe into your belly \u2014 feel it rise toward the ceiling" },
      { p: "Exhale", d: 8, zone: "belly", via: "mouth", cue: "Slow exhale \u2014 belly sinks, ribs heavy on the floor" },
      { p: "Inhale", d: 5, zone: "belly", via: "nose", cue: "Again \u2014 belly rises, lower ribs widen" },
      { p: "Exhale", d: 8, zone: "belly", via: "mouth", cue: "Everything falls \u2014 passive, heavy" },
      { p: "Inhale", d: 5, zone: "lateral", via: "nose", cue: "Now expand sideways \u2014 ribs push out like an accordion" },
      { p: "Exhale", d: 8, zone: "lateral", via: "mouth", cue: "Ribs fall inward \u2014 squeeze everything out" },
      { p: "Inhale", d: 5, zone: "lateral", via: "nose", cue: "Wider \u2014 feel the stretch between each rib" },
      { p: "Exhale", d: 8, zone: "lateral", via: "mouth", cue: "Compress \u2014 let gravity help" },
      { p: "Inhale", d: 5, zone: "posterior", via: "nose", cue: "Breathe into your BACK \u2014 push the floor away" },
      { p: "Exhale", d: 8, zone: "posterior", via: "mouth", cue: "Melt into the ground \u2014 back ribs soften" },
      { p: "Inhale", d: 5, zone: "posterior", via: "nose", cue: "Back expands again \u2014 feel the floor pressure" },
      { p: "Exhale", d: 8, zone: "posterior", via: "mouth", cue: "Release completely" },
      { p: "Inhale", d: 5, zone: "chest", via: "nose", cue: "Fill the upper chest \u2014 collarbones lift" },
      { p: "Exhale", d: 8, zone: "chest", via: "mouth", cue: "Upper chest drops \u2014 sternum sinks" },
      { p: "Inhale", d: 6, zone: "wave", via: "nose", cue: "Full wave \u2014 belly, ribs, chest in one smooth roll" },
      { p: "Exhale", d: 10, zone: "wave", via: "mouth", cue: "Reverse wave \u2014 chest, ribs, belly deflate" },
      { p: "Inhale", d: 6, zone: "wave", via: "nose", cue: "Smooth wave \u2014 fill bottom to top" },
      { p: "Exhale", d: 10, zone: "wave", via: "mouth", cue: "Empty top to bottom \u2014 complete exhale" },
      { p: "Inhale", d: 6, zone: "wave", via: "nose", cue: "One more full wave \u2014 feel everything expand" },
      { p: "Exhale", d: 10, zone: "wave", via: "mouth", cue: "Let it all go" },
    ],
  },
  {
    id: "pos-prone-back", category: "foundation", name: "Prone Back Breathing",
    desc: "Forces posterior chain expansion. Your belly is blocked by the floor \u2014 breath has nowhere to go but your back.",
    position: "prone", equipment: [],
    phases: [
      { p: "Inhale", d: 5, zone: "posterior", via: "nose", cue: "Breathe into your back \u2014 feel your ribs lift off the floor" },
      { p: "Exhale", d: 8, zone: "posterior", via: "mouth", cue: "Sink into the ground \u2014 heavy and relaxed" },
      { p: "Inhale", d: 5, zone: "posterior", via: "nose", cue: "Back ribs expand \u2014 widen toward the ceiling" },
      { p: "Exhale", d: 8, zone: "posterior", via: "mouth", cue: "Melt down \u2014 let everything release" },
      { p: "Inhale", d: 6, zone: "posterior", via: "nose", cue: "Bigger \u2014 push more air into the back body" },
      { p: "Exhale", d: 10, zone: "posterior", via: "mouth", cue: "Long exhale \u2014 feel the floor against your belly" },
      { p: "Inhale", d: 6, zone: "posterior", via: "nose", cue: "Expand the entire back \u2014 lower ribs to shoulders" },
      { p: "Exhale", d: 10, zone: "posterior", via: "mouth", cue: "Slow and controlled \u2014 flatten back down" },
      { p: "Inhale", d: 7, zone: "posterior", via: "nose", cue: "Deep fill \u2014 back body inflates like a balloon" },
      { p: "Hold", d: 4, zone: "posterior", cue: "Hold \u2014 keep the back expanded" },
      { p: "Exhale", d: 12, zone: "posterior", via: "mouth", cue: "Longest exhale yet \u2014 squeeze everything out" },
      { p: "Rest", d: 10, cue: "Breathe naturally \u2014 notice how your back feels different" },
    ],
  },
  {
    id: "pos-lateral-series", category: "foundation", name: "Lateral Decubitus Series",
    desc: "Left side then right side. Trains asymmetric rib mobility \u2014 the top lung gets extra space to expand.",
    position: "left-lateral", equipment: [],
    phases: [
      { p: "Inhale", d: 5, zone: "lateral", via: "nose", position: "left-lateral", cue: "Right ribs expand toward ceiling \u2014 3 lobes filling up" },
      { p: "Exhale", d: 8, zone: "lateral", via: "mouth", position: "left-lateral", cue: "Right side collapses down \u2014 slow and controlled" },
      { p: "Inhale", d: 5, zone: "lateral", via: "nose", position: "left-lateral", cue: "Right lung opens wide \u2014 feel the asymmetry" },
      { p: "Exhale", d: 8, zone: "lateral", via: "mouth", position: "left-lateral", cue: "Everything deflates \u2014 right ribs fall" },
      { p: "Inhale", d: 6, zone: "lateral", via: "nose", position: "left-lateral", cue: "Bigger breath \u2014 right lung fills all three lobes" },
      { p: "Hold", d: 4, zone: "lateral", position: "left-lateral", cue: "Hold \u2014 feel the expansion on the right side" },
      { p: "Exhale", d: 10, zone: "lateral", via: "mouth", position: "left-lateral", cue: "Long exhale \u2014 complete deflation" },
      { p: "Rest", d: 8, position: "left-lateral", cue: "Natural breath \u2014 preparing to switch sides" },
      { p: "Rest", d: 5, position: "right-lateral", cue: "Switch to RIGHT SIDE \u2014 settle in" },
      { p: "Inhale", d: 5, zone: "lateral", via: "nose", position: "right-lateral", cue: "Left ribs expand toward ceiling \u2014 2 lobes filling" },
      { p: "Exhale", d: 8, zone: "lateral", via: "mouth", position: "right-lateral", cue: "Left side collapses \u2014 controlled" },
      { p: "Inhale", d: 5, zone: "lateral", via: "nose", position: "right-lateral", cue: "Left lung opens \u2014 notice it feels different from the right" },
      { p: "Exhale", d: 8, zone: "lateral", via: "mouth", position: "right-lateral", cue: "Deflate completely" },
      { p: "Inhale", d: 6, zone: "lateral", via: "nose", position: "right-lateral", cue: "Bigger \u2014 left lung, both lobes fully expanded" },
      { p: "Hold", d: 4, zone: "lateral", position: "right-lateral", cue: "Hold \u2014 left side expanded" },
      { p: "Exhale", d: 10, zone: "lateral", via: "mouth", position: "right-lateral", cue: "Long exhale \u2014 complete release" },
      { p: "Rest", d: 10, position: "right-lateral", cue: "Breathe naturally \u2014 compare both sides" },
    ],
  },
  {
    id: "pos-standing-activate", category: "foundation", name: "Standing Activation",
    desc: "Pre-training breath prep. Rapid zone cycling in standing position. Use before any workout.",
    position: "standing", equipment: [],
    phases: [
      { p: "Inhale", d: 4, zone: "belly", via: "nose", cue: "Belly breath \u2014 quick fill" },
      { p: "Exhale", d: 4, zone: "belly", via: "mouth", cue: "Sharp exhale \u2014 belly contracts" },
      { p: "Inhale", d: 4, zone: "lateral", via: "nose", cue: "Rib breath \u2014 expand sideways" },
      { p: "Exhale", d: 4, zone: "lateral", via: "mouth", cue: "Ribs in \u2014 compress" },
      { p: "Inhale", d: 4, zone: "posterior", via: "nose", cue: "Back breath \u2014 fill behind you" },
      { p: "Exhale", d: 4, zone: "posterior", via: "mouth", cue: "Release the back" },
      { p: "Inhale", d: 4, zone: "chest", via: "nose", cue: "Chest breath \u2014 collarbones up" },
      { p: "Exhale", d: 4, zone: "chest", via: "mouth", cue: "Drop the chest" },
      { p: "Inhale", d: 5, zone: "wave", via: "nose", cue: "Full wave \u2014 belly to chest" },
      { p: "Exhale", d: 8, zone: "wave", via: "mouth", cue: "Complete exhale \u2014 everything empties" },
      { p: "Inhale", d: 5, zone: "wave", via: "nose", cue: "Wave breath \u2014 smooth, continuous" },
      { p: "Exhale", d: 8, zone: "wave", via: "mouth", cue: "Long exhale \u2014 activate parasympathetic" },
      { p: "Inhale", d: 4, zone: "belly", via: "nose", cue: "Quick belly fill" },
      { p: "Hold", d: 5, zone: "belly", cue: "Hold \u2014 brace, feel the IAP" },
      { p: "Exhale", d: 6, zone: "belly", via: "mouth", cue: "Controlled release \u2014 you're activated" },
    ],
  },
  // ─── ZONE ISOLATION ───
  {
    id: "pos-posterior-opener", category: "zone", name: "Posterior Chain Opener",
    desc: "All posterior-focused. Prone + lateral positions. For people who can't back-breathe yet.",
    position: "prone", equipment: [],
    phases: [
      { p: "Inhale", d: 5, zone: "posterior", via: "nose", position: "prone", cue: "Breathe into your back \u2014 floor pushes against belly" },
      { p: "Exhale", d: 8, zone: "posterior", via: "mouth", position: "prone", cue: "Sink down \u2014 heavy" },
      { p: "Inhale", d: 6, zone: "posterior", via: "nose", position: "prone", cue: "Bigger \u2014 back body expands toward ceiling" },
      { p: "Exhale", d: 10, zone: "posterior", via: "mouth", position: "prone", cue: "Full exhale \u2014 flatten" },
      { p: "Inhale", d: 6, zone: "posterior", via: "nose", position: "prone", cue: "Fill the entire back \u2014 lower to upper" },
      { p: "Hold", d: 5, zone: "posterior", position: "prone", cue: "Hold \u2014 maintain back expansion" },
      { p: "Exhale", d: 10, zone: "posterior", via: "mouth", position: "prone", cue: "Longest exhale \u2014 complete deflation" },
      { p: "Rest", d: 5, position: "left-lateral", cue: "Roll to LEFT SIDE" },
      { p: "Inhale", d: 5, zone: "posterior", via: "nose", position: "left-lateral", cue: "Breathe into the back of your right ribs" },
      { p: "Exhale", d: 8, zone: "posterior", via: "mouth", position: "left-lateral", cue: "Let the back ribs fall" },
      { p: "Inhale", d: 6, zone: "posterior", via: "nose", position: "left-lateral", cue: "Posterior right side expands \u2014 feel it behind you" },
      { p: "Exhale", d: 10, zone: "posterior", via: "mouth", position: "left-lateral", cue: "Release" },
      { p: "Rest", d: 5, position: "right-lateral", cue: "Switch to RIGHT SIDE" },
      { p: "Inhale", d: 5, zone: "posterior", via: "nose", position: "right-lateral", cue: "Breathe into the back of your left ribs" },
      { p: "Exhale", d: 8, zone: "posterior", via: "mouth", position: "right-lateral", cue: "Let the back ribs fall" },
      { p: "Inhale", d: 6, zone: "posterior", via: "nose", position: "right-lateral", cue: "Posterior left side \u2014 expand behind you" },
      { p: "Exhale", d: 10, zone: "posterior", via: "mouth", position: "right-lateral", cue: "Complete release" },
    ],
  },
  {
    id: "pos-lateral-expander", category: "zone", name: "Lateral Rib Expander",
    desc: "Side-lying + seated lateral focus. Targets intercostals specifically for rib mobility.",
    position: "left-lateral", equipment: [],
    phases: [
      { p: "Inhale", d: 5, zone: "lateral", via: "nose", position: "left-lateral", cue: "Right ribs expand up \u2014 stretch the intercostals" },
      { p: "Exhale", d: 8, zone: "lateral", via: "mouth", position: "left-lateral", cue: "Ribs compress down" },
      { p: "Inhale", d: 6, zone: "lateral", via: "nose", position: "left-lateral", cue: "Wider \u2014 push the right ribs as far as they go" },
      { p: "Hold", d: 4, zone: "lateral", position: "left-lateral", cue: "Hold expanded \u2014 feel the stretch" },
      { p: "Exhale", d: 10, zone: "lateral", via: "mouth", position: "left-lateral", cue: "Slow deflation" },
      { p: "Rest", d: 5, position: "right-lateral", cue: "Switch to RIGHT SIDE" },
      { p: "Inhale", d: 5, zone: "lateral", via: "nose", position: "right-lateral", cue: "Left ribs expand up" },
      { p: "Exhale", d: 8, zone: "lateral", via: "mouth", position: "right-lateral", cue: "Compress down" },
      { p: "Inhale", d: 6, zone: "lateral", via: "nose", position: "right-lateral", cue: "Wider \u2014 push left ribs open" },
      { p: "Hold", d: 4, zone: "lateral", position: "right-lateral", cue: "Hold \u2014 maintain expansion" },
      { p: "Exhale", d: 10, zone: "lateral", via: "mouth", position: "right-lateral", cue: "Release" },
      { p: "Rest", d: 5, position: "seated", cue: "Sit up \u2014 SEATED position" },
      { p: "Inhale", d: 5, zone: "lateral", via: "nose", position: "seated", cue: "Both sides expand \u2014 ribs widen symmetrically" },
      { p: "Exhale", d: 8, zone: "lateral", via: "mouth", position: "seated", cue: "Ribs fall inward \u2014 notice the difference from side-lying" },
      { p: "Inhale", d: 6, zone: "lateral", via: "nose", position: "seated", cue: "Expand wide \u2014 hands on ribs, feel them push out" },
      { p: "Exhale", d: 10, zone: "lateral", via: "mouth", position: "seated", cue: "Complete compression" },
    ],
  },
  {
    id: "pos-wave-mastery", category: "zone", name: "Wave Breathing Mastery",
    desc: "Belly\u2192ribs\u2192chest as one continuous wave. Increasing speed. Supine then standing.",
    position: "supine", equipment: [],
    phases: [
      { p: "Inhale", d: 8, zone: "wave", via: "nose", position: "supine", cue: "Slow wave \u2014 belly... ribs... chest... smooth and continuous" },
      { p: "Exhale", d: 10, zone: "wave", via: "mouth", position: "supine", cue: "Reverse wave \u2014 chest drops, ribs fall, belly empties" },
      { p: "Inhale", d: 8, zone: "wave", via: "nose", position: "supine", cue: "Again \u2014 rolling wave, no pauses between zones" },
      { p: "Exhale", d: 10, zone: "wave", via: "mouth", position: "supine", cue: "Smooth reverse \u2014 like deflating from top down" },
      { p: "Inhale", d: 6, zone: "wave", via: "nose", position: "supine", cue: "Faster wave \u2014 same sequence, quicker" },
      { p: "Exhale", d: 8, zone: "wave", via: "mouth", position: "supine", cue: "Quick reverse" },
      { p: "Inhale", d: 6, zone: "wave", via: "nose", position: "supine", cue: "Smooth and faster" },
      { p: "Exhale", d: 8, zone: "wave", via: "mouth", position: "supine", cue: "Fluid reverse wave" },
      { p: "Rest", d: 5, position: "standing", cue: "Stand up \u2014 STANDING position" },
      { p: "Inhale", d: 6, zone: "wave", via: "nose", position: "standing", cue: "Standing wave \u2014 harder with gravity pulling down" },
      { p: "Exhale", d: 8, zone: "wave", via: "mouth", position: "standing", cue: "Reverse wave standing \u2014 control the descent" },
      { p: "Inhale", d: 5, zone: "wave", via: "nose", position: "standing", cue: "Quick wave \u2014 belly, ribs, chest, GO" },
      { p: "Exhale", d: 6, zone: "wave", via: "mouth", position: "standing", cue: "Fast reverse" },
      { p: "Inhale", d: 5, zone: "wave", via: "nose", position: "standing", cue: "One more \u2014 smooth, fast, complete" },
      { p: "Exhale", d: 8, zone: "wave", via: "mouth", position: "standing", cue: "Final long exhale \u2014 empty everything" },
    ],
  },
  // ─── COMBAT / SPORT ───
  {
    id: "pos-guard-survival", category: "combat", name: "Guard Bottom Survival",
    desc: "Breathing with anterior compression. Your belly and chest are loaded \u2014 use lateral and posterior expansion.",
    position: "guard-bottom", equipment: ["heavy bag or partner on chest"],
    phases: [
      { p: "Inhale", d: 4, zone: "posterior", via: "nose", cue: "Breathe into your BACK \u2014 belly is blocked by weight" },
      { p: "Hold", d: 3, zone: "posterior", cue: "Hold \u2014 stay calm, conserve energy" },
      { p: "Exhale", d: 6, zone: "lateral", via: "mouth", cue: "Controlled exhale \u2014 don't dump all air, they'll crush you" },
      { p: "Rest", d: 2, cue: "Quick recovery" },
      { p: "Inhale", d: 4, zone: "posterior", via: "nose", cue: "Back breathing \u2014 push the floor away" },
      { p: "Hold", d: 5, zone: "posterior", cue: "Longer hold \u2014 stay disciplined" },
      { p: "Exhale", d: 6, zone: "lateral", via: "mouth", cue: "Controlled release \u2014 don't gasp" },
      { p: "Rest", d: 2, cue: "Reset" },
      { p: "Inhale", d: 4, zone: "lateral", via: "nose", cue: "Lateral expansion \u2014 ribs push out sideways" },
      { p: "Hold", d: 7, zone: "lateral", cue: "Extended hold \u2014 this is the fight" },
      { p: "Exhale", d: 6, zone: "lateral", via: "mouth", cue: "Steady exhale \u2014 measured, not panicked" },
      { p: "Rest", d: 2, cue: "Recover" },
      { p: "Inhale", d: 4, zone: "posterior", via: "nose", cue: "Back body fills \u2014 one more round" },
      { p: "Hold", d: 10, zone: "posterior", cue: "Max hold \u2014 stay calm under pressure" },
      { p: "Exhale", d: 8, zone: "lateral", via: "mouth", cue: "Long controlled exhale \u2014 you survived" },
    ],
  },
  {
    id: "pos-clinch-breathing", category: "combat", name: "Clinch Breathing",
    desc: "Arms overhead or locked, shoulders elevated. Upper chest is restricted \u2014 must use lateral and posterior.",
    position: "clinch", equipment: [],
    phases: [
      { p: "Inhale", d: 4, zone: "lateral", via: "nose", cue: "Ribs expand sideways \u2014 shoulders are locked, can't use chest" },
      { p: "Exhale", d: 6, zone: "lateral", via: "mouth", cue: "Ribs compress \u2014 tight exhale" },
      { p: "Inhale", d: 4, zone: "posterior", via: "nose", cue: "Breathe into the back \u2014 expand behind you" },
      { p: "Exhale", d: 6, zone: "posterior", via: "mouth", cue: "Back deflates \u2014 controlled" },
      { p: "Inhale", d: 4, zone: "lateral", via: "nose", cue: "Lateral fill \u2014 quick, efficient" },
      { p: "Hold", d: 4, zone: "lateral", cue: "Hold \u2014 maintain position, stay tight" },
      { p: "Exhale", d: 6, zone: "lateral", via: "mouth", cue: "Release \u2014 don't drop your arms" },
      { p: "Inhale", d: 4, zone: "posterior", via: "nose", cue: "Back breathing \u2014 fast" },
      { p: "Hold", d: 6, zone: "posterior", cue: "Longer hold \u2014 arms still up" },
      { p: "Exhale", d: 6, zone: "posterior", via: "mouth", cue: "Controlled out \u2014 maintain structure" },
      { p: "Inhale", d: 3, zone: "lateral", via: "nose", cue: "Quick breath \u2014 fight pace" },
      { p: "Exhale", d: 4, zone: "lateral", via: "mouth", cue: "Quick out \u2014 keep fighting" },
      { p: "Inhale", d: 3, zone: "posterior", via: "nose", cue: "Snatch a breath \u2014 back body" },
      { p: "Exhale", d: 4, zone: "posterior", via: "mouth", cue: "Release \u2014 round over" },
    ],
  },
  {
    id: "pos-plank-control", category: "combat", name: "Plank Breath Control",
    desc: "Breathing while maintaining core brace. The diaphragm vs brace conflict \u2014 learn to do both.",
    position: "plank", equipment: [],
    phases: [
      { p: "Inhale", d: 4, zone: "lateral", via: "nose", cue: "Lateral breathing ONLY \u2014 keep core braced, ribs expand sideways" },
      { p: "Exhale", d: 6, zone: "lateral", via: "mouth", cue: "Ribs in \u2014 maintain brace through the exhale" },
      { p: "Inhale", d: 4, zone: "lateral", via: "nose", cue: "Side ribs expand \u2014 belly stays TIGHT" },
      { p: "Exhale", d: 6, zone: "lateral", via: "mouth", cue: "Controlled \u2014 don't lose position" },
      { p: "Inhale", d: 4, zone: "posterior", via: "nose", cue: "Back breathing \u2014 fill behind you, core stays locked" },
      { p: "Exhale", d: 6, zone: "posterior", via: "mouth", cue: "Back deflates \u2014 brace holds" },
      { p: "Inhale", d: 4, zone: "posterior", via: "nose", cue: "Breathe around the brace \u2014 not through it" },
      { p: "Hold", d: 5, zone: "posterior", cue: "Hold breath AND plank \u2014 max tension" },
      { p: "Exhale", d: 8, zone: "lateral", via: "mouth", cue: "Long exhale \u2014 maintain plank, don't collapse" },
      { p: "Rest", d: 5, cue: "Knees down briefly \u2014 natural breath" },
      { p: "Inhale", d: 4, zone: "lateral", via: "nose", cue: "Back up \u2014 lateral breath, core braced" },
      { p: "Hold", d: 8, zone: "lateral", cue: "Extended hold in plank \u2014 breathe around the brace" },
      { p: "Exhale", d: 8, zone: "lateral", via: "mouth", cue: "Long exhale \u2014 you made it" },
    ],
  },
  {
    id: "pos-turtle-recovery", category: "combat", name: "Turtle Recovery",
    desc: "Prone-tucked position. Extreme compression. Posterior-only breathing under maximum restriction.",
    position: "turtle", equipment: [],
    phases: [
      { p: "Inhale", d: 4, zone: "posterior", via: "nose", cue: "Only your back can expand \u2014 everything else is compressed" },
      { p: "Exhale", d: 6, zone: "posterior", via: "mouth", cue: "Slow exhale \u2014 don't panic" },
      { p: "Inhale", d: 4, zone: "posterior", via: "nose", cue: "Back ribs expand \u2014 push up toward ceiling" },
      { p: "Exhale", d: 6, zone: "posterior", via: "mouth", cue: "Controlled \u2014 stay tight, stay calm" },
      { p: "Inhale", d: 4, zone: "posterior", via: "nose", cue: "Posterior fill \u2014 it's all you've got" },
      { p: "Hold", d: 5, zone: "posterior", cue: "Hold \u2014 conserve, wait for your moment" },
      { p: "Exhale", d: 6, zone: "posterior", via: "mouth", cue: "Release \u2014 measured, disciplined" },
      { p: "Inhale", d: 3, zone: "posterior", via: "nose", cue: "Quick sip \u2014 fight pace" },
      { p: "Hold", d: 8, zone: "posterior", cue: "Long hold \u2014 this is where you build tolerance" },
      { p: "Exhale", d: 6, zone: "posterior", via: "mouth", cue: "Steady exhale" },
      { p: "Inhale", d: 3, zone: "posterior", via: "nose", cue: "Quick breath" },
      { p: "Hold", d: 10, zone: "posterior", cue: "Maximum hold in turtle \u2014 STAY CALM" },
      { p: "Exhale", d: 8, zone: "posterior", via: "mouth", cue: "Release \u2014 session complete" },
    ],
  },
  {
    id: "pos-wall-sit", category: "combat", name: "Wall Sit Endurance Breath",
    desc: "Sustained isometric hold + progressive breath work. Legs burn, breathing stays controlled.",
    position: "wall-sit", equipment: ["wall"],
    phases: [
      { p: "Inhale", d: 4, zone: "belly", via: "nose", cue: "Belly breath \u2014 ignore the legs, breathe deep" },
      { p: "Exhale", d: 6, zone: "belly", via: "mouth", cue: "Long exhale \u2014 relax into the burn" },
      { p: "Inhale", d: 4, zone: "belly", via: "nose", cue: "Steady belly fill" },
      { p: "Exhale", d: 6, zone: "belly", via: "mouth", cue: "Controlled \u2014 don't clench the jaw" },
      { p: "Inhale", d: 4, zone: "lateral", via: "nose", cue: "Ribs expand \u2014 stay in the wall sit" },
      { p: "Hold", d: 5, zone: "lateral", cue: "Hold breath AND position \u2014 legs will scream, you stay calm" },
      { p: "Exhale", d: 8, zone: "lateral", via: "mouth", cue: "Extended exhale \u2014 parasympathetic through the pain" },
      { p: "Inhale", d: 4, zone: "lateral", via: "nose", cue: "Refill \u2014 lateral expansion" },
      { p: "Hold", d: 8, zone: "lateral", cue: "Longer hold \u2014 breathe through it mentally" },
      { p: "Exhale", d: 8, zone: "lateral", via: "mouth", cue: "Long controlled release" },
      { p: "Inhale", d: 5, zone: "wave", via: "nose", cue: "Full wave \u2014 last effort" },
      { p: "Hold", d: 10, zone: "wave", cue: "Max hold in the wall sit \u2014 YOU vs YOUR MIND" },
      { p: "Exhale", d: 10, zone: "wave", via: "mouth", cue: "Stand up \u2014 longest exhale \u2014 you earned it" },
    ],
  },
  // ─── COMBOS ───
  {
    id: "pos-full-circuit", category: "combo", name: "Full Positional Circuit",
    desc: "Every position. Supine \u2192 prone \u2192 left \u2192 right \u2192 seated \u2192 standing. Complete respiratory mapping.",
    position: "supine", equipment: [],
    phases: [
      { p: "Inhale", d: 5, zone: "wave", via: "nose", position: "supine", cue: "Supine wave breath \u2014 baseline" },
      { p: "Exhale", d: 8, zone: "wave", via: "mouth", position: "supine", cue: "Full exhale lying down" },
      { p: "Inhale", d: 5, zone: "wave", via: "nose", position: "supine", cue: "One more supine" },
      { p: "Exhale", d: 8, zone: "wave", via: "mouth", position: "supine", cue: "Complete" },
      { p: "Rest", d: 5, position: "prone", cue: "Flip to PRONE \u2014 face down" },
      { p: "Inhale", d: 5, zone: "posterior", via: "nose", position: "prone", cue: "Prone \u2014 back breathing only" },
      { p: "Exhale", d: 8, zone: "posterior", via: "mouth", position: "prone", cue: "Melt into the floor" },
      { p: "Inhale", d: 5, zone: "posterior", via: "nose", position: "prone", cue: "Back body expands" },
      { p: "Exhale", d: 8, zone: "posterior", via: "mouth", position: "prone", cue: "Release" },
      { p: "Rest", d: 5, position: "left-lateral", cue: "Roll to LEFT SIDE" },
      { p: "Inhale", d: 5, zone: "lateral", via: "nose", position: "left-lateral", cue: "Right lung opens up" },
      { p: "Exhale", d: 8, zone: "lateral", via: "mouth", position: "left-lateral", cue: "Right side deflates" },
      { p: "Rest", d: 5, position: "right-lateral", cue: "Roll to RIGHT SIDE" },
      { p: "Inhale", d: 5, zone: "lateral", via: "nose", position: "right-lateral", cue: "Left lung opens up" },
      { p: "Exhale", d: 8, zone: "lateral", via: "mouth", position: "right-lateral", cue: "Left side deflates" },
      { p: "Rest", d: 5, position: "seated", cue: "Sit up \u2014 SEATED" },
      { p: "Inhale", d: 5, zone: "wave", via: "nose", position: "seated", cue: "Seated wave breath" },
      { p: "Exhale", d: 8, zone: "wave", via: "mouth", position: "seated", cue: "Notice how different this feels" },
      { p: "Rest", d: 3, position: "standing", cue: "Stand up \u2014 STANDING" },
      { p: "Inhale", d: 5, zone: "wave", via: "nose", position: "standing", cue: "Standing wave \u2014 final position" },
      { p: "Exhale", d: 8, zone: "wave", via: "mouth", position: "standing", cue: "Complete circuit \u2014 exhale everything" },
      { p: "Inhale", d: 5, zone: "wave", via: "nose", position: "standing", cue: "One more full breath" },
      { p: "Exhale", d: 10, zone: "wave", via: "mouth", position: "standing", cue: "Done \u2014 notice how your body maps differently in each position" },
    ],
  },
  {
    id: "pos-combat-ladder", category: "combo", name: "Combat Breath Ladder",
    desc: "Guard \u2192 turtle \u2192 clinch \u2192 plank with decreasing rest. Simulates fight-paced positional transitions.",
    position: "guard-bottom", equipment: [],
    phases: [
      { p: "Inhale", d: 4, zone: "posterior", via: "nose", position: "guard-bottom", cue: "Guard bottom \u2014 back breathe" },
      { p: "Hold", d: 5, zone: "posterior", position: "guard-bottom", cue: "Hold under pressure" },
      { p: "Exhale", d: 6, zone: "lateral", via: "mouth", position: "guard-bottom", cue: "Controlled exhale" },
      { p: "Rest", d: 8, position: "guard-bottom", cue: "Recover \u2014 natural breath" },
      { p: "Rest", d: 5, position: "turtle", cue: "TURTLE \u2014 tuck tight" },
      { p: "Inhale", d: 3, zone: "posterior", via: "nose", position: "turtle", cue: "Quick back breath \u2014 everything compressed" },
      { p: "Hold", d: 6, zone: "posterior", position: "turtle", cue: "Hold in turtle" },
      { p: "Exhale", d: 5, zone: "posterior", via: "mouth", position: "turtle", cue: "Exhale \u2014 controlled" },
      { p: "Rest", d: 6, position: "turtle", cue: "Shorter rest \u2014 recover fast" },
      { p: "Rest", d: 5, position: "clinch", cue: "Up to CLINCH \u2014 arms locked high" },
      { p: "Inhale", d: 3, zone: "lateral", via: "nose", position: "clinch", cue: "Lateral breath \u2014 shoulders locked" },
      { p: "Hold", d: 7, zone: "lateral", position: "clinch", cue: "Hold \u2014 arms stay up" },
      { p: "Exhale", d: 5, zone: "lateral", via: "mouth", position: "clinch", cue: "Release air \u2014 not arms" },
      { p: "Rest", d: 4, position: "clinch", cue: "Minimal rest \u2014 fight pace" },
      { p: "Rest", d: 5, position: "plank", cue: "Down to PLANK" },
      { p: "Inhale", d: 3, zone: "lateral", via: "nose", position: "plank", cue: "Lateral breath \u2014 core braced" },
      { p: "Hold", d: 8, zone: "lateral", position: "plank", cue: "MAX hold in plank \u2014 final effort" },
      { p: "Exhale", d: 8, zone: "lateral", via: "mouth", position: "plank", cue: "Long exhale \u2014 round complete" },
    ],
  },
  {
    id: "pos-prefight-prep", category: "combo", name: "Pre-Fight Prep",
    desc: "Standing activation \u2192 clinch breathing \u2192 guard survival \u2192 standing recovery. Full fight-ready sequence.",
    position: "standing", equipment: [],
    phases: [
      { p: "Inhale", d: 4, zone: "wave", via: "nose", position: "standing", cue: "Standing wave \u2014 activate" },
      { p: "Exhale", d: 6, zone: "wave", via: "mouth", position: "standing", cue: "Full exhale \u2014 clear the system" },
      { p: "Inhale", d: 4, zone: "belly", via: "nose", position: "standing", cue: "Belly fill \u2014 build IAP" },
      { p: "Hold", d: 4, zone: "belly", position: "standing", cue: "Brace \u2014 feel the pressure" },
      { p: "Exhale", d: 6, zone: "belly", via: "mouth", position: "standing", cue: "Release \u2014 activated" },
      { p: "Rest", d: 3, position: "clinch", cue: "CLINCH position \u2014 arms high" },
      { p: "Inhale", d: 3, zone: "lateral", via: "nose", position: "clinch", cue: "Lateral \u2014 quick and efficient" },
      { p: "Hold", d: 4, zone: "lateral", position: "clinch", cue: "Hold in clinch" },
      { p: "Exhale", d: 5, zone: "lateral", via: "mouth", position: "clinch", cue: "Controlled out" },
      { p: "Inhale", d: 3, zone: "posterior", via: "nose", position: "clinch", cue: "Back breath \u2014 quick" },
      { p: "Hold", d: 5, zone: "posterior", position: "clinch", cue: "Hold \u2014 stay tight" },
      { p: "Exhale", d: 5, zone: "posterior", via: "mouth", position: "clinch", cue: "Release" },
      { p: "Rest", d: 3, position: "guard-bottom", cue: "Down to GUARD BOTTOM" },
      { p: "Inhale", d: 3, zone: "posterior", via: "nose", position: "guard-bottom", cue: "Back breathe under pressure" },
      { p: "Hold", d: 6, zone: "posterior", position: "guard-bottom", cue: "Hold \u2014 survive" },
      { p: "Exhale", d: 6, zone: "lateral", via: "mouth", position: "guard-bottom", cue: "Controlled exhale" },
      { p: "Rest", d: 3, position: "standing", cue: "Back to STANDING \u2014 recovery" },
      { p: "Inhale", d: 5, zone: "wave", via: "nose", position: "standing", cue: "Recovery wave breath \u2014 slow, deep" },
      { p: "Exhale", d: 10, zone: "wave", via: "mouth", position: "standing", cue: "Extended exhale \u2014 parasympathetic shift" },
      { p: "Inhale", d: 5, zone: "wave", via: "nose", position: "standing", cue: "One more recovery breath" },
      { p: "Exhale", d: 10, zone: "wave", via: "mouth", position: "standing", cue: "Fight ready" },
    ],
  },
];

function fmt(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? m + ":" + String(r).padStart(2, "0") : "" + r;
}

function haptic(s) {
  try {
    if (navigator.vibrate) {
      if (s === "phase") navigator.vibrate([40, 30, 40]);
      else if (s === "tick") navigator.vibrate(15);
      else if (s === "done") navigator.vibrate([50, 40, 50, 40, 80]);
    }
  } catch (e) {}
}

function scaleRounds(rounds, mult) {
  return rounds.map((r) => {
    if (r.p === "Inhale" || r.p === "Sip In" || r.p === "Sip Out") return { ...r };
    return { ...r, d: Math.max(2, Math.round(r.d * mult)) };
  });
}

function getHRZone(hr, mx) {
  if (!hr || !mx) return null;
  const p = hr / mx;
  if (p < 0.5) return { zone: 1, color: "#95e87a" };
  if (p < 0.6) return { zone: 2, color: "#4ecdc4" };
  if (p < 0.7) return { zone: 3, color: "#ffd93d" };
  if (p < 0.8) return { zone: 4, color: "#ff8c42" };
  return { zone: 5, color: "#ff6b9d" };
}

// ── Hooks ──
function useSoundEngine() {
  const ctx = useRef(null);
  const theme = useRef("beeps");
  const unlocked = useRef(false);
  const getCtx = useCallback(() => {
    if (!ctx.current) ctx.current = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.current.state === "suspended") ctx.current.resume();
    return ctx.current;
  }, []);
  const unlock = useCallback(() => {
    if (unlocked.current) return;
    const c = getCtx();
    if (c.state === "suspended") c.resume();
    const buf = c.createBuffer(1, 1, 22050);
    const src = c.createBufferSource();
    src.buffer = buf;
    src.connect(c.destination);
    src.start(0);
    unlocked.current = true;
  }, [getCtx]);
  const playBeep = useCallback((f, d) => {
    try {
      const c = getCtx(), o = c.createOscillator(), g = c.createGain();
      o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(0.15, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d);
      o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + d);
    } catch (e) {}
  }, [getCtx]);
  const playBowl = useCallback((f, d) => {
    try {
      const c = getCtx();
      [1, 2.02, 3.01].forEach((h, i) => {
        const o = c.createOscillator(), g = c.createGain();
        o.type = "sine"; o.frequency.value = f * h;
        g.gain.setValueAtTime(0.12 / (i + 1), c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d * 1.5);
        o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + d * 1.5);
      });
    } catch (e) {}
  }, [getCtx]);
  const playSynth = useCallback((f, d) => {
    try {
      const c = getCtx();
      ["sine", "triangle"].forEach((t, i) => {
        const o = c.createOscillator(), g = c.createGain();
        o.type = t; o.frequency.value = f * (i === 1 ? 1.005 : 1);
        g.gain.setValueAtTime(0.1, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d * 1.2);
        o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + d * 1.2);
      });
    } catch (e) {}
  }, [getCtx]);
  const play = useCallback((f, d) => {
    const t = theme.current;
    if (t === "bowls") playBowl(f, d);
    else if (t === "synth") playSynth(f, d);
    else playBeep(f, d);
  }, [playBeep, playBowl, playSynth]);
  const phaseChange = useCallback(() => {
    play(theme.current === "bowls" ? 396 : 660, 0.2);
    setTimeout(() => play(theme.current === "bowls" ? 528 : 880, 0.25), 140);
  }, [play]);
  const countdown = useCallback(() => play(theme.current === "bowls" ? 264 : 440, 0.12), [play]);
  const countdownGo = useCallback(() => {
    play(660, 0.15); setTimeout(() => play(880, 0.2), 120);
  }, [play]);
  const complete = useCallback(() => {
    play(523, 0.2); setTimeout(() => play(659, 0.2), 180); setTimeout(() => play(784, 0.35), 360);
  }, [play]);
  return { setTheme: (t) => { theme.current = t; }, unlock, phaseChange, countdown, countdownGo, complete };
}

function useHeartRate() {
  const [hr, setHR] = useState(null);
  const [connected, setConnected] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(false);
  const charRef = useRef(null);
  const deviceRef = useRef(null);
  const historyRef = useRef([]);
  useEffect(() => { setSupported(!!navigator.bluetooth); }, []);
  const parseHR = useCallback((ev) => {
    const v = ev.target.value;
    const f = v.getUint8(0);
    const bpm = (f & 0x1) ? v.getUint16(1, true) : v.getUint8(1);
    if (bpm > 0 && bpm < 250) {
      setHR(bpm);
      historyRef.current.push({ bpm, time: Date.now() });
      if (historyRef.current.length > 3600) historyRef.current = historyRef.current.slice(-1800);
    }
  }, []);
  const connect = useCallback(async () => {
    if (!navigator.bluetooth) { setError("No Bluetooth"); return; }
    setConnecting(true); setError(null);
    try {
      const dev = await navigator.bluetooth.requestDevice({ filters: [{ services: ["heart_rate"] }] });
      deviceRef.current = dev;
      setDeviceName(dev.name || "HR Monitor");
      dev.addEventListener("gattserverdisconnected", () => { setConnected(false); setHR(null); });
      const srv = await dev.gatt.connect();
      const svc = await srv.getPrimaryService("heart_rate");
      const ch = await svc.getCharacteristic("heart_rate_measurement");
      charRef.current = ch;
      await ch.startNotifications();
      ch.addEventListener("characteristicvaluechanged", parseHR);
      setConnected(true);
    } catch (e) {
      if (e.name !== "NotFoundError") setError(e.message);
    }
    setConnecting(false);
  }, [parseHR]);
  const disconnect = useCallback(() => {
    try {
      if (charRef.current) {
        charRef.current.removeEventListener("characteristicvaluechanged", parseHR);
        charRef.current.stopNotifications().catch(() => {});
      }
      if (deviceRef.current && deviceRef.current.gatt.connected) deviceRef.current.gatt.disconnect();
    } catch (e) {}
    setConnected(false); setHR(null); setDeviceName("");
  }, [parseHR]);
  const getSessionStats = useCallback((st) => {
    const sd = historyRef.current.filter((h) => h.time >= st);
    if (!sd.length) return null;
    const b = sd.map((h) => h.bpm);
    return { avg: Math.round(b.reduce((a, v) => a + v, 0) / b.length), min: Math.min(...b), max: Math.max(...b), samples: b.length, data: sd };
  }, []);
  const clearHistory = useCallback(() => { historyRef.current = []; }, []);
  return { hr, connected, deviceName, connecting, error, supported, connect, disconnect, getSessionStats, clearHistory };
}

function useProgress() {
  const [records, setRecords] = useState({});
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("dts-progress");
        if (r && r.value) setRecords(JSON.parse(r.value));
      } catch (e) {}
    })();
  }, []);
  const saveSession = useCallback(async (exId, dl, stats) => {
    setRecords((prev) => {
      const k = exId + "-" + dl;
      const ex = prev[k];
      const best = ex ? Math.max(ex.longestHold, stats.longestHold) : stats.longestHold;
      const sess = ex ? ex.sessions + 1 : 1;
      const upd = { ...prev, [k]: { longestHold: best, sessions: sess } };
      try { window.storage.set("dts-progress", JSON.stringify(upd)); } catch (e) {}
      return upd;
    });
  }, []);
  const getRecord = useCallback((exId, dl) => records[exId + "-" + dl] || null, [records]);
  return { saveSession, getRecord };
}

function useCustomExercises() {
  const [customs, setCustoms] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("dts-custom");
        if (r && r.value) setCustoms(JSON.parse(r.value));
      } catch (e) {}
    })();
  }, []);
  const addExercise = useCallback((ex) => {
    setCustoms((prev) => {
      const upd = [...prev, { ...ex, id: "custom-" + Date.now(), custom: true }];
      try { window.storage.set("dts-custom", JSON.stringify(upd)); } catch (e) {}
      return upd;
    });
  }, []);
  const updateExercise = useCallback((id, ex) => {
    setCustoms((prev) => {
      const upd = prev.map((e) => (e.id === id ? { ...e, ...ex } : e));
      try { window.storage.set("dts-custom", JSON.stringify(upd)); } catch (e) {}
      return upd;
    });
  }, []);
  const deleteExercise = useCallback((id) => {
    setCustoms((prev) => {
      const upd = prev.filter((e) => e.id !== id);
      try { window.storage.set("dts-custom", JSON.stringify(upd)); } catch (e) {}
      return upd;
    });
  }, []);
  return { customs, addExercise, updateExercise, deleteExercise };
}

// ── Components ──
function HRSparkline({ data, width = 120, height = 32 }) {
  if (!data || data.length < 2) return null;
  const rec = data.slice(-60);
  const bpms = rec.map((d) => d.bpm);
  const mn = Math.min(...bpms), mx = Math.max(...bpms), rng = mx - mn || 1;
  const pts = bpms.map((b, i) => `${(i / (bpms.length - 1)) * width},${height - ((b - mn) / rng) * (height - 4) - 2}`).join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke="#ff6b9d" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

function HRBadge({ hr, maxHR }) {
  const zone = getHRZone(hr, maxHR);
  return (
    <div className="lg-glass-sm" style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 100 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill={zone?.color || "#ff6b9d"} style={{ animation: "hrPulse 1s ease-in-out infinite" }}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "#fff", minWidth: 32, textAlign: "right" }}>{hr}</span>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,.4)", letterSpacing: 1 }}>BPM</span>
      {zone && <span style={{ fontSize: 9, color: zone.color, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>Z{zone.zone}</span>}
    </div>
  );
}

// ══════════════════════════════════
// ── MAIN APP WITH LIQUID GLASS ──
// ══════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("menu");
  const [selEx, setSelEx] = useState(null);
  const [diffIdx, setDiffIdx] = useState(1);
  const [soundIdx, setSoundIdx] = useState(0);
  const [maxHR, setMaxHR] = useState(190);
  const [si, setSi] = useState(0);
  const [tr, setTr] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  const [bScale, setBScale] = useState(0.7);
  const [stats, setStats] = useState(null);
  const [hrStats, setHRStats] = useState(null);
  const [scaledRounds, setScaledRounds] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [cdCount, setCdCount] = useState(3);
  const [bName, setBName] = useState("");
  const [bPhases, setBPhases] = useState([]);
  const [bSelPhase, setBSelPhase] = useState("Inhale");
  const [bDur, setBDur] = useState(4);
  const [bEditId, setBEditId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [menuTab, setMenuTab] = useState("protocols"); // "protocols" | "positional"
  const [posCat, setPosCat] = useState("all");
  const [posMode, setPosMode] = useState(false); // true when running a positional session
  const [posAlert, setPosAlert] = useState(null); // position change alert text

  const iv = useRef(null);
  const startT = useRef(null);
  const bRef = useRef(0.7);
  const siRef = useRef(0);
  const trRef = useRef(0);
  const roundsRef = useRef([]);
  const runRef = useRef(false);
  const pauseRef = useRef(false);
  const sound = useSoundEngine();
  const { saveSession, getRecord } = useProgress();
  const hrm = useHeartRate();
  const { customs, addExercise, updateExercise, deleteExercise } = useCustomExercises();
  const selExRef = useRef(null);
  const diffIdxRef = useRef(1);
  const soundRef = useRef(sound);
  const hrmRef = useRef(hrm);

  useEffect(() => { selExRef.current = selEx; }, [selEx]);
  useEffect(() => { diffIdxRef.current = diffIdx; }, [diffIdx]);
  useEffect(() => { soundRef.current = sound; }, [sound]);
  useEffect(() => { hrmRef.current = hrm; }, [hrm]);
  useEffect(() => { sound.setTheme(SOUND_THEMES[soundIdx].id); }, [soundIdx, sound]);

  const allExercises = [...BUILT_IN, ...customs];

  const computeStats = useCallback((rounds) => {
    let tH = 0, lH = 0, tI = 0, tO = 0;
    rounds.forEach((r) => {
      if (r.p === "Hold" || r.p === "Empty Hold") { tH += r.d; lH = Math.max(lH, r.d); }
      if (r.p === "Inhale" || r.p === "Sip In") tI += r.d;
      if (r.p === "Exhale" || r.p === "Max Exhale" || r.p === "Sip Out") tO += r.d;
    });
    const el = startT.current ? Math.round((Date.now() - startT.current) / 1000) : 0;
    return { totalTime: rounds.reduce((a, r) => a + r.d, 0), totalHold: tH, longestHold: lH, totalIn: tI, totalOut: tO, elapsed: el, phases: rounds.length };
  }, []);

  // Breathing animation
  useEffect(() => {
    if (!running || paused || !scaledRounds.length) return;
    const cs = scaledRounds[si];
    if (!cs) return;
    const bs = BREATH_SCALE[cs.p];
    if (!bs) return;
    let raf;
    const st = Date.now(), dur = cs.d * 1000, ss = bRef.current;
    const anim = () => {
      const t = Math.min((Date.now() - st) / dur, 1);
      let s = ss;
      if (bs.breathe) {
        const c = (Math.sin(t * Math.PI * 4 - Math.PI / 2) + 1) / 2;
        s = bs.from + (bs.to - bs.from) * c;
      } else if (bs.from != null && bs.to != null) {
        const ea = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        s = ss + (bs.to - ss) * ea;
      } else if (bs.grow) s = Math.min(ss + bs.grow * t, 1.0);
      else if (bs.shrink) s = Math.max(ss - bs.shrink * t, 0.4);
      bRef.current = s;
      setBScale(s);
      if (t < 1) raf = requestAnimationFrame(anim);
    };
    raf = requestAnimationFrame(anim);
    return () => cancelAnimationFrame(raf);
  }, [running, paused, si, scaledRounds]);

  // Timer tick
  useEffect(() => { runRef.current = running; pauseRef.current = paused; }, [running, paused]);
  useEffect(() => {
    if (!running || paused || !scaledRounds.length) { clearInterval(iv.current); return; }
    const rounds = roundsRef.current;
    const tick = () => {
      if (!runRef.current || pauseRef.current) return;
      const cur = trRef.current;
      if (cur <= 1) {
        const nx = siRef.current + 1;
        if (nx >= rounds.length) {
          clearInterval(iv.current);
          runRef.current = false;
          setRunning(false);
          setDone(true);
          const st = computeStats(rounds);
          setStats(st);
          if (hrmRef.current.connected && startT.current) setHRStats(hrmRef.current.getSessionStats(startT.current));
          if (selExRef.current) saveSession(selExRef.current.id, DIFFICULTIES[diffIdxRef.current].label, st);
          soundRef.current.complete();
          haptic("done");
          return;
        }
        siRef.current = nx;
        trRef.current = rounds[nx].d;
        setSi(nx);
        setTr(rounds[nx].d);
        soundRef.current.phaseChange();
        haptic("phase");
      } else {
        if (cur >= 2 && cur <= 4) { soundRef.current.countdown(); haptic("tick"); }
        trRef.current = cur - 1;
        setTr(cur - 1);
      }
    };
    iv.current = setInterval(tick, 1000);
    return () => clearInterval(iv.current);
  }, [running, paused, scaledRounds, computeStats, saveSession]);

  // Position change detection for positional sessions
  useEffect(() => {
    if (!posMode || !running || !scaledRounds.length) return;
    const cur = scaledRounds[si];
    const prev = si > 0 ? scaledRounds[si - 1] : null;
    if (!cur || !prev) return;
    const curPos = cur.position || selExRef.current?.sessionPosition;
    const prevPos = prev.position || selExRef.current?.sessionPosition;
    if (curPos && prevPos && curPos !== prevPos) {
      const pd = POSITION_DATA[curPos];
      setPosAlert(pd ? pd.label.toUpperCase() : curPos.toUpperCase());
      setTimeout(() => setPosAlert(null), 4000);
    }
  }, [si, posMode, running, scaledRounds]);

  // Countdown screen
  useEffect(() => {
    if (screen !== "countdown") return;
    let count = 3;
    let cancelled = false;
    setCdCount(3);
    soundRef.current.countdown();
    haptic("tick");
    const cdIv = setInterval(() => {
      if (cancelled) return;
      count--;
      if (count > 0) {
        setCdCount(count);
        soundRef.current.countdown();
        haptic("tick");
      } else {
        clearInterval(cdIv);
        setCdCount(0);
        soundRef.current.countdownGo();
        haptic("phase");
        setTimeout(() => {
          if (cancelled) return;
          const ex = selExRef.current;
          if (!ex) return;
          const sr = scaleRounds(ex.rounds, DIFFICULTIES[diffIdxRef.current].mult);
          roundsRef.current = sr;
          siRef.current = 0;
          trRef.current = sr[0].d;
          setScaledRounds(sr);
          setSi(0);
          setTr(sr[0].d);
          setRunning(true);
          setPaused(false);
          setDone(false);
          setStats(null);
          setHRStats(null);
          setBScale(0.6);
          bRef.current = 0.6;
          startT.current = Date.now();
          runRef.current = true;
          pauseRef.current = false;
          hrmRef.current.clearHistory();
          setScreen("timer");
          soundRef.current.phaseChange();
          haptic("phase");
        }, 600);
      }
    }, 1000);
    return () => { cancelled = true; clearInterval(cdIv); };
  }, [screen]);

  function selectExercise(ex) { sound.unlock(); setPosMode(false); setSelEx(ex); setScreen("preview"); }
  function selectPositional(sess) {
    sound.unlock();
    setPosMode(true);
    // Map positional session to exercise format for the timer engine
    const ex = {
      id: sess.id, name: sess.name, desc: sess.desc,
      target: "Positional", diff: sess.category,
      rounds: sess.phases.map(ph => ({ ...ph })),
      positional: true, sessionPosition: sess.position, category: sess.category,
      equipment: sess.equipment,
    };
    setSelEx(ex);
    setScreen("preview");
  }
  function beginCountdown() { sound.unlock(); setScreen("countdown"); }
  function stop() { clearInterval(iv.current); runRef.current = false; pauseRef.current = false; setRunning(false); setPaused(false); setDone(false); setStats(null); setHRStats(null); setPosAlert(null); if (posMode) setMenuTab("positional"); setScreen("menu"); }
  function backToMenu() { if (posMode) setMenuTab("positional"); setScreen("menu"); }
  function togglePause() { setPaused((p) => { const np = !p; pauseRef.current = np; return np; }); }
  function openBuilder(editEx) {
    if (editEx) { setBEditId(editEx.id); setBName(editEx.name); setBPhases(editEx.rounds.map((r, i) => ({ ...r, key: i }))); }
    else { setBEditId(null); setBName(""); setBPhases([]); }
    setBSelPhase("Inhale"); setBDur(4); setScreen("builder");
  }
  function addPhase() { setBPhases((prev) => [...prev, { p: bSelPhase, d: bDur, key: Date.now() }]); }
  function removePhase(key) { setBPhases((prev) => prev.filter((p) => p.key !== key)); }
  function movePhase(idx, dir) {
    setBPhases((prev) => { const a = [...prev]; const ni = idx + dir; if (ni < 0 || ni >= a.length) return a; [a[idx], a[ni]] = [a[ni], a[idx]]; return a; });
  }
  function duplicatePhase(idx) { setBPhases((prev) => { const a = [...prev]; a.splice(idx + 1, 0, { ...a[idx], key: Date.now() }); return a; }); }
  function updatePhaseDur(key, d) { setBPhases((prev) => prev.map((p) => (p.key === key ? { ...p, d } : p))); }
  function saveCustom() {
    if (!bName.trim() || bPhases.length < 2) return;
    const rounds = bPhases.map((p) => ({ p: p.p, d: p.d }));
    const ex = { name: bName.trim(), desc: "Custom protocol", target: "Custom", diff: "Custom", rounds };
    if (bEditId) updateExercise(bEditId, ex); else addExercise(ex);
    setScreen("menu");
  }
  function handleDeleteCustom(id) {
    if (confirmDelete === id) { deleteExercise(id); setConfirmDelete(null); }
    else { setConfirmDelete(id); setTimeout(() => setConfirmDelete(null), 3000); }
  }

  const cs = scaledRounds.length ? scaledRounds[si] : null;
  const ps = cs ? PC[cs.p] || PC.Hold : PC.Hold;
  const prog = cs ? 1 - tr / cs.d : 0;
  const circ = 2 * Math.PI * 120;
  const off = circ * (1 - prog);
  const diff = DIFFICULTIES[diffIdx];
  const record = selEx ? getRecord(selEx.id, diff.label) : null;
  const isNewBest = stats && record && stats.longestHold >= record.longestHold;
  const previewRounds = selEx ? scaleRounds(selEx.rounds, diff.mult) : [];
  const previewTotal = previewRounds.reduce((a, r) => a + r.d, 0);
  const previewHolds = previewRounds.filter((r) => r.p === "Hold" || r.p === "Empty Hold");
  const previewMaxHold = previewHolds.length ? Math.max(...previewHolds.map((r) => r.d)) : 0;
  const builderTotal = bPhases.reduce((a, p) => a + p.d, 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#050510 0%,#0a0a1a 30%,#0d0d20 60%,#080818 100%)",
      backgroundSize: "400% 400%",
      animation: "bgShift 30s ease infinite",
      fontFamily: "var(--font-mono)",
      color: "#e0e0e0",
      overflow: "hidden",
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        :root {
          --font-display: 'Space Grotesk', sans-serif;
          --font-mono: 'JetBrains Mono', 'SF Mono', monospace;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }

        /* ═══ LIQUID GLASS SYSTEM ═══ */
        .lg-glass {
          background: rgba(255,255,255,.03);
          backdrop-filter: blur(40px) saturate(1.8);
          -webkit-backdrop-filter: blur(40px) saturate(1.8);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 20px;
          box-shadow:
            0 8px 32px rgba(0,0,0,.4),
            inset 0 1px 0 rgba(255,255,255,.08),
            inset 0 -1px 0 rgba(255,255,255,.02);
          position: relative;
          overflow: hidden;
        }
        .lg-glass::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 10%, rgba(255,255,255,.1) 50%, transparent 90%);
          pointer-events: none;
        }
        .lg-glass-sm {
          background: rgba(255,255,255,.04);
          backdrop-filter: blur(24px) saturate(1.5);
          -webkit-backdrop-filter: blur(24px) saturate(1.5);
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 14px;
          box-shadow:
            0 4px 20px rgba(0,0,0,.25),
            inset 0 1px 0 rgba(255,255,255,.06);
        }
        .lg-glass-pill {
          background: rgba(255,255,255,.03);
          backdrop-filter: blur(16px) saturate(1.4);
          -webkit-backdrop-filter: blur(16px) saturate(1.4);
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 100px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.04);
        }
        .lg-glass-card {
          background: rgba(255,255,255,.025);
          backdrop-filter: blur(40px) saturate(1.8);
          -webkit-backdrop-filter: blur(40px) saturate(1.8);
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 24px;
          box-shadow:
            0 16px 64px rgba(0,0,0,.5),
            inset 0 1px 0 rgba(255,255,255,.1),
            inset 0 -1px 0 rgba(255,255,255,.02);
          position: relative;
          overflow: hidden;
        }
        .lg-glass-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.14), transparent);
          pointer-events: none;
        }
        .lg-glass-card::after {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(ellipse at 30% 20%, rgba(255,255,255,.03), transparent 50%);
          pointer-events: none;
        }
        .lg-glass-input {
          background: rgba(255,255,255,.03);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 14px;
          padding: 14px 18px;
          color: #fff;
          font-family: inherit;
          font-size: 14px;
          width: 100%;
          outline: none;
          transition: all .4s cubic-bezier(.4,0,.2,1);
          box-shadow: inset 0 2px 4px rgba(0,0,0,.15);
        }
        .lg-glass-input:focus {
          border-color: rgba(78,205,196,.35);
          box-shadow: inset 0 2px 4px rgba(0,0,0,.15), 0 0 24px rgba(78,205,196,.08);
        }
        .lg-glass-input::placeholder { color: rgba(255,255,255,.12); }

        /* ═══ ANIMATIONS ═══ */
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes glowPulse { 0%,100% { opacity:.3 } 50% { opacity:.7 } }
        @keyframes statPop { from { opacity:0; transform:scale(.9) translateY(10px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes hrPulse { 0%,100% { transform:scale(1) } 50% { transform:scale(1.15) } }
        @keyframes cdPop { 0% { transform:scale(0.3);opacity:0 } 50% { transform:scale(1.15);opacity:1 } 100% { transform:scale(1);opacity:1 } }
        @keyframes cdFade { 0% { opacity:1;transform:scale(1) } 100% { opacity:0;transform:scale(1.8) } }
        @keyframes bgShift { 0% { background-position:0% 50% } 50% { background-position:100% 50% } 100% { background-position:0% 50% } }
        @keyframes orbGlow { 0%,100% { opacity:.5; transform: scale(1) } 50% { opacity:.8; transform: scale(1.05) } }
        @keyframes glassShine { 0% { transform: translateX(-100%) rotate(15deg) } 100% { transform: translateX(300%) rotate(15deg) } }

        /* ═══ REDUCED MOTION SUPPORT ═══ */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        /* ═══ INTERACTIVE GLASS COMPONENTS ═══ */
        .ex-card {
          min-height: 44px;
          padding: 22px 26px;
          cursor: pointer;
          transition: all .4s cubic-bezier(.4,0,.2,1);
        }
        .ex-card:hover, .ex-card:active {
          border-color: rgba(78,205,196,.18) !important;
          transform: translateY(-2px);
          box-shadow: 0 16px 48px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.1), 0 0 50px rgba(78,205,196,.04);
        }
        .ex-card:focus-visible {
          outline: none;
          border-color: rgba(78,205,196,.3) !important;
          box-shadow: 0 0 0 3px rgba(78,205,196,.15), 0 16px 48px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.1);
        }
        .tag {
          display: inline-block;
          padding: 4px 11px;
          border-radius: 100px;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .5px;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .btn {
          min-height: 44px;
          min-width: 44px;
          padding: 14px 32px;
          border-radius: 14px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all .4s cubic-bezier(.4,0,.2,1);
          touch-action: manipulation;
          background: rgba(255,255,255,.03);
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          border: 1px solid rgba(255,255,255,.08);
          color: rgba(255,255,255,.8);
          box-shadow: 0 4px 16px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.06);
        }
        .btn:hover, .btn:active {
          border-color: rgba(78,205,196,.25);
          color: #4ecdc4;
          box-shadow: 0 4px 24px rgba(78,205,196,.08), inset 0 1px 0 rgba(255,255,255,.08);
          transform: translateY(-1px);
        }
        .btn:focus-visible {
          outline: none;
          border-color: rgba(78,205,196,.5);
          box-shadow: 0 0 0 3px rgba(78,205,196,.2), 0 4px 24px rgba(78,205,196,.08), inset 0 1px 0 rgba(255,255,255,.08);
        }
        .btn-sm { min-height: 44px; min-width: 44px; padding: 12px 20px; font-size: 11px; border-radius: 10px; }
        .btn-start {
          min-height: 44px;
          min-width: 44px;
          padding: 18px 56px;
          border: 1.5px solid rgba(78,205,196,.25);
          border-radius: 18px;
          background: rgba(78,205,196,.05);
          backdrop-filter: blur(24px) saturate(1.6);
          -webkit-backdrop-filter: blur(24px) saturate(1.6);
          color: #4ecdc4;
          font-family: inherit;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all .4s cubic-bezier(.4,0,.2,1);
          box-shadow: 0 8px 40px rgba(78,205,196,.08), inset 0 1px 0 rgba(78,205,196,.1);
          position: relative;
          overflow: hidden;
        }
        .btn-start::before {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(78,205,196,.08), transparent);
          animation: glassShine 4s ease-in-out infinite;
          pointer-events: none;
        }
        .btn-start:hover, .btn-start:active {
          background: rgba(78,205,196,.1);
          box-shadow: 0 12px 56px rgba(78,205,196,.15), inset 0 1px 0 rgba(78,205,196,.15);
          transform: scale(1.02);
        }
        .btn-start:focus-visible {
          outline: none;
          border-color: rgba(78,205,196,.6);
          box-shadow: 0 0 0 4px rgba(78,205,196,.25), 0 12px 56px rgba(78,205,196,.15), inset 0 1px 0 rgba(78,205,196,.15);
        }
        .dot { width: 6px; height: 6px; border-radius: 50%; transition: all .3s; flex-shrink: 0; }
        .phase-anim { animation: fadeUp .3s ease-out; }
        .pb-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 12px; border-radius: 100px; font-size: 10px; font-weight: 600;
          background: rgba(255,217,61,.08);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #ffd93d; letter-spacing: .5px;
          border: 1px solid rgba(255,217,61,.12);
        }
        .diff-pill {
          min-height: 44px;
          padding: 12px 20px; border-radius: 100px; font-size: 11px; font-weight: 600;
          letter-spacing: .5px; cursor: pointer; transition: all .4s cubic-bezier(.4,0,.2,1);
          border: 1px solid transparent; font-family: inherit;
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        }
        .diff-pill:hover { transform: translateY(-1px); }
        .diff-pill:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(78,205,196,.2);
        }
        .sound-pill {
          min-height: 44px;
          padding: 12px 18px; border-radius: 100px; font-size: 11px;
          cursor: pointer; transition: all .4s cubic-bezier(.4,0,.2,1);
          border: 1px solid transparent; font-family: inherit;
          display: flex; align-items: center; gap: 5px;
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        }
        .sound-pill:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(78,205,196,.2);
        }
        .ig-btn {
          min-height: 44px;
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; border-radius: 14px;
          background: linear-gradient(135deg, rgba(131,58,180,.6), rgba(253,29,29,.6), rgba(252,176,69,.6));
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          color: #fff; font-family: inherit; font-size: 12px; font-weight: 600;
          letter-spacing: .5px; text-decoration: none;
          transition: all .4s cubic-bezier(.4,0,.2,1);
          cursor: pointer; border: 1px solid rgba(255,255,255,.12);
          box-shadow: 0 4px 24px rgba(253,29,29,.15);
        }
        .ig-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 40px rgba(253,29,29,.25); }
        .ig-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(253,29,29,.3), 0 8px 40px rgba(253,29,29,.25);
        }
        .dur-btn {
          min-width: 44px; min-height: 44px; border-radius: 10px;
          background: rgba(255,255,255,.03);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,.06); color: rgba(255,255,255,.6);
          font-family: inherit; font-size: 14px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all .3s; box-shadow: inset 0 1px 0 rgba(255,255,255,.04);
        }
        .dur-btn:hover { border-color: rgba(78,205,196,.3); color: #4ecdc4; }
        .dur-btn:focus-visible {
          outline: none;
          border-color: rgba(78,205,196,.5);
          box-shadow: 0 0 0 3px rgba(78,205,196,.2), inset 0 1px 0 rgba(255,255,255,.04);
        }
        .act-btn {
          min-height: 44px; min-width: 44px;
          padding: 12px 16px; border-radius: 6px; border: none;
          background: transparent; color: rgba(255,255,255,.25);
          font-size: 11px; cursor: pointer; font-family: inherit; transition: all .2s;
        }
        .act-btn:hover { color: #fff; background: rgba(255,255,255,.05); }
        .act-btn:focus-visible {
          outline: none;
          color: #fff;
          box-shadow: 0 0 0 2px rgba(78,205,196,.2);
        }
        .b-phase-row {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 12px; border-radius: 12px;
          background: rgba(255,255,255,.015);
          border: 1px solid rgba(255,255,255,.04);
          transition: all .3s;
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        }
        .b-phase-row:hover { border-color: rgba(255,255,255,.08); background: rgba(255,255,255,.03); }
        /* ═══ POSITIONAL LAB ═══ */
        .menu-tab {
          min-height: 44px;
          padding: 12px 24px; border-radius: 12px; font-size: 12px; font-weight: 600;
          letter-spacing: 1px; text-transform: uppercase; cursor: pointer;
          border: 1px solid transparent; font-family: inherit; transition: all .3s;
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        }
        .menu-tab:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(78,205,196,.2);
        }
        .pos-card {
          min-height: 44px;
          padding: 18px 20px; cursor: pointer; transition: all .4s cubic-bezier(.4,0,.2,1);
        }
        .pos-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,.12); }
        .pos-card:focus-visible {
          outline: none;
          border-color: rgba(78,205,196,.3);
          box-shadow: 0 0 0 3px rgba(78,205,196,.15);
        }
        .pos-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px; border-radius: 100px; font-size: 9px; font-weight: 600;
          letter-spacing: 1px; text-transform: uppercase;
          border: 1px solid; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        }
        .zone-dot {
          width: 18px; height: 18px; border-radius: 50%; position: absolute;
          filter: blur(6px); pointer-events: none; transition: all .5s ease;
        }
        @keyframes posAlertIn { 0% { opacity: 0; transform: translate(-50%,-50%) scale(.8); } 100% { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        @keyframes posAlertOut { 0% { opacity: 1; transform: translate(-50%,-50%) scale(1); } 100% { opacity: 0; transform: translate(-50%,-50%) scale(.9); } }
        .pos-alert {
          position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%);
          z-index: 100; padding: 24px 48px; text-align: center;
          animation: posAlertIn .3s ease-out;
        }
        .via-icon { display: inline-flex; align-items: center; gap: 3px; font-size: 9px; letter-spacing: 1px; text-transform: uppercase; opacity: 0.4; }

        /* ═══ LOADING & EMPTY STATES ═══ */
        @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
        .skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,.02) 25%, rgba(255,255,255,.05) 50%, rgba(255,255,255,.02) 75%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
          border-radius: 12px;
        }
        .empty-state {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 48px 24px; text-align: center;
          background: rgba(255,255,255,.015);
          border: 1px dashed rgba(255,255,255,.06);
          border-radius: 16px;
        }
        .empty-state-icon {
          width: 64px; height: 64px; border-radius: 50%;
          background: rgba(78,205,196,.05);
          border: 2px dashed rgba(78,205,196,.15);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px; font-size: 28px; opacity: 0.4;
        }
        .empty-state-title {
          font-family: var(--font-display); font-size: 16px; font-weight: 600;
          color: rgba(255,255,255,.5); margin-bottom: 8px; letter-spacing: .5px;
        }
        .empty-state-desc {
          font-size: 13px; color: rgba(255,255,255,.25);
          line-height: 1.6; max-width: 320px;
        }

        @media(max-width:480px) {
          .timer-num { font-size: 48px !important; }
          .ring-wrap { width: 260px !important; height: 260px !important; }
        }
      `}</style>

      {/* ═══ AMBIENT GLASS ORBS ═══ */}
      <div style={{ position: "fixed", top: "-20%", left: "-10%", width: "50vw", height: "50vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(78,205,196,.04) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none", animation: "orbGlow 8s ease-in-out infinite" }} />
      <div style={{ position: "fixed", bottom: "-20%", right: "-10%", width: "60vw", height: "60vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,157,.03) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none", animation: "orbGlow 12s ease-in-out infinite 2s" }} />
      <div style={{ position: "fixed", top: "30%", right: "20%", width: "30vw", height: "30vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,217,61,.02) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none", animation: "orbGlow 10s ease-in-out infinite 4s" }} />

      {/* ═══════════════ MENU ═══════════════ */}
      {screen === "menu" && (
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px", animation: "fadeUp .5s ease-out", position: "relative", zIndex: 1 }}>
          {/* Brand header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div className="lg-glass-sm" style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(78,205,196,.06)", borderColor: "rgba(78,205,196,.15)" }}>
                <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
                  <defs><linearGradient id="dtsLogo" x1="24" y1="2" x2="24" y2="46" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#7af5ec"/><stop offset="100%" stopColor="#0a3d3a"/></linearGradient></defs>
                  <rect x="6" y="10" width="16" height="16" rx="6" fill="url(#dtsLogo)" opacity="0.75" transform="rotate(-8 14 18)"/>
                  <rect x="6" y="29" width="16" height="14" rx="6" fill="url(#dtsLogo)" opacity="0.5" transform="rotate(-4 14 36)"/>
                  <rect x="26" y="8" width="16" height="12" rx="5" fill="url(#dtsLogo)" opacity="0.8" transform="rotate(6 34 14)"/>
                  <rect x="26" y="22" width="16" height="9" rx="4" fill="url(#dtsLogo)" opacity="0.6" transform="rotate(4 34 26)"/>
                  <rect x="26" y="33" width="16" height="12" rx="5" fill="url(#dtsLogo)" opacity="0.42" transform="rotate(3 34 39)"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: 1, lineHeight: 1.2 }}>DOBBECK</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 9, fontWeight: 500, color: "rgba(78,205,196,.8)", letterSpacing: 3, textTransform: "uppercase" }}>Training Systems</div>
              </div>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 12, background: "linear-gradient(135deg, #fff 0%, rgba(78,205,196,.8) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Breathwork<br />Trainer
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.3)", lineHeight: 1.6, maxWidth: 400 }}>Controlled pause progression & respiratory muscle endurance protocols.</p>
          </div>

          {/* Tab switcher */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            <button className="menu-tab" onClick={() => setMenuTab("protocols")} style={{
              background: menuTab === "protocols" ? "rgba(78,205,196,.1)" : "rgba(255,255,255,.02)",
              color: menuTab === "protocols" ? "#4ecdc4" : "rgba(255,255,255,.3)",
              borderColor: menuTab === "protocols" ? "rgba(78,205,196,.2)" : "rgba(255,255,255,.05)",
            }}>Protocols</button>
            <button className="menu-tab" onClick={() => setMenuTab("positional")} style={{
              background: menuTab === "positional" ? "rgba(255,107,157,.1)" : "rgba(255,255,255,.02)",
              color: menuTab === "positional" ? "#ff6b9d" : "rgba(255,255,255,.3)",
              borderColor: menuTab === "positional" ? "rgba(255,107,157,.2)" : "rgba(255,255,255,.05)",
            }}>Positional Lab</button>
          </div>

          {menuTab === "protocols" && (<>

          {/* Settings glass container */}
          <div className="lg-glass-sm" style={{ padding: 18, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", letterSpacing: 2, textTransform: "uppercase" }}>Difficulty</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }} onClick={() => setShowSettings((s) => !s)}>Settings {showSettings ? "\u25B2" : "\u25BC"}</div>
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: showSettings ? 16 : 0, flexWrap: "wrap" }}>
              {DIFFICULTIES.map((d, i) => (
                <button key={d.label} className="diff-pill" onClick={() => setDiffIdx(i)} style={{
                  background: i === diffIdx ? d.color + "12" : "rgba(255,255,255,.02)",
                  color: i === diffIdx ? d.color : "rgba(255,255,255,.3)",
                  borderColor: i === diffIdx ? d.color + "30" : "rgba(255,255,255,.05)",
                  boxShadow: i === diffIdx ? `0 0 20px ${d.color}10` : "none",
                }}>{d.label}{d.mult !== 1 ? " " + d.mult + "x" : ""}</button>
              ))}
            </div>
            {showSettings && (
              <div style={{ animation: "fadeUp .2s ease-out", display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Sound</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {SOUND_THEMES.map((s, i) => (
                      <button key={s.id} className="sound-pill" onClick={() => { setSoundIdx(i); sound.unlock(); }} style={{
                        background: i === soundIdx ? "rgba(78,205,196,.08)" : "rgba(255,255,255,.02)",
                        color: i === soundIdx ? "#4ecdc4" : "rgba(255,255,255,.3)",
                        borderColor: i === soundIdx ? "rgba(78,205,196,.18)" : "rgba(255,255,255,.05)",
                      }}><span>{s.icon}</span>{s.name}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Heart Rate</div>
                  {!hrm.supported ? <div style={{ fontSize: 11, color: "rgba(255,255,255,.2)" }}>Bluetooth not available. Use Chrome/Edge or Bluefy on iOS.</div>
                    : hrm.connected ? <button className="btn btn-sm" style={{ borderColor: "rgba(255,107,157,.2)", color: "#ff6b9d" }} onClick={hrm.disconnect}>{hrm.deviceName}{hrm.hr ? " \u2014 " + hrm.hr + " BPM" : ""}</button>
                    : <button className="btn btn-sm" onClick={hrm.connect} disabled={hrm.connecting}>{hrm.connecting ? "Searching..." : "Connect HR Strap"}</button>}
                </div>
                {hrm.supported && (
                  <div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Max HR</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button className="dur-btn" onClick={() => setMaxHR((h) => Math.max(120, h - 5))}>{"\u2212"}</button>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 400, color: "#fff", minWidth: 40, textAlign: "center" }}>{maxHR}</span>
                      <button className="dur-btn" onClick={() => setMaxHR((h) => Math.min(220, h + 5))}>+</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Exercise cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {allExercises.map((ex) => {
              const rec = getRecord(ex.id, diff.label);
              const st = scaleRounds(ex.rounds, diff.mult).reduce((a, r) => a + r.d, 0);
              const isC = ex.custom;
              return (
                <div key={ex.id} className="lg-glass ex-card" onClick={() => selectExercise(ex)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, position: "relative", zIndex: 1 }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, color: "#fff", flex: 1 }}>{ex.name}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {isC && (
                        <div style={{ display: "flex", gap: 4 }} onClick={(e) => e.stopPropagation()}>
                          <button className="act-btn" onClick={() => openBuilder(ex)}>{"\u270E"}</button>
                          <button className="act-btn" onClick={() => handleDeleteCustom(ex.id)} style={{ color: confirmDelete === ex.id ? "#ff6b9d" : undefined }}>{confirmDelete === ex.id ? "\u2714" : "\u2716"}</button>
                        </div>
                      )}
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,.25)", whiteSpace: "nowrap" }}>{fmt(st)}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,.3)", lineHeight: 1.5, marginBottom: 12, position: "relative", zIndex: 1 }}>{ex.desc}</p>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
                    {isC ? (
                      <span className="tag" style={{ background: "rgba(78,205,196,.08)", color: "#4ecdc4", border: "1px solid rgba(78,205,196,.12)" }}>Custom</span>
                    ) : (
                      <>
                        <span className="tag" style={{
                          background: ex.target === "Controlled Pauses" ? "rgba(255,217,61,.08)" : ex.target === "Respiratory Musculature" ? "rgba(255,107,157,.08)" : "rgba(78,205,196,.08)",
                          color: ex.target === "Controlled Pauses" ? "#ffd93d" : ex.target === "Respiratory Musculature" ? "#ff6b9d" : "#4ecdc4",
                          border: `1px solid ${ex.target === "Controlled Pauses" ? "rgba(255,217,61,.12)" : ex.target === "Respiratory Musculature" ? "rgba(255,107,157,.12)" : "rgba(78,205,196,.12)"}`,
                        }}>{ex.target}</span>
                        <span className="tag" style={{
                          background: ex.diff === "Elite" ? "rgba(255,140,66,.08)" : "rgba(255,255,255,.03)",
                          color: ex.diff === "Elite" ? "#ff8c42" : "rgba(255,255,255,.4)",
                          border: `1px solid ${ex.diff === "Elite" ? "rgba(255,140,66,.12)" : "rgba(255,255,255,.06)"}`,
                        }}>{ex.diff}</span>
                      </>
                    )}
                    {rec && <span className="pb-badge">{"\u2605"} PB: {rec.longestHold}s · {rec.sessions}x</span>}
                  </div>
                </div>
              );
            })}
            {/* Create protocol card */}
            <div className="lg-glass ex-card" onClick={() => openBuilder(null)} style={{ borderStyle: "dashed", borderColor: "rgba(78,205,196,.12)", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "#4ecdc4", marginBottom: 4, position: "relative", zIndex: 1 }}>+</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "#4ecdc4", letterSpacing: 1, position: "relative", zIndex: 1 }}>Create Protocol</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.2)", marginTop: 4, position: "relative", zIndex: 1 }}>Build your own breathwork sequence</div>
            </div>
          </div>
          </>)}

          {/* ═══════════════ POSITIONAL LAB ═══════════════ */}
          {menuTab === "positional" && (
            <div>
              {/* Lab intro */}
              <div className="lg-glass-sm" style={{ padding: 18, marginBottom: 20 }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Respiratory Position Training</div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,.25)", lineHeight: 1.6 }}>Train breathing mechanics in specific body positions and under combat/sport stress. Each session targets where you direct your breath and challenges your respiratory control.</p>
              </div>
              {/* Category filter */}
              <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                {POS_CATEGORIES.map(cat => {
                  const ac = posCat === cat.id;
                  const cc = cat.id === "all" ? "#4ecdc4" : POS_CAT_COLORS[cat.id] || "#4ecdc4";
                  return (
                    <button key={cat.id} className="lg-glass-pill" onClick={() => setPosCat(cat.id)} style={{
                      padding: "6px 14px", fontSize: 11, fontWeight: ac ? 600 : 400, cursor: "pointer", fontFamily: "inherit",
                      color: ac ? cc : "rgba(255,255,255,.3)",
                      background: ac ? cc + "12" : "rgba(255,255,255,.02)",
                      borderColor: ac ? cc + "30" : "rgba(255,255,255,.05)",
                    }}>{cat.label}</button>
                  );
                })}
              </div>
              {/* Session cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {POSITIONAL_SESSIONS.filter(s => posCat === "all" || s.category === posCat).map(sess => {
                  const cc = POS_CAT_COLORS[sess.category] || "#4ecdc4";
                  const totalTime = sess.phases.reduce((a, p) => a + p.d, 0);
                  const zones = [...new Set(sess.phases.map(p => p.zone).filter(Boolean))];
                  const positions = [...new Set(sess.phases.map(p => p.position || sess.position).filter(Boolean))];
                  return (
                    <div key={sess.id} className="lg-glass pos-card" onClick={() => selectPositional(sess)}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, position: "relative", zIndex: 1 }}>
                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "#fff", flex: 1 }}>{sess.name}</h3>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,.25)", whiteSpace: "nowrap" }}>{fmt(totalTime)}</span>
                      </div>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,.25)", lineHeight: 1.5, marginBottom: 12, position: "relative", zIndex: 1 }}>{sess.desc}</p>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
                        <span className="pos-badge" style={{ background: cc + "10", color: cc, borderColor: cc + "20" }}>{sess.category}</span>
                        {positions.map(pos => (
                          <span key={pos} style={{ fontSize: 9, color: "rgba(255,255,255,.2)", letterSpacing: 1, textTransform: "uppercase" }}>{POSITION_DATA[pos]?.label || pos}</span>
                        ))}
                        <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,.15)" }}>
                          {zones.map(z => ZONE_HIGHLIGHTS[z]?.label || z).join(" \u00B7 ")}
                        </span>
                      </div>
                      {sess.equipment.length > 0 && (
                        <div style={{ marginTop: 8, fontSize: 10, color: "rgba(255,140,66,.4)", position: "relative", zIndex: 1 }}>
                          Needs: {sess.equipment.join(", ")}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: 40, paddingBottom: 32 }}>
            <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="ig-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              Follow @ryandobbeckofficial
            </a>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.1)", letterSpacing: 2, textTransform: "uppercase", marginTop: 16 }}>Dobbeck Training Systems</div>
          </div>
        </div>
      )}

      {/* ═══════════════ BUILDER ═══════════════ */}
      {screen === "builder" && (
        <div style={{ maxWidth: 540, margin: "0 auto", padding: "48px 24px", animation: "fadeUp .4s ease-out", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "rgba(78,205,196,.7)", marginBottom: 4 }}>{bEditId ? "Edit" : "Create"} Protocol</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "#fff" }}>Exercise Builder</h2>
            </div>
            <button className="btn btn-sm" onClick={backToMenu}>{"\u2190"} Back</button>
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Protocol Name</div>
            <input className="lg-glass-input" placeholder="e.g. Morning Breath Reset" value={bName} onChange={(e) => setBName(e.target.value)} maxLength={50} />
          </div>
          <div className="lg-glass-sm" style={{ padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Add Phase</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,.2)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Standard</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              {PHASE_GROUPS.standard.map((p) => {
                const c = PC[p]?.r;
                return (
                  <button key={p} className="lg-glass-pill" onClick={() => { setBSelPhase(p); setBDur(defaultDurs[p]); }} style={{
                    padding: "6px 12px", fontSize: 11, fontWeight: bSelPhase === p ? 600 : 400,
                    color: bSelPhase === p ? c : "rgba(255,255,255,.3)",
                    background: bSelPhase === p ? c + "10" : "rgba(255,255,255,.02)",
                    borderColor: bSelPhase === p ? c + "30" : "rgba(255,255,255,.05)",
                    cursor: "pointer", fontFamily: "inherit",
                  }}>{p}</button>
                );
              })}
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,.2)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Advanced</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {PHASE_GROUPS.advanced.map((p) => {
                const c = PC[p]?.r;
                return (
                  <button key={p} className="lg-glass-pill" onClick={() => { setBSelPhase(p); setBDur(defaultDurs[p]); }} style={{
                    padding: "6px 12px", fontSize: 11, fontWeight: bSelPhase === p ? 600 : 400,
                    color: bSelPhase === p ? c : "rgba(255,255,255,.3)",
                    background: bSelPhase === p ? c + "10" : "rgba(255,255,255,.02)",
                    borderColor: bSelPhase === p ? c + "30" : "rgba(255,255,255,.05)",
                    cursor: "pointer", fontFamily: "inherit",
                  }}>{p}</button>
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <button className="dur-btn" onClick={() => setBDur((d) => Math.max(1, d - 1))}>{"\u2212"}</button>
            <div style={{ textAlign: "center", minWidth: 60 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, color: "#fff" }}>{bDur}s</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,.25)", letterSpacing: 1, textTransform: "uppercase" }}>Duration</div>
            </div>
            <button className="dur-btn" onClick={() => setBDur((d) => Math.min(300, d + 1))}>+</button>
            <button className="dur-btn" onClick={() => setBDur((d) => Math.max(1, d - 5))} style={{ fontSize: 10 }}>-5</button>
            <button className="dur-btn" onClick={() => setBDur((d) => Math.min(300, d + 5))} style={{ fontSize: 10 }}>+5</button>
            <div style={{ flex: 1 }} />
            <button className="btn btn-sm" onClick={addPhase} style={{ borderColor: "rgba(78,205,196,.25)", color: "#4ecdc4" }}>+ Add</button>
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", letterSpacing: 2, textTransform: "uppercase" }}>Sequence ({bPhases.length})</div>
              <div style={{ fontSize: 12, color: "#4ecdc4", fontFamily: "var(--font-display)", fontWeight: 500 }}>Total: {fmt(builderTotal)}</div>
            </div>
            {bPhases.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">➕</div>
                <div className="empty-state-title">No phases yet</div>
                <div className="empty-state-desc">Select a breathing type above and tap "+ Add" to build your custom protocol</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 400, overflowY: "auto" }}>
                {bPhases.map((phase, idx) => {
                  const c = PC[phase.p]?.r || "#888";
                  return (
                    <div key={phase.key} className="b-phase-row">
                      <div style={{ width: 4, height: 28, borderRadius: 2, background: c, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 500, color: c }}>{phase.p}</div></div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <button className="dur-btn" style={{ width: 24, height: 24, fontSize: 12 }} onClick={() => updatePhaseDur(phase.key, Math.max(1, phase.d - 1))}>{"\u2212"}</button>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "#fff", minWidth: 30, textAlign: "center" }}>{phase.d}s</span>
                        <button className="dur-btn" style={{ width: 24, height: 24, fontSize: 12 }} onClick={() => updatePhaseDur(phase.key, Math.min(300, phase.d + 1))}>+</button>
                      </div>
                      <div style={{ display: "flex", gap: 2, marginLeft: 4 }}>
                        <button className="act-btn" onClick={() => movePhase(idx, -1)}>{"\u25B2"}</button>
                        <button className="act-btn" onClick={() => movePhase(idx, 1)}>{"\u25BC"}</button>
                        <button className="act-btn" onClick={() => duplicatePhase(idx)}>{"\u2750"}</button>
                        <button className="act-btn" onClick={() => removePhase(phase.key)} style={{ color: "rgba(255,107,157,.5)" }}>{"\u2716"}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn" onClick={backToMenu} style={{ flex: 1 }}>Cancel</button>
            <button className="btn-start" onClick={saveCustom} style={{
              flex: 1, opacity: bName.trim() && bPhases.length >= 2 ? 1 : 0.3,
              pointerEvents: bName.trim() && bPhases.length >= 2 ? "auto" : "none",
              fontSize: 14, padding: "14px 24px",
            }}>{bEditId ? "Save Changes" : "Save Protocol"}</button>
          </div>
        </div>
      )}

      {/* ═══════════════ PREVIEW ═══════════════ */}
      {screen === "preview" && selEx && (
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "48px 24px", animation: "fadeUp .4s ease-out", display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,.12)", marginBottom: 20 }}>Dobbeck Training Systems</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 8, lineHeight: 1.2 }}>{selEx.name}</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap", justifyContent: "center" }}>
            {selEx.positional ? (<>
              <span className="pos-badge" style={{ background: (POS_CAT_COLORS[selEx.category] || "#4ecdc4") + "10", color: POS_CAT_COLORS[selEx.category] || "#4ecdc4", borderColor: (POS_CAT_COLORS[selEx.category] || "#4ecdc4") + "20" }}>{selEx.category}</span>
              <span className="tag" style={{ background: "rgba(255,255,255,.04)", color: "rgba(255,255,255,.4)", border: "1px solid rgba(255,255,255,.08)" }}>{POSITION_DATA[selEx.sessionPosition]?.label || selEx.sessionPosition}</span>
            </>) : selEx.custom ? (
              <span className="tag" style={{ background: "rgba(78,205,196,.08)", color: "#4ecdc4", border: "1px solid rgba(78,205,196,.12)" }}>Custom</span>
            ) : (
              <span className="tag" style={{ background: "rgba(78,205,196,.08)", color: "#4ecdc4", border: "1px solid rgba(78,205,196,.12)" }}>{selEx.target}</span>
            )}
            <span className="tag" style={{ background: diff.color + "10", color: diff.color, border: `1px solid ${diff.color}22` }}>{diff.label}{diff.mult !== 1 ? " " + diff.mult + "x" : ""}</span>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.3)", lineHeight: 1.6, textAlign: "center", maxWidth: 360, marginBottom: 20 }}>{selEx.desc}</p>
          {selEx.positional && (() => {
            const zones = [...new Set(selEx.rounds.map(p => p.zone).filter(Boolean))];
            const positions = [...new Set(selEx.rounds.map(p => p.position || selEx.sessionPosition).filter(Boolean))];
            return (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
                {zones.length > 0 && (
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,.2)", letterSpacing: 1, textTransform: "uppercase" }}>Zones:</span>
                    {zones.map(z => {
                      const zh = ZONE_HIGHLIGHTS[z];
                      return <span key={z} style={{ fontSize: 10, color: zh?.color || "#4ecdc4", opacity: 0.7 }}>{zh?.label || z}</span>;
                    })}
                  </div>
                )}
                {positions.length > 1 && (
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,.2)", letterSpacing: 1, textTransform: "uppercase" }}>Positions:</span>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,.35)" }}>{positions.length}</span>
                  </div>
                )}
                {selEx.equipment?.length > 0 && (
                  <div style={{ fontSize: 10, color: "rgba(255,140,66,.5)" }}>Needs: {selEx.equipment.join(", ")}</div>
                )}
              </div>
            );
          })()}
          <div className="lg-glass-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, padding: 22, marginBottom: 32, width: "100%", maxWidth: 340 }}>
            <div style={{ textAlign: "center" }}><div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400, color: "#4ecdc4" }}>{fmt(previewTotal)}</div><div style={{ fontSize: 9, color: "rgba(255,255,255,.2)", letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>Duration</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400, color: "#ffd93d" }}>{previewMaxHold}s</div><div style={{ fontSize: 9, color: "rgba(255,255,255,.2)", letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>Max Hold</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400, color: "#ff6b9d" }}>{previewRounds.length}</div><div style={{ fontSize: 9, color: "rgba(255,255,255,.2)", letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>Phases</div></div>
          </div>
          {record && <div className="pb-badge" style={{ marginBottom: 24 }}>{"\u2605"} PB: {record.longestHold}s · {record.sessions} sessions</div>}
          {hrm.connected && hrm.hr && <div style={{ marginBottom: 24 }}><HRBadge hr={hrm.hr} maxHR={maxHR} /></div>}
          <button className="btn-start" onClick={beginCountdown}>Start</button>
          <button className="btn btn-sm" onClick={backToMenu} style={{ marginTop: 20, opacity: 0.5 }}>{"\u2190"} Back</button>
        </div>
      )}

      {/* ═══════════════ COUNTDOWN ═══════════════ */}
      {screen === "countdown" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "radial-gradient(ellipse at center, rgba(78,205,196,.03) 0%, transparent 50%)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,.2)", marginBottom: 40 }}>Get Ready</div>
          <div key={cdCount} style={{
            fontFamily: "var(--font-display)",
            fontSize: cdCount === 0 ? 32 : 96,
            fontWeight: cdCount === 0 ? 600 : 200,
            color: cdCount === 0 ? "#4ecdc4" : "#fff",
            animation: cdCount === 0 ? "cdFade .5s ease-out forwards" : "cdPop .5s ease-out",
            textShadow: cdCount > 0 ? "0 0 60px rgba(255,255,255,.1)" : "0 0 40px rgba(78,205,196,.3)",
          }}>{cdCount === 0 ? "GO" : cdCount}</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "rgba(255,255,255,.25)", marginTop: 40, letterSpacing: 2, textTransform: "uppercase" }}>{selEx?.name}</div>
        </div>
      )}

      {/* ═══════════════ TIMER ═══════════════ */}
      {screen === "timer" && selEx && (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          minHeight: "100vh", padding: 24,
          background: `radial-gradient(ellipse at center, ${ps.bg} 0%, transparent 50%)`,
          transition: "background 1.5s ease",
        }}>
          {/* Timer header */}
          <div style={{ position: "absolute", top: 24, left: 0, right: 0, textAlign: "center", zIndex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,.1)", marginBottom: 4 }}>Dobbeck Training Systems</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,.2)" }}>{selEx.name} <span style={{ color: diff.color }}>{diff.label}</span></div>
            {posMode && cs && (() => {
              const curPos = cs.position || selEx.sessionPosition;
              const pd = POSITION_DATA[curPos];
              return pd ? (
                <div className="lg-glass-pill" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", marginTop: 8, fontSize: 10, color: "rgba(255,255,255,.5)", letterSpacing: 1 }}>
                  <span style={{ fontSize: 8, opacity: 0.5 }}>{"\u25C9"}</span>
                  <span style={{ fontWeight: 600, color: "#fff", textTransform: "uppercase", letterSpacing: 1.5 }}>{pd.label}</span>
                  <span style={{ fontSize: 9, opacity: 0.35 }}>{pd.short}</span>
                </div>
              ) : null;
            })()}
          </div>
          {hrm.connected && hrm.hr && !done && <div style={{ position: "absolute", top: 60, right: 20, zIndex: 10 }}><HRBadge hr={hrm.hr} maxHR={maxHR} /></div>}

          {done && stats ? (
            /* ═══ COMPLETION CARD ═══ */
            <div style={{ textAlign: "center", animation: "fadeUp .5s ease-out", maxWidth: 380, width: "100%" }}>
              <div className="lg-glass-card" style={{ padding: "36px 28px", margin: "0 auto 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, justifyContent: "center", position: "relative", zIndex: 1 }}>
                  <div className="lg-glass-sm" style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(78,205,196,.06)", borderColor: "rgba(78,205,196,.15)" }}>
                    <svg width="14" height="14" viewBox="0 0 48 48" fill="none">
                      <defs><linearGradient id="dtsLogoSm" x1="24" y1="2" x2="24" y2="46" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#7af5ec"/><stop offset="100%" stopColor="#0a3d3a"/></linearGradient></defs>
                      <rect x="6" y="10" width="16" height="16" rx="6" fill="url(#dtsLogoSm)" opacity="0.75" transform="rotate(-8 14 18)"/>
                      <rect x="6" y="29" width="16" height="14" rx="6" fill="url(#dtsLogoSm)" opacity="0.5" transform="rotate(-4 14 36)"/>
                      <rect x="26" y="8" width="16" height="12" rx="5" fill="url(#dtsLogoSm)" opacity="0.8" transform="rotate(6 34 14)"/>
                      <rect x="26" y="22" width="16" height="9" rx="4" fill="url(#dtsLogoSm)" opacity="0.6" transform="rotate(4 34 26)"/>
                      <rect x="26" y="33" width="16" height="12" rx="5" fill="url(#dtsLogoSm)" opacity="0.42" transform="rotate(3 34 39)"/>
                    </svg>
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>DOBBECK TRAINING SYSTEMS</span>
                </div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 500, color: "#4ecdc4", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{selEx.name}</div>
                  <div style={{ fontSize: 11, color: diff.color, marginBottom: 20, letterSpacing: 1 }}>{diff.label}{diff.mult !== 1 ? " (" + diff.mult + "x)" : ""}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 200, color: "#fff", lineHeight: 1, marginBottom: 4, textShadow: "0 0 40px rgba(255,255,255,.1)" }}>{fmt(stats.elapsed)}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,.2)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 24 }}>Session Time</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
                    <div><div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 300, color: "#ffd93d" }}>{fmt(stats.totalHold)}</div><div style={{ fontSize: 9, color: "rgba(255,255,255,.18)", letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>Hold</div></div>
                    <div><div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 300, color: "#ff8c42" }}>{stats.longestHold}s</div><div style={{ fontSize: 9, color: "rgba(255,255,255,.18)", letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>Best</div></div>
                    <div><div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 300, color: "#ff6b9d" }}>{stats.phases}</div><div style={{ fontSize: 9, color: "rgba(255,255,255,.18)", letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>Phases</div></div>
                  </div>
                  {posMode && scaledRounds.length > 0 && (() => {
                    const zones = [...new Set(scaledRounds.map(r => r.zone).filter(Boolean))];
                    const positions = [...new Set(scaledRounds.map(r => r.position || selEx.sessionPosition).filter(Boolean))];
                    return zones.length > 0 ? (
                      <div style={{ marginBottom: 16, padding: "12px 0", borderTop: "1px solid rgba(255,255,255,.04)" }}>
                        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 8 }}>
                          {zones.map(z => {
                            const zh = ZONE_HIGHLIGHTS[z];
                            return <span key={z} style={{ fontSize: 10, color: zh?.color || "#4ecdc4", padding: "2px 8px", borderRadius: 6, background: (zh?.color || "#4ecdc4") + "10", border: `1px solid ${(zh?.color || "#4ecdc4")}15` }}>{zh?.label || z}</span>;
                          })}
                        </div>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
                          {positions.map(pos => (
                            <span key={pos} style={{ fontSize: 9, color: "rgba(255,255,255,.2)", letterSpacing: 1, textTransform: "uppercase" }}>{POSITION_DATA[pos]?.label || pos}</span>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}
                  {hrStats && (
                    <div style={{ marginBottom: 20, padding: "16px 0", borderTop: "1px solid rgba(255,255,255,.04)" }}>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,.2)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Heart Rate</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                        <div><div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 300, color: "#ff6b9d" }}>{hrStats.avg}</div><div style={{ fontSize: 9, color: "rgba(255,255,255,.18)", marginTop: 2 }}>AVG</div></div>
                        <div><div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 300, color: "#95e87a" }}>{hrStats.min}</div><div style={{ fontSize: 9, color: "rgba(255,255,255,.18)", marginTop: 2 }}>MIN</div></div>
                        <div><div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 300, color: "#ff8c42" }}>{hrStats.max}</div><div style={{ fontSize: 9, color: "rgba(255,255,255,.18)", marginTop: 2 }}>MAX</div></div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "center" }}><HRSparkline data={hrStats.data} width={260} height={40} /></div>
                    </div>
                  )}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "rgba(255,255,255,.12)", marginBottom: 4, letterSpacing: 1, textTransform: "uppercase" }}>
                      <span>Inhale {fmt(stats.totalIn)}</span><span>Exhale {fmt(stats.totalOut)}</span>
                    </div>
                    <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,.04)", overflow: "hidden", display: "flex" }}>
                      <div style={{ width: `${(stats.totalIn / (stats.totalIn + stats.totalOut)) * 100}%`, background: "#4ecdc4", borderRadius: 2 }} />
                      <div style={{ flex: 1, background: "#ff6b9d", borderRadius: 2 }} />
                    </div>
                  </div>
                  {isNewBest && <div className="pb-badge" style={{ marginBottom: 8 }}>{"\u2605"} New Personal Best!</div>}
                  {record && <div style={{ fontSize: 10, color: "rgba(255,255,255,.12)" }}>Sessions: {record.sessions}</div>}
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,.08)", marginTop: 16, letterSpacing: 1 }}>@ryandobbeckofficial</div>
                </div>
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,.2)", marginBottom: 20 }}>Screenshot this card and share to your story!</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn btn-sm" onClick={stop}>{"\u2190"} {posMode ? "Positional Lab" : "Protocols"}</button>
                <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="ig-btn" style={{ fontSize: 11, padding: "10px 20px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                  Follow
                </a>
              </div>
            </div>
          ) : (
            <>
              {/* ═══ LIQUID GLASS BREATHING ORB ═══ */}
              <div className="ring-wrap" style={{ position: "relative", width: 280, height: 280, marginBottom: 32, flexShrink: 0 }}>
                {/* Outer refractive glow */}
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{
                    width: 220, height: 220, borderRadius: "50%",
                    transform: `scale(${bScale * 1.15})`,
                    background: ps.g, filter: "blur(60px)", opacity: 0.4,
                    animation: (cs && (cs.p === "Hold" || cs.p === "Empty Hold")) ? "glowPulse 2s ease-in-out infinite" : "none",
                    transition: paused ? "none" : "transform .5s ease-out, background .5s",
                  }} />
                </div>
                {/* Inner glass orb */}
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{
                    width: 180, height: 180, borderRadius: "50%",
                    transform: `scale(${bScale})`,
                    background: `radial-gradient(ellipse at 35% 25%, rgba(255,255,255,.1), transparent 60%), radial-gradient(ellipse at 65% 75%, ${ps.g}, transparent 50%), rgba(255,255,255,.025)`,
                    backdropFilter: "blur(40px) saturate(1.8)",
                    WebkitBackdropFilter: "blur(40px) saturate(1.8)",
                    border: `1px solid ${ps.r}18`,
                    boxShadow: `inset 0 2px 0 rgba(255,255,255,.1), inset 0 -2px 4px rgba(0,0,0,.15), 0 0 80px ${ps.g}, 0 20px 60px rgba(0,0,0,.3)`,
                    transition: paused ? "none" : "transform .3s ease-out",
                    willChange: "transform",
                  }} />
                </div>
                {/* SVG ring track */}
                <svg viewBox="0 0 280 280" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: "rotate(-90deg)", zIndex: 2 }}>
                  <circle cx="140" cy="140" r="120" fill="none" stroke="rgba(255,255,255,.04)" strokeWidth="3" />
                  <circle cx="140" cy="140" r="120" fill="none" stroke={ps.r} strokeWidth="3" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off} style={{ transition: "stroke-dashoffset .3s linear, stroke .5s ease", filter: `drop-shadow(0 0 8px ${ps.r}40)` }} />
                </svg>
                {/* Center readout */}
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 3 }}>
                  <div className="timer-num" style={{ fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 200, color: "#fff", lineHeight: 1, letterSpacing: -2, textShadow: "0 0 30px rgba(255,255,255,.08)" }}>{fmt(tr)}</div>
                  <div className="phase-anim" key={si} style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: ps.r, marginTop: 8, letterSpacing: 2, textTransform: "uppercase", textShadow: `0 0 20px ${ps.r}40` }}>{cs?.p}</div>
                  {posMode && cs?.via && (
                    <div className="via-icon" style={{ marginTop: 4, color: "rgba(255,255,255,.3)" }}>
                      {cs.via === "nose" ? "\u25B2 nose" : "\u25CB mouth"}
                    </div>
                  )}
                </div>
                {/* Zone highlight glow (positional only) */}
                {posMode && cs?.zone && (() => {
                  const zh = ZONE_HIGHLIGHTS[cs.zone];
                  if (!zh) return null;
                  if (zh.wave) {
                    // Full wave: rolling gradient
                    const wavePhase = cs.p === "Exhale" || cs.p === "Max Exhale" ? "180deg" : "0deg";
                    return (
                      <div style={{
                        position: "absolute", inset: 30, borderRadius: "50%", zIndex: 1,
                        background: `linear-gradient(${wavePhase}, ${zh.color}30 0%, transparent 60%)`,
                        transition: "all .8s ease", opacity: 0.6, pointerEvents: "none",
                      }} />
                    );
                  }
                  if (zh.dual) {
                    // Lateral: glow on both sides
                    return (<>
                      <div className="zone-dot" style={{ left: 10, top: "50%", transform: "translateY(-50%)", width: 30, height: 30, background: zh.color, opacity: 0.35, zIndex: 1 }} />
                      <div className="zone-dot" style={{ right: 10, top: "50%", transform: "translateY(-50%)", width: 30, height: 30, background: zh.color, opacity: 0.35, zIndex: 1 }} />
                    </>);
                  }
                  // Single zone: position based on angle
                  const positions = {
                    belly: { bottom: 20, left: "50%", transform: "translateX(-50%)" },
                    posterior: { top: 20, left: "50%", transform: "translateX(-50%)" },
                    chest: { top: 30, left: "50%", transform: "translateX(-50%)" },
                  };
                  const pos = positions[cs.zone] || positions.belly;
                  return (
                    <div className="zone-dot" style={{ ...pos, width: 28, height: 28, background: zh.color, opacity: 0.4, zIndex: 1 }} />
                  );
                })()}
              </div>

              {/* Phase instruction / coaching cue */}
              {posMode && cs?.cue ? (
                <div className="phase-anim" key={"c" + si} style={{ fontSize: 13, color: "rgba(255,255,255,.35)", textAlign: "center", maxWidth: 340, lineHeight: 1.6, marginBottom: 32, minHeight: 36, fontStyle: "italic" }}>{cs.cue}</div>
              ) : (
                <div className="phase-anim" key={"i" + si} style={{ fontSize: 12, color: "rgba(255,255,255,.25)", textAlign: "center", maxWidth: 300, lineHeight: 1.5, marginBottom: 32, minHeight: 36 }}>{cs ? PI[cs.p] || "" : ""}</div>
              )}

              {/* Phase progress dots */}
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center", maxWidth: 360, marginBottom: 32 }}>
                {scaledRounds.map((s, i) => {
                  const c = PC[s.p]?.r || "#555";
                  return <div key={i} className="dot" style={{
                    background: i <= si ? c : "rgba(255,255,255,.06)",
                    opacity: i < si ? 0.4 : i === si ? 1 : 0.3,
                    transform: i === si ? "scale(1.5)" : "scale(1)",
                    boxShadow: i === si ? `0 0 10px ${c}40` : "none",
                  }} />;
                })}
              </div>

              {/* Controls */}
              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn" onClick={stop}>Stop</button>
                <button className="btn" onClick={togglePause} style={{
                  borderColor: paused ? "rgba(255,217,61,.2)" : "rgba(255,255,255,.08)",
                  color: paused ? "#ffd93d" : "rgba(255,255,255,.8)",
                }}>{paused ? "Resume" : "Pause"}</button>
              </div>

              {/* Position change alert */}
              {posAlert && (
                <div className="pos-alert lg-glass-card" style={{ padding: "28px 48px" }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, position: "relative", zIndex: 1 }}>Switch Position</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: 2, position: "relative", zIndex: 1 }}>{posAlert}</div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
