/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { UserManager, WebStorageStateStore, Log, User } from 'oidc-client-ts';

import {
  LoginMetadataInterface,
  UserInfoInterface,
} from '../shared/interfaces';
import { isNullOrEmpty } from '../shared/utils';
import { BaseService } from './base.service';

class AuthenticationService extends BaseService {
  userManager: UserManager;
  #authority: string = process.env.REACT_APP_AUTH_URL ?? '';
  #client_id: string = process.env.REACT_APP_CLIENT_ID ?? '';
  #redirect_uri: string = process.env.REACT_APP_REDIRECT_URL ?? '';
  #client_secret: string = process.env.REACT_APP_CLIENT_SECRET ?? '';
  #authorization_endpoint = 'https://oauth.battle.net/authorize';
  #userinfo_endpoint = 'https://eu.battle.net/oauth/userinfo';
  #token_endpoint = 'https://oauth.battle.net/token';
  #userKey = `oidc.user:${this.#authorization_endpoint}:${this.#client_id}`;

  constructor() {
    super();
    this.userManager = new UserManager({
      authority: this.#authority,
      client_id: this.#client_id,
      redirect_uri: this.#redirect_uri,
      client_secret: this.#client_secret,
      // Como el endpoint de metadata de battle.net no parece soportar cors tenemos que escribir a mano los datos
      // Parámetros perfectamente extraibles a otro archivo
      metadata: {
        issuer: 'https://oauth.battle.net',
        authorization_endpoint: this.#authorization_endpoint,
        userinfo_endpoint: this.#userinfo_endpoint,
        token_endpoint: this.#token_endpoint,
        revocation_endpoint: 'https://oauth.battle.net/revoke',
      },
      userStore: new WebStorageStateStore({ store: window.sessionStorage }),
      revokeTokenTypes: ['refresh_token'],
      automaticSilentRenew: false,
    });

    Log.setLogger(console);
    Log.setLevel(Log.INFO);

    this.userManager.events.addSilentRenewError(() => {
      console.log('error en silent renew');
    });
    this.userManager
      .signinRedirectCallback()
      .then((user: User | null) => {
        void this.userManager.storeUser(user);
      })
      .catch(console.error);
  }

  signInRedirect = (): Promise<void> => this.userManager.signinRedirect();
  signinRedirectCallback = (): Promise<User | null> =>
    this.userManager.signinRedirectCallback();
  singInPopup = (): Promise<User | null> => this.userManager.signinPopup();
  signInSilent = (): Promise<User | null> => this.userManager.signinSilent();
  getUser = (): Promise<User | null> => this.userManager.getUser();

  getUserInfoFromStorage = (): LoginMetadataInterface | undefined => {
    const userString = window.sessionStorage.getItem(this.#userKey);
    if (!isNullOrEmpty(userString)) {
      const user: LoginMetadataInterface = JSON.parse(userString as string);
      return user;
    }
    return undefined;
  };

  isAuthenticated = (): boolean =>
    !isNullOrEmpty(this.getUserInfoFromStorage()?.access_token);

  getTokenFromLocal = (): string | undefined => {
    const userInfo = this.getUserInfoFromStorage();
    return userInfo?.access_token;
  };

  getAccessCode = (): string | undefined => {
    const params = new URLSearchParams(window.location.search);
    return params.get('code') ?? undefined;
  };

  getAccessToken = async (): Promise<void> => {
    const code = this.getAccessCode();
    if (isNullOrEmpty(code))
      throw new Error(
        'Sin código de acceso no podemos obtener un token de acceso'
      );
    try {
      const user = await this.postData<LoginMetadataInterface>(
        this.#token_endpoint,
        {
          region: 'eu',
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: this.#redirect_uri,
          client_id: this.#client_id,
        }
      );
      window.sessionStorage.setItem(this.#userKey, JSON.stringify(user));
    } catch (error) {
      void this.signInRedirect();
    }
  };

  getUserInfo = (): Promise<UserInfoInterface> =>
    this.getData(this.#userinfo_endpoint);
}

export const authenticationService = new AuthenticationService();
