export function parseJSONField<T>(field: unknown, fallback: T): T {
  if (field === null || field === undefined) return fallback;
  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      return parsed;
    } catch (e) {
      return fallback;
    }
  }
  return field as T;
}

export function parseGalleryImages(galleryImages: unknown): string[] {
  const parsed = parseJSONField<string[]>(galleryImages, []);
  return Array.isArray(parsed) ? parsed : [];
}

export function parseFeatures(features: unknown): string[] {
  const parsed = parseJSONField<string[]>(features, []);
  return Array.isArray(parsed) ? parsed : [];
}

export function parseBadges(badges: unknown): string[] {
  const parsed = parseJSONField<string[]>(badges, []);
  return Array.isArray(parsed) ? parsed : [];
}

export function parseSpecifications(specifications: unknown): Record<string, string> {
  const parsed = parseJSONField<Record<string, string>>(specifications, {});
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
}

export function parseShippingInfo(shippingInfo: unknown): Record<string, string> {
  const parsed = parseJSONField<Record<string, string>>(shippingInfo, {});
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
}
