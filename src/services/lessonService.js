// Eagerly globs every lesson JSON so lessons can be looked up by id
// ("1-1") without a giant hand-maintained import list — same pattern
// used for Python-Chan's lessonService.
const modules = import.meta.glob('../data/lessons/**/*.json', { eager: true });

export function getLessonContent(lessonId) {
  const entry = Object.entries(modules).find(([path]) =>
    path.endsWith(`/${lessonId}.json`)
  );
  if (!entry) return null;
  const mod = entry[1];
  return mod?.default ?? mod;
}
