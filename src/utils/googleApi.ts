export const GOOGLE_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || '',
  DISCOVERY_DOC: 'https://sheets.googleapis.com/$discovery/rest?version=v4',
  SCOPES: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
};

export const loadGoogleAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.gapi) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('api:auth2:picker', {
        callback: resolve,
        onerror: reject,
      });
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export const initializeGoogleAPI = async (): Promise<void> => {
  await loadGoogleAPI();
  
  await window.gapi.client.init({
    apiKey: GOOGLE_CONFIG.API_KEY,
    clientId: GOOGLE_CONFIG.CLIENT_ID,
    discoveryDocs: [GOOGLE_CONFIG.DISCOVERY_DOC],
    scope: GOOGLE_CONFIG.SCOPES,
  });
};

export const signIn = async (): Promise<void> => {
  const authInstance = window.gapi.auth2.getAuthInstance();
  await authInstance.signIn();
};

export const signOut = async (): Promise<void> => {
  const authInstance = window.gapi.auth2.getAuthInstance();
  await authInstance.signOut();
};

export const isSignedIn = (): boolean => {
  const authInstance = window.gapi.auth2.getAuthInstance();
  return authInstance?.isSignedIn?.get() || false;
};

// Global type declarations for Google APIs
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}