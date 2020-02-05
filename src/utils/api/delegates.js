import { to } from 'await-to-js';
import Lisk from '@liskhq/lisk-client';
import { getBlocks } from './blocks';
import { getTransactions } from './transactions';
import { loadDelegateCache, updateDelegateCache } from '../delegates';
import { loginType } from '../../constants/hwConstants';
import { splitVotesIntoRounds } from '../voting';
import transactionTypes from '../../constants/transactionTypes';
import { signVoteTransaction } from '../hwManager';

export const getDelegates = (liskAPIClient, options) => liskAPIClient.delegates.get(options);

export const getDelegateInfo = (liskAPIClient, { address, publicKey }) => (
  new Promise(async (resolve, reject) => {
    try {
      const response = await getDelegates(liskAPIClient, { address });
      const delegate = response.data[0];
      updateDelegateCache(response.data, liskAPIClient.networkConfig);
      if (delegate) {
        const txDelegateRegister = (await getTransactions({
          liskAPIClient, address, limit: 1, type: transactionTypes.registerDelegate,
        })).data[0];
        const blocks = await getBlocks(liskAPIClient, {
          generatorPublicKey: publicKey, limit: 1,
        });
        resolve({
          ...delegate,
          lastBlock: (blocks.data[0] && blocks.data[0].timestamp) || '-',
          txDelegateRegister,
        });
      } else {
        reject(new Error(`"${address}" is not a delegate`));
      }
    } catch (e) {
      reject(e);
    }
  })
);

export const getDelegateWithCache = (liskAPIClient, { publicKey }) => (
  new Promise(async (resolve, reject) => {
    const storedDelegate = loadDelegateCache(liskAPIClient.networkConfig)[publicKey];
    if (storedDelegate) {
      resolve(storedDelegate);
    } else {
      const [error, response] = await to(getDelegates(liskAPIClient, { publicKey }));
      if (error) {
        reject(error);
      } else if (response.data[0]) {
        updateDelegateCache(response.data, liskAPIClient.networkConfig);
        resolve(response.data[0]);
      } else {
        reject(new Error(`No delegate with publicKey ${publicKey} found.`));
      }
    }
  })
);

// eslint-disable-next-line max-statements
export const getDelegateByName = (liskAPIClient, name) => new Promise(async (resolve, reject) => {
  const storedDelegate = loadDelegateCache(liskAPIClient.networkConfig)[name];
  if (storedDelegate) {
    resolve(storedDelegate);
  } else {
    const [error, response] = await to(liskAPIClient.delegates.get({ search: name, limit: 39 }));
    if (error) {
      reject(error);
    } else {
      const delegate = response.data.find(({ username }) => username === name);
      if (delegate) {
        resolve(delegate);
      } else {
        reject(new Error(`No delegate with name ${name} found.`));
      }
      updateDelegateCache(response.data, liskAPIClient.networkConfig);
    }
  }
});

const voteWithPassphrase = (
  passphrase,
  votes,
  unvotes,
  secondPassphrase,
  timeOffset,
) => (Promise.all(splitVotesIntoRounds({ votes: [...votes], unvotes: [...unvotes] })
  // eslint-disable-next-line no-shadow
  .map(({ votes, unvotes }) => (Lisk.transaction.castVotes(
    {
      votes,
      unvotes,
      passphrase,
      secondPassphrase,
      timeOffset,
    },
  ))))
);

export const castVotes = async ({
  liskAPIClient,
  account,
  votedList,
  unvotedList,
  secondPassphrase,
  timeOffset,
}) => {
  const signedTransactions = account.loginType === loginType.normal
    ? await voteWithPassphrase(
      account.passphrase,
      votedList,
      unvotedList,
      secondPassphrase,
      timeOffset,
    )
    : await signVoteTransaction(account, votedList, unvotedList, timeOffset);

  return Promise.all(signedTransactions.map(transaction => (
    new Promise((resolve, reject) => {
      liskAPIClient.transactions.broadcast(transaction)
        .then(() => resolve(transaction))
        .catch(reject);
    })
  )));
};

export const getVotes = (liskAPIClient, { address }) =>
  liskAPIClient.votes.get({ address, limit: 39, offset: 0 });

export const registerDelegate = (
  liskAPIClient,
  username,
  passphrase,
  secondPassphrase = null,
  timeOffset,
) => {
  const data = { username, passphrase, timeOffset };
  if (secondPassphrase) {
    data.secondPassphrase = secondPassphrase;
  }
  return new Promise((resolve, reject) => {
    const transaction = Lisk.transaction.registerDelegate({ ...data });
    liskAPIClient.transactions
      .broadcast(transaction)
      .then(() => {
        resolve(transaction);
      })
      .catch(reject);
  });
};
