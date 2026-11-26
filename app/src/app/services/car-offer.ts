const labels: Record<string, [string, string]> = {
  standard: ['Voiture classique', 'Standard car'],
  prestige: ['Voiture de prestige', 'Prestige car'],
  chauffeured: ['Avec chauffeur', 'With chauffeur'],
  selfDrive: ['Sans chauffeur', 'Self-drive']
};

export function carOfferLabel(value: unknown, language = 'fr'): string {
  if (typeof value !== 'string' || !Object.prototype.hasOwnProperty.call(labels, value)) return '';
  return labels[value][language === 'fr' ? 0 : 1];
}

export function carOfferLabels(properties: { carCategory?: unknown; carService?: unknown } | null | undefined, language = 'fr'): string[] {
  return [carOfferLabel(properties?.carCategory, language), carOfferLabel(properties?.carService, language)].filter(Boolean);
}
