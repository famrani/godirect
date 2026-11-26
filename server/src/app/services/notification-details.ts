export function notificationDate(value: unknown, en = false, dateOnly = false): string {
 if ((typeof value !== 'string' && typeof value !== 'number') || !value) return '';
 const date = new Date(value);
 if (!Number.isFinite(date.getTime())) return '';
 return new Intl.DateTimeFormat(en ? 'en-GB' : 'fr-FR', {
  dateStyle: 'short', ...(dateOnly ? {} : {timeStyle: 'short' as const}), timeZone: 'Europe/Paris'
 }).format(date);
}

export function notificationName(profile: any): string {
 return String(profile?.displayName || [profile?.firstName || profile?.firstname, profile?.lastName || profile?.lastname].filter(Boolean).join(' '))
  .replace(/\s+/g, ' ').trim().slice(0, 120);
}

export function notificationCategory(kind: string, en = false): string {
 const labels: Record<string, [string, string]> = {
  booking: ['Réservation', 'Booking'], subscription: ['Abonnement', 'Subscription'],
  listing: ['Annonce', 'Listing'], asset: ['Bien', 'Asset'],
  documents: ['Justificatifs', 'Documents'], payment: ['Paiement', 'Payment'],
  message: ['Message', 'Message']
 };
 return (labels[kind.split('.')[0]] || ['Notification', 'Notification'])[en ? 1 : 0];
}
