import {
  accountDataUpdated,
  updateEnabledTokenAccount,
  login,
} from '../../actions/account';
import {
  emptyTransactionsData,
  getTransactions,
  updateTransactions,
} from '../../actions/transactions';
import { getActiveTokenAccount } from '../../utils/account';
import { getAutoLogInData, shouldAutoLogIn, findMatchingLoginNetwork } from '../../utils/login';
import { loadVotes } from '../../actions/voting';
import { networkSet, networkStatusUpdated } from '../../actions/network';
import actionTypes from '../../constants/actions';
// import analytics from '../../utils/analytics';
import localJSONStorage from '../../utils/localJSONStorage';
import networks from '../../constants/networks';
import settings from '../../constants/settings';
import transactionTypes from '../../constants/transactionTypes';
import txFilters from '../../constants/transactionFilters';

const updateAccountData = (store) => {
  const { transactions } = store.getState();
  const account = getActiveTokenAccount(store.getState());

  store.dispatch(accountDataUpdated({
    transactions,
    account,
  }));

  /**
   * NOTE: dashboard transactionsList are not loaded when rendering the component,
   *  as this component just reads transactions from state.
   *  When autologin in, we need to explicitly request the transactions for that account.
   *
   *  Ignoring coverage because autologin is a development feature not accessible by end users
   */
  /* istanbul ignore if */
  if (shouldAutoLogIn(getAutoLogInData())) {
    store.dispatch(getTransactions({
      address: account.address,
      filter: txFilters.all,
    }));
  }
};

const getRecentTransactionOfType = (transactionsList, type) => (
  transactionsList.filter(transaction => (
    transaction.type === type
    // limit the number of confirmations to 5 to not fire each time there is another new transaction
    // theoretically even less then 5, but just to be on the safe side
    && transaction.confirmations < 5))[0]
);

const votePlaced = (store, action) => {
  const voteTransaction = getRecentTransactionOfType(action.data.confirmed, transactionTypes.vote);

  if (voteTransaction) {
    const state = store.getState();
    const { account } = state;

    store.dispatch(loadVotes({
      address: account.info.LSK.address,
      type: 'update',
    }));
  }
};

const checkTransactionsAndUpdateAccount = (store, action) => {
  const state = store.getState();
  const { transactions, settings: { token } } = state;
  const account = getActiveTokenAccount(store.getState());

  const txs = action.data.block.transactions || [];
  const blockContainsRelevantTransaction = txs.filter((transaction) => {
    const sender = transaction ? transaction.senderId : null;
    const recipient = transaction ? transaction.recipientId : null;
    return account.address === recipient || account.address === sender;
  }).length > 0;

  const recentBtcTransaction = token.active === 'BTC'
    && transactions.confirmed.filter(t => t.confirmations === 1).length > 0;

  if (blockContainsRelevantTransaction || recentBtcTransaction) {
    // it was not getting the account with secondPublicKey right
    // after a new block with second passphrase registration transaction was received
    // Adding timeout explained in
    // https://github.com/LiskHQ/lisk-hub/pull/1609
    setTimeout(() => {
      updateAccountData(store);

      store.dispatch(updateTransactions({
        pendingTransactions: transactions.pending,
        address: account.address,
        filters: transactions.filters,
      }));
    }, 500);
  }
};

// istanbul ignore next
const getNetworkFromLocalStorage = () => {
  const mySettings = localJSONStorage.get('settings', {});
  if (!mySettings.network) return networks.mainnet;
  return {
    ...Object.values(networks).find(
      ({ name }) => name === mySettings.network.name,
    ) || networks.mainnet,
    address: mySettings.network.address,
  };
};

// eslint-disable-next-line max-statements
const checkNetworkToConnet = (storeSettings) => {
  const autologinData = getAutoLogInData();
  let loginNetwork = findMatchingLoginNetwork();

  if (loginNetwork) {
    const net = loginNetwork.slice(-1).shift();
    loginNetwork = {
      name: net.name,
      network: {
        ...net,
      },
    };
  }

  if (!loginNetwork && autologinData.liskCoreUrl) {
    loginNetwork = {
      name: networks.customNode.name,
      passphrase: autologinData[settings.keys.loginKey],
      network: { ...networks.customNode, address: autologinData[settings.keys.liskCoreUrl] },
      options: {
        code: networks.customNode.code,
        address: autologinData[settings.keys.liskCoreUrl],
      },
    };
  }

  // istanbul ignore next
  if (!loginNetwork && !autologinData.liskCoreUrl) {
    if (storeSettings.showNetwork) {
      const currentNetwork = getNetworkFromLocalStorage();
      loginNetwork = {
        name: currentNetwork.name,
        network: {
          ...currentNetwork,
        },
      };
    } else {
      loginNetwork = {
        name: networks.mainnet.name,
        network: {
          ...networks.mainnet,
        },
      };
    }
  }

  return loginNetwork;
};

// eslint-disable-next-line max-statements
const autoLogInIfNecessary = async (store) => {
  const actualSettings = store && store.getState().settings;
  const autologinData = getAutoLogInData();

  const loginNetwork = checkNetworkToConnet(actualSettings);

  store.dispatch(await networkSet(loginNetwork));
  store.dispatch(networkStatusUpdated({ online: true }));

  if (shouldAutoLogIn(autologinData)) {
    setTimeout(() => {
      store.dispatch(login({ passphrase: autologinData[settings.keys.loginKey] }));
    }, 500);
  }

  // if (!actualSettings.statistics) {
  //  analytics.checkIfAnalyticsShouldBeDisplayed({ settings: actualSettings });
  // }
};

const accountMiddleware = store => next => (action) => {
  next(action);
  switch (action.type) {
    case actionTypes.storeCreated:
      autoLogInIfNecessary(store, next, action);
      break;
    case actionTypes.newBlockCreated:
      checkTransactionsAndUpdateAccount(store, action);
      break;
    case actionTypes.updateTransactions:
      votePlaced(store, action);
      break;
    case actionTypes.accountLoggedOut:
      store.dispatch(emptyTransactionsData());
      break;
    case actionTypes.settingsUpdated: {
      const tokensList = action.data.token && action.data.token.list;
      const token = tokensList && Object.keys(tokensList)
        .find(t => tokensList[t]);
      if (tokensList && tokensList[token]) {
        store.dispatch(updateEnabledTokenAccount(token));
      }
      break;
    }
    /* istanbul ignore next */
    default: break;
  }
};

export default accountMiddleware;
