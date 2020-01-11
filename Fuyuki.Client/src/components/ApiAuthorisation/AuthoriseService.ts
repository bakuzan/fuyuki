import { User, UserManager, WebStorageStateStore } from 'oidc-client';
import sendRequest from 'src/utils/sendRequest';
import { ApplicationName, ApplicationPaths } from './ApiAuthorisationConstants';

interface AuthSubscrption {
  callback: () => void;
  subscription: number;
}

export interface AuthState {
  returnUrl?: string;
}

export interface AuthSignInOutResponse {
  status: string;
  message?: string | Error;
  state?: AuthState;
}

export class AuthoriseService {
  static get instance() {
    return authService;
  }

  public userManager: UserManager | null = null;

  // By default pop ups are disabled because they don't work properly on Edge.
  // If you want to enable pop up authentication simply set this flag to false.
  private popUpDisabled = true;
  private callbacks: AuthSubscrption[] = [];
  private nextSubscriptionId = 0;
  private user: User | null = null;
  private isUserAuthenticated = false;

  public async isAuthenticated() {
    const user = await this.getUser();
    const isAuth = !!user;
    return isAuth;
  }

  public async getUserObject() {
    const response = await sendRequest('/reddit/me', {}, true);
    return response ?? {};
  }

  public clearStaleState() {
    Object.keys(localStorage)
      .filter((x) => x.startsWith('oidc'))
      .forEach((key) => localStorage.removeItem(key));
  }

  public async getUser() {
    if (this.user) {
      const u = this.user as User;

      if (u.profile) {
        return u.profile;
      }
    }

    await this.ensureUserManagerInitialized();
    const userManager = this.userManager as UserManager;
    const user = await userManager.getUser();
    return user && user.profile;
  }

  public async getAccessToken() {
    await this.ensureUserManagerInitialized();
    const userManager = this.userManager as UserManager;
    const user = await userManager.getUser();
    return user && user.access_token;
  }

  // We try to authenticate the user in three different ways:
  // 1) We try to see if we can authenticate the user silently. This happens
  //    when the user is already logged in on the IdP and is done using a hidden iframe
  //    on the client.
  // 2) We try to authenticate the user using a PopUp Window. This might fail if there is a
  //    Pop-Up blocker or the user has disabled PopUps.
  // 3) If the two methods above fail, we redirect the browser to the IdP to perform a traditional
  //    redirect flow.
  public async signIn(state: AuthState): Promise<AuthSignInOutResponse> {
    await this.ensureUserManagerInitialized();
    const userManager = this.userManager as UserManager;

    try {
      const silentUser = await userManager.signinSilent(this.createArguments());
      this.updateState(silentUser);
      return this.success(state);
    } catch (silentError) {
      // User might not be authenticated, fallback to popup authentication
      console.log('Silent authentication error: ', silentError);

      try {
        if (this.popUpDisabled) {
          throw new Error(
            'Popup disabled. Change "AuthoriseService.js:AuthoriseService.popUpDisabled" to false to enable it.'
          );
        }

        const popUpUser = await userManager.signinPopup(this.createArguments());
        this.updateState(popUpUser);
        return this.success(state);
      } catch (popUpError) {
        if (popUpError.message === 'Popup window closed') {
          // The user explicitly cancelled the login action by closing an opened popup.
          return this.error('The user closed the window.');
        } else if (!this.popUpDisabled) {
          console.log('Popup authentication error: ', popUpError);
        }

        // PopUps might be blocked by the user, fallback to redirect
        try {
          await userManager.signinRedirect(this.createArguments(state));
          return this.redirect();
        } catch (redirectError) {
          console.log('Redirect authentication error: ', redirectError);
          return this.error(redirectError);
        }
      }
    }
  }

  public async completeSignIn(url: string): Promise<AuthSignInOutResponse> {
    try {
      await this.ensureUserManagerInitialized();
      const userManager = this.userManager as UserManager;
      const user = await userManager.signinCallback(url);
      this.updateState(user);
      return this.success(user && user.state);
    } catch (error) {
      console.log('There was an error signing in: ', error);
      return this.error('There was an error signing in.');
    }
  }

  // We try to sign out the user in two different ways:
  // 1) We try to do a sign-out using a PopUp Window. This might fail if there is a
  //    Pop-Up blocker or the user has disabled PopUps.
  // 2) If the method above fails, we redirect the browser to the IdP to perform a traditional
  //    post logout redirect flow.
  public async signOut(state: AuthState): Promise<AuthSignInOutResponse> {
    await this.ensureUserManagerInitialized();
    const userManager = this.userManager as UserManager;

    try {
      if (this.popUpDisabled) {
        throw new Error(
          'Popup disabled. Change "AuthoriseService.js:AuthoriseService.popUpDisabled" to false to enable it.'
        );
      }

      await userManager.signoutPopup(this.createArguments());
      this.updateState(null);
      return this.success(state);
    } catch (popupSignOutError) {
      console.log('Popup signout error: ', popupSignOutError);
      try {
        await userManager.signoutRedirect(this.createArguments(state));
        return this.redirect();
      } catch (redirectSignOutError) {
        console.log('Redirect signout error: ', redirectSignOutError);
        return this.error(redirectSignOutError);
      }
    }
  }

  public async completeSignOut(url: string): Promise<AuthSignInOutResponse> {
    await this.ensureUserManagerInitialized();
    try {
      const userManager = this.userManager as UserManager;
      const response = await userManager.signoutCallback(url);
      this.updateState(null);
      return this.success(response && (response as any).data);
    } catch (error) {
      console.log(`There was an error trying to log out '${error}'.`);
      return this.error(error);
    }
  }

  public updateState(user: User | null) {
    this.user = user;
    this.isUserAuthenticated = !!this.user;
    this.notifySubscribers();
  }

  public subscribe(callback: () => void) {
    this.callbacks.push({
      callback,
      subscription: this.nextSubscriptionId++
    });
    return this.nextSubscriptionId - 1;
  }

  public unsubscribe(subscriptionId: number) {
    const subscriptionIndex = this.callbacks
      .map((element, index) =>
        element.subscription === subscriptionId
          ? { found: true, index }
          : { found: false }
      )
      .filter((element) => element.found === true);

    if (subscriptionIndex.length !== 1) {
      throw new Error(
        `Found an invalid number of subscriptions ${subscriptionIndex.length}`
      );
    }

    this.callbacks.splice(subscriptionIndex[0].index as number, 1);
  }

  public notifySubscribers() {
    for (const item of this.callbacks) {
      const callback = item.callback;
      callback();
    }
  }

  public createArguments(state?: AuthState) {
    return { useReplaceToNavigate: true, data: state };
  }

  public error(message: Error | string) {
    return { status: AuthenticationResultStatus.Fail, message };
  }

  public success(state: AuthState) {
    return { status: AuthenticationResultStatus.Success, state };
  }

  public redirect() {
    return { status: AuthenticationResultStatus.Redirect };
  }

  public async ensureUserManagerInitialized() {
    if (this.userManager !== null) {
      return;
    }

    const response = await fetch(
      ApplicationPaths.ApiAuthorisationClientConfigurationUrl
    );

    if (!response.ok) {
      throw new Error(`Could not load settings for '${ApplicationName}'`);
    }

    const settings = await response.json();
    settings.automaticSilentRenew = true;
    settings.includeIdTokenInSilentRenew = true;
    settings.userStore = new WebStorageStateStore({
      prefix: ApplicationName
    });

    this.userManager = new UserManager(settings);

    this.userManager.events.addUserSignedOut(async () => {
      const userManager = this.userManager as UserManager;
      await userManager.removeUser();
      this.updateState(null);
    });
  }
}

const authService = new AuthoriseService();

export default authService;

export const AuthenticationResultStatus = {
  Fail: 'fail',
  Redirect: 'redirect',
  Success: 'success'
};
