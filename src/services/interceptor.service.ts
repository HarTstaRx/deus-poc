/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';

import { authenticationService } from './authentication.service';

export function InterceptorService(): boolean {
  axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const token = authenticationService.getTokenFromLocal();
      return {
        ...config,
        baseURL: process.env.REACT_APP_API_URL ?? '',
        params: {
          ...config.params,
          access_token: token,
        },
      };
    },
    (error: Record<string, unknown>) => error
  );

  axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error && error.response) {
        // Gestionar errores aquí, usar toasts o lo que quieras para notificar al usuario
      }
      if (error.response && [401].includes(error.response.status)) {
        const accessCode = authenticationService.getAccessCode();
        if (accessCode) void authenticationService.getAccessToken();
        else void authenticationService.signInRedirect();
      }

      return Promise.reject(error);
    }
  );
  return true;
}
