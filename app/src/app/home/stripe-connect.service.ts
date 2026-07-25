import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface StripeConnectStatus {
  connected: boolean;
  enabled: boolean;
  accountId: string | null;
  onboardingStatus: 'not_connected' | 'connected' | 'action_required' | 'complete' | string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  commissionBps: number;
  commissionPercent: number;
  livemode: boolean;
  connectedAt: number | null;
}

@Injectable({ providedIn: 'root' })
export class StripeConnectService {
  constructor(private http: HttpClient) {}

  async getStatus(ownerId: string): Promise<StripeConnectStatus> {
    return this.http.get<StripeConnectStatus>(
      `${this.backendUrl}/owner/stripe/status`,
      {
        params: { ownerId },
        withCredentials: true,
      },
    ).toPromise() as Promise<StripeConnectStatus>;
  }

  buildAuthorizeUrl(ownerId: string, returnUrl: string): string {
    const query = new URLSearchParams({
      ownerId,
      accountType: 'owner',
      returnUrl,
    });
    return `${this.backendUrl}/stripe/connect/authorize?${query.toString()}`;
  }

  async disconnect(ownerId: string): Promise<void> {
    await this.http.post(
      `${this.backendUrl}/stripe/connect/deauthorize`,
      { ownerId },
      { withCredentials: true },
    ).toPromise();
  }

  private get backendUrl(): string {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      return 'https://localhost:2000';
    }
    return window.location.origin;
  }
}
