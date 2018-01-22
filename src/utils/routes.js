import routes from './../constants/routes';

export default [
  {
    regex: /\/main\/account-visual-demo(?:\/[^/]*)?$/,
    path: '/main/account-visual-demo/',
    params: 'dialog',
    name: 'account-visual-demo',
  }, {
    regex: /\/main\/dashboard(?:\/[^/]*)?$/,
    path: '/main/dashboard/',
    params: 'dialog',
    name: 'dashboard',
  }, {
    regex: /\/main\/transactions(?:\/[^/]*)?$/,
    path: routes.wallet.long,
    params: 'dialog',
    name: 'transactions',
  }, {
    regex: /\/main\/voting(?:\/[^/]*)?$/,
    path: '/main/voting/',
    params: 'dialog',
    name: 'voting',
  }, {
    regex: /\/main\/sidechains(?:\/[^/]*)?$/,
    path: '/main/sidechains/',
    params: 'dialog',
    name: 'sidechains',
  }, {
    regex: /\/main\/forging(?:\/[^/]*)?$/,
    path: '/main/forging/',
    params: 'dialog',
    name: 'forging',
  }, {
    regex: /\/main\/add-account(?:\/[^/]*)?$/,
    path: '/main/add-account/',
    params: 'dialog',
    name: 'add-account',
  }, {
    regex: /\/main\/accounts(?:\/[^/]*)?$/,
    path: routes.account.long,
    params: 'address',
    name: 'accounts',
  }, {
    regex: /register(\/)?$/,
    path: '/',
    params: 'dialog',
    name: 'login',
  }, {
    regex: /^\/$/,
    path: '/',
    params: 'dialog',
    name: 'login',
  }, {
    regex: /./,
    path: '/',
    params: 'notFound',
    name: 'not-found',
  },
];
