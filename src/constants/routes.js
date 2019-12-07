// import { tokenMap } from './tokens';
import AddBookmark from '../components/screens/bookmarks/addBookmark';
import Bookmarks from '../components/screens/bookmarks';
import Dashboard from '../components/screens/dashboard';
import RegisterDelegate from '../components/screens/registerDelegate';
import Delegates from '../components/screens/delegates';
import Accounts from
  '../components/screens/explorer/accounts';
import Extensions from '../components/screens/extensions';
import HwWalletLogin from '../components/screens/hwWalletLogin';
import Login from '../components/screens/login';
import Register from '../components/screens/register';
import SecondPassphrase from '../components/screens/secondPassphrase';
import Send from '../components/screens/wallet/send/send';
import Settings from '../components/screens/settings';
import SignMessage from '../components/screens/signMessage';
import VerifyMessage from '../components/screens/verify-message';
import Transactions from '../components/screens/explorer/transactions';
import Splashscreen from '../components/screens/splashscreen';
import TermsOfUse from '../components/screens/termsOfUse';
import ToolboxDemo from '../components/toolbox/demo';
import TransactionDashboard from '../components/shared/transactionDashboard';
import Voting from '../components/screens/delegates/voting';

export default {
  toolboxDemo: {
    path: '/toolbox',
    pathSuffix: '/:component?',
    component: ToolboxDemo,
    isPrivate: false,
  },
  dashboard: {
    path: '/dashboard',
    component: Dashboard,
    isPrivate: false,
  },
  addBookmark: {
    path: '/bookmarks/add-bookmark',
    component: AddBookmark,
    isPrivate: false,
  },
  bookmarks: {
    path: '/bookmarks',
    component: Bookmarks,
    isPrivate: false,
  },
  send: {
    path: '/wallet/send',
    component: Send,
    isPrivate: true,
  },
  wallet: {
    path: '/wallet',
    pathSuffix: '/:token?',
    component: TransactionDashboard,
    isPrivate: true,
  },
  voting: {
    path: '/delegates/vote',
    component: Voting,
    isPrivate: true,
    // forbiddenTokens: [tokenMap.BTC.key],
  },
  delegates: {
    path: '/delegates',
    component: Delegates,
    isPrivate: false,
    // forbiddenTokens: [tokenMap.BTC.key],
  },
  settings: {
    path: '/settings',
    component: Settings,
    isPrivate: false,
  },
  secondPassphrase: {
    path: '/second-passphrase',
    component: SecondPassphrase,
    isPrivate: true,
    // forbiddenTokens: [tokenMap.BTC.key],
  },
  signMessage: {
    path: '/sign-message',
    component: SignMessage,
    isPrivate: true,
    // forbiddenTokens: [tokenMap.BTC.key],
  },
  verifyMMessage: {
    path: '/verify-message',
    component: VerifyMessage,
    isPrivate: false,
    // forbiddenTokens: [tokenMap.BTC.key],
  },
  registerDelegate: {
    path: '/register-delegate',
    component: RegisterDelegate,
    isPrivate: true,
    // forbiddenTokens: [tokenMap.BTC.key],
  },
  addAccount: {
    path: '/add-account',
    component: Login,
    isPrivate: false,
  },
  extensions: {
    path: '/extensions',
    component: Extensions,
    isPrivate: false,
  },
  accounts: {
    pathPrefix: '',
    path: '/explorer/accounts',
    pathSuffix: '/:address?',
    component: Accounts,
    isPrivate: false,
  },
  transactions: {
    pathPrefix: '',
    path: '/explorer/transactions',
    pathSuffix: '/:id?',
    component: Transactions,
    isPrivate: false,
  },
  hwWallet: {
    path: '/hw-wallet-login',
    component: HwWalletLogin,
    isSigninFlow: true,
    isPrivate: false,
  },
  splashscreen: {
    path: '/',
    component: Splashscreen,
    isPrivate: false,
    isSigninFlow: true,
    exact: true,
  },
  register: {
    path: '/register',
    component: Register,
    isPrivate: false,
    isSigninFlow: true,
  },
  login: {
    path: '/login',
    component: Login,
    isPrivate: false,
    isSigninFlow: true,
  },
  termsOfUse: {
    path: '/terms-of-use',
    component: TermsOfUse,
    isPrivate: false,
    isSigninFlow: true,
  },
};
