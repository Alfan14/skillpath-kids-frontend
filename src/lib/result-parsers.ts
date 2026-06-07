export function safeParseArray(value: unknown): string[] {
  const raw = typeof value === 'string' ? safeJsonParse(value) : value;

  if (!Array.isArray(raw)) return [];

  return raw
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    .map((item) => item.trim());
}

export function safeParseObject(value: unknown): Record<string, number> {
  const raw = typeof value === 'string' ? safeJsonParse(value) : value;

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};

  return Object.entries(raw).reduce<Record<string, number>>((acc, [key, item]) => {
    const score =
      typeof item === 'number'
        ? item
        : item && typeof item === 'object' && 'score' in item
          ? Number((item as { score?: unknown }).score)
          : Number(item);

    if (Number.isFinite(score)) acc[key] = score;
    return acc;
  }, {});
}

export function formatSkillLabel(key: string) {
  const labels: Record<string, string> = {
    bahasa: 'Bahasa',
    sosial: 'Sosial',
    kognitif: 'Kognitif',
    motorik: 'Motorik',
    motorikHalus: 'Motorik Halus',
    motorikKasar: 'Motorik Kasar',
  };

  if (labels[key]) return labels[key];

  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
