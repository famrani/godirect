import {siteReturn} from '../../services/site-return';
import {ManagementEntryService} from '../../services/management-entry.service';
import {ReservationAuthService} from '../../services/reservation-auth.service';
import {HttpClient} from '@angular/common/http';import {firstValueFrom} from 'rxjs';
import {portalFor,dedicatedPortalHome} from '../../services/portal-policy';
import {GoogleSessionService} from '../../services/google-session.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Users, UsersService } from 'godigital-lib';               // adjust path if needed
import { StoreDbService, OBJECTNAME, AUTHSTATUS } from 'godigital-lib'; // adjust path if needed
import { UtilsService } from 'godigital-lib';
import { LoginService } from '../login.service';

declare var $: any;

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  sending = false;
  showPassword = false;

  // modal
  showErrorModal = false;
  errorModalTitle = 'Authentication failed';
  errorModalMessage = 'Please try again.';

  // forgot password mini-UI
  showReset = false;
  resetEmail = '';
  resetSending = false;
  resetSent = false;
  accountCreatedMessage = '';

  // redirection
  private redirectTo: string | null = null;

  constructor(
    private fb: FormBuilder,
    private users: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    public utilSvc: UtilsService,
    private storeDb: StoreDbService,
    private loginSvc: LoginService,
    private entry:ManagementEntryService,private session:ReservationAuthService,private http:HttpClient,private googleSession:GoogleSessionService
  ) {
    this.loginForm = this.fb.group({
      email: [localStorage.getItem('rememberEmail') || '', [Validators.required, Validators.email]],
      password: [localStorage.getItem('rememberPassword') || '', [Validators.required]],
      rememberme: [localStorage.getItem('rememberLogin') === 'true' || !!localStorage.getItem('rememberEmail')],
    });

    this.redirectTo = this.route.snapshot.queryParamMap.get('returnUrl')
      || this.route.snapshot.queryParamMap.get('redirect')
      || localStorage.getItem('redirectAfterLogin')
      || sessionStorage.getItem('redirectAfterLogin');
    if (this.route.snapshot.queryParamMap.get('created') === 'true') {
      this.accountCreatedMessage = 'Account created successfully. Please check your inbox and your Junk/Spam folder for the password setup/reset email before signing in.';
    }
  }

  async ngOnInit(){
    const returnUrl=this.route.snapshot.queryParamMap.get('returnUrl');
    if(!returnUrl&&this.route.snapshot.queryParamMap.has('created'))return;
    try{await this.session.user();}catch{return;}
    if(this.sending||!location.pathname.replace(/\/$/,'').endsWith('/account/login'))return;
    try{await this.postLoginRedirect();}catch(e:any){this.openError(this.normalizeAuthError(e));}
  }

  get f() { return this.loginForm.controls; }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private openError(message: string, title = 'Authentication failed') {
    this.errorModalTitle = title;
    this.errorModalMessage = message || 'Please try again.';
    this.showErrorModal = true;
  }
  closeError() { this.showErrorModal = false; }

  private withTimeout<T>(promise: Promise<T>, timeoutMs = 20000, message = 'Login is taking too long. Please try again.'): Promise<T> {
    let timer: any;
    const timeoutPromise = new Promise<T>((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
  }

  private normalizeAuthError(error: any): string {
    const code = error?.code || error?.[0] || error?.message || '';
    const rawMessage = error?.message || '';

    if (String(code).includes('EMAILNOTVERIFIED')) {
      return 'EMAIL_NOT_VERIFIED';
    }
    if (String(code).includes('auth/invalid-credential') || String(code).includes('auth/wrong-password') || String(code).includes('auth/user-not-found')) {
      return 'The email or password is incorrect.';
    }
    if (String(code).includes('auth/too-many-requests')) {
      return 'Too many attempts. Please wait a moment and try again.';
    }
    return rawMessage || 'Authentication failed. Please try again.';
  }

  private async postLoginRedirect() {
    const portal=portalFor(window.location.hostname);
    const fallback=dedicatedPortalHome(window.location.hostname)??(portal==='owner'?'/espaces':'/');
    const requested=this.route.snapshot.queryParamMap.get('returnUrl')||(portal==='asset'?(this.route.snapshot.queryParamMap.get('redirect')||''):this.redirectTo);
    const target=portal==='admin'&&!/^\/(?:platform\/admin(?:[/?#]|$)|admin-access(?:[/?#]|$))/.test(requested||'')?fallback:siteReturn(requested,window.location.hostname,fallback);
    try {
      localStorage.removeItem('redirectAfterLogin');
      sessionStorage.removeItem('redirectAfterLogin');
    } catch {}
    await this.session.user();
    const navigated=await this.router.navigateByUrl(target,{replaceUrl:true});
    if(!navigated&&location.pathname==='/account/login')throw new Error('Connexion réussie, mais impossible d’ouvrir votre espace. Réessayez.');

  }

  async loginWithEmail() {
    let status, user;
    if (this.loginForm.invalid) return;
    this.sending = true;
    try {
      const v = this.loginForm.value;

      const rememberMe = !!v.rememberme;

      // Remember me: keep credentials available for the next visit when selected.
      // This is intentionally explicit because the user wants the password restored too.
      if (rememberMe) {
        localStorage.setItem('rememberLogin', 'true');
        localStorage.setItem('rememberEmail', v.email || '');
        localStorage.setItem('rememberPassword', v.password || '');
      } else {
        localStorage.removeItem('rememberLogin');
        localStorage.removeItem('rememberEmail');
        localStorage.removeItem('rememberPassword');
        localStorage.removeItem('loggedUser');
      }

      [status, user] = await this.withTimeout(
        this.loginSvc.localUtilsSvc.processLogin(v.email, v.password, undefined) as Promise<any>,
        20000,
        'Login is taking too long. Please check your connection and try again.'
      ) as any;

      if (!user) {
        throw new Error('Authentication failed. Please try again.');
      }

      this.loginSvc.wnGuest = user;
      this.loginSvc.mainSvc.setLoggedUser(user);
      try {
        sessionStorage.setItem('loggedUser', JSON.stringify(user));
        if (rememberMe) {
          localStorage.setItem('loggedUser', JSON.stringify(user));
        } else {
          localStorage.removeItem('loggedUser');
        }
      } catch {}


      // OPTION: you can fetch the user profile here if you need local state
      // const profile = await this.users.loadProfile(); // depends on your lib

      await this.postLoginRedirect();
    } catch (e: any) {
      const message = this.normalizeAuthError(e);
      if (message === 'EMAIL_NOT_VERIFIED') {
        $('#emailNotVerifiedModal').modal('show');
      } else {
        this.openError(message, 'Connexion impossible');
      }
    } finally {
      this.sending = false;
    }
  }

  async loginWithGoogle() {
    // Keep the Firebase popup promise directly attached to the user's click.
    // Do NOT wrap popup authentication in an application timeout: choosing a
    // Google account can legitimately take more than 20 seconds and racing the
    // popup promise can leave Firebase's popup lifecycle in an inconsistent state.
    if (this.sending) return;
    this.sending = true;
    this.closeError();
    try {
      const user = await this.googleSession.signIn();
      this.loginSvc.wnGuest=user;
      this.loginSvc.mainSvc.setLoggedUser(user);
      try{sessionStorage.setItem('loggedUser',JSON.stringify(user));if(localStorage.getItem('rememberLogin')==='true')localStorage.setItem('loggedUser',JSON.stringify(user));else localStorage.removeItem('loggedUser');}catch{}

      await this.postLoginRedirect();
    } catch (e: any) {
      const code = String(e?.code || '');
      console.error('[Google Auth]', { code, message: e?.message, error: e });

      if (code.includes('auth/popup-closed-by-user')) {
        this.openError(
          'The Google sign-in window closed before Firebase received the result. Please try again and keep the Google window open until it returns to GoDirect. If it closes immediately, verify that this site domain is listed in Firebase Authentication > Settings > Authorized domains.',
          'Google sign-in interrupted'
        );
      } else if (code.includes('auth/popup-blocked')) {
        this.openError(
          'Your browser blocked the Google sign-in window. Allow pop-ups for this site and try again.',
          'Google pop-up blocked'
        );
      } else if (code.includes('auth/unauthorized-domain')) {
        this.openError(
          `This domain (${window.location.hostname}) is not authorized for Firebase Authentication. Add it in Firebase Authentication > Settings > Authorized domains.`,
          'Unauthorized domain'
        );
      } else if (code.includes('auth/operation-not-allowed')) {
        this.openError(
          'Google authentication is not enabled for this Firebase project. Enable Google in Firebase Authentication > Sign-in method.',
          'Google authentication disabled'
        );
      } else if (code.includes('auth/cancelled-popup-request')) {
        this.openError(
          'Another Google sign-in request was already in progress. Please try once more.',
          'Google sign-in interrupted'
        );
      } else {
        this.openError(`${e?.message || 'Google sign-in failed.'}${code ? ` (${code})` : ''}`);
      }
    } finally {
      this.sending = false;
    }
  }

  toggleReset() {
    this.showReset = !this.showReset;
    this.resetSent = false;
    if (!this.resetEmail) this.resetEmail = this.f.email.value || '';
  }

  async sendReset() {
    if (!this.resetEmail || !/.+@.+\..+/.test(this.resetEmail)) {
      this.openError('Enter a valid email to receive a reset link.', 'Password reset');
      return;
    }
    this.resetSending = true;
    try {
      await this.users.resetPwdUser(this.resetEmail);
      this.resetSent = true;
    } catch (e: any) {
      this.openError(e?.message || 'Failed to send reset email.', 'Password reset');
    } finally {
      this.resetSending = false;
    }
  }
}
