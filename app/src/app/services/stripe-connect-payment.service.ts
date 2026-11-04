import { ReservationAuthService } from './reservation-auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

declare global { interface Window { Stripe?: any; } }

export type GoDirectPaymentKind='booking_deposit'|'balance'|'security_deposit';

export interface GoDirectStripeConfig {
  publishableKey: string;
  mode: 'test' | 'live';
  directCharges: boolean;
  goDirectCommissionPercent: number;
}

export interface GoDirectCheckout {
  clientSecret: string;
  connectedAccountId: string;
  paymentId: string;
  mode: 'setup'|'payment';
  stripeMode?: 'test'|'live';
}

@Injectable({ providedIn: 'root' })
export class StripeConnectPaymentService {
  private configPromise?: Promise<GoDirectStripeConfig>;
  private stripeJsPromise?: Promise<void>;

  constructor(private http: HttpClient, private auth:ReservationAuthService) {}

  config(): Promise<GoDirectStripeConfig> {
    return this.configPromise ||= firstValueFrom(this.http.get<GoDirectStripeConfig>('/api/payments/config'));
  }

  async createCheckout(bookingId: string, kind: GoDirectPaymentKind): Promise<GoDirectCheckout> {
    if(!['booking_deposit','balance','security_deposit'].includes(kind))throw new Error('security_payment_disabled');
    const checkout=await firstValueFrom(this.http.post<GoDirectCheckout>('/api/payments/checkout', { bookingId, kind }, {headers:await this.auth.headers()}));
    if(kind==='security_deposit'&&(checkout.mode!=='setup'||!String(checkout.paymentId||'').startsWith('seti_')))throw new Error('warranty_setup_required');
    return checkout;
  }

  /**
   * Returns Stripe.js scoped to the owner's connected account. This is required
   * because GoDirect creates direct-charge PaymentIntents on acct_... rather
   * than on the GoDirect platform account.
   */
  async stripeForConnectedAccount(connectedAccountId: string): Promise<any> {
    const [cfg] = await Promise.all([this.config(), this.loadStripeJs()]);
    if (!window.Stripe) throw new Error('stripe_js_unavailable');
    return window.Stripe(cfg.publishableKey, { stripeAccount: connectedAccountId });
  }

  async createPaymentElement(bookingId: string, kind: GoDirectPaymentKind):
    Promise<{ checkout: GoDirectCheckout; stripe: any; elements: any; paymentElement: any }> {
    const checkout = await this.createCheckout(bookingId, kind);
    const stripe = await this.stripeForConnectedAccount(checkout.connectedAccountId);
    const elements = stripe.elements({ clientSecret: checkout.clientSecret });
    const paymentElement = elements.create('payment');
    return { checkout, stripe, elements, paymentElement };
  }

  private loadStripeJs(): Promise<void> {
    if (window.Stripe) return Promise.resolve();
    if (this.stripeJsPromise) return this.stripeJsPromise;
    this.stripeJsPromise = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-godirect-stripe-js]');
      if (existing) { existing.addEventListener('load', () => resolve(), { once:true }); existing.addEventListener('error', () => reject(new Error('stripe_js_load_failed')), { once:true }); return; }
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      script.dataset['godirectStripeJs'] = 'true';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('stripe_js_load_failed'));
      document.head.appendChild(script);
    });
    return this.stripeJsPromise;
  }
}
