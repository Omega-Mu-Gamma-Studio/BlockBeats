// Checks a placed pattern against a lesson's target. `mode` leaves room for
// the richer validation_mode field described in the syllabus (strict /
// order-only / musically-correct) — Unit 1 only needs strict positional
// matching for now.
export function validatePattern(placed, target, mode = 'strict') {
  const blockIds = new Set([...Object.keys(placed), ...Object.keys(target)]);

  for (const blockId of blockIds) {
    const placedSteps = [...(placed[blockId] || [])].sort((a, b) => a - b);
    const targetSteps = [...(target[blockId] || [])].sort((a, b) => a - b);

    if (mode === 'strict') {
      if (placedSteps.length !== targetSteps.length) return false;
      if (!placedSteps.every((s, i) => s === targetSteps[i])) return false;
    }
  }
  return true;
}

export function countMisplaced(placed, target) {
  const blockIds = new Set([...Object.keys(placed), ...Object.keys(target)]);
  let missing = 0;
  let extra = 0;
  blockIds.forEach((blockId) => {
    const p = placed[blockId] || new Set();
    const t = target[blockId] || new Set();
    t.forEach((step) => { if (!p.has(step)) missing += 1; });
    p.forEach((step) => { if (!t.has(step)) extra += 1; });
  });
  return { missing, extra };
}
