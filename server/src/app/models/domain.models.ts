export interface AssetLocation { city?: string; region?: string; country?: string; address?: string; }
export interface Asset { id?: string; ownerId: string; assetType: string; name?: string; enabled?: boolean; published?: boolean; status?: string; location?: AssetLocation | string; pricing?: Record<string, unknown>; [key: string]: unknown; }
export interface OwnerStripe { connectedAccountId?: string; accountType?: 'standard'; onboardingComplete?: boolean; chargesEnabled?: boolean; payoutsEnabled?: boolean; }
export interface Owner { id?: string; stripe?: OwnerStripe; stripeAccountId?: string; [key: string]: unknown; }
export interface Booking { id: string; ownerId: string; assetId: string; customerId: string; startAt: string; endAt: string; rentalAmount: number; bookingDeposit: number; securityDeposit: number; balanceAmount: number; currency: string; status: string; paymentStatus: string; createdAt: string; }
