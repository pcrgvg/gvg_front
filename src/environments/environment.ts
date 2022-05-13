// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'pcrgvg-web',
    appId: '1:1008031250903:web:efdb4486e97b3170f0b392',
    storageBucket: 'pcrgvg-web.appspot.com',
    apiKey: 'AIzaSyDUnDfKh2M-T7mZ4hlrmg8BHQuBczYE3Ds',
    authDomain: 'pcrgvg-web.firebaseapp.com',
    messagingSenderId: '1008031250903',
    measurementId: 'G-7PNRJR044T',
  },
  production: false,
  baseUrl: '/api',
  showLink: true,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
