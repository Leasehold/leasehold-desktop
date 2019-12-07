import React, { Component } from 'react';
import { tokenMap } from '../../../../constants/tokens';
import Box from '../../../toolbox/box';
import Icon from '../../../toolbox/icon';
import TransactionList from './transactionList';
import styles from './recentTransactions.css';
import txFilters from '../../../../constants/transactionFilters';

class RecentTransactions extends Component {
  constructor(props) {
    super(props);

    if (!props.transactions.length && props.account.address) {
      props.getTransactions({
        address: props.account.address,
        filters: {
          direction: txFilters.all,
        },
      });
    }
  }

  render() {
    const {
      account,
      bookmarks,
      className,
      isLoggedIn,
      settings,
      t,
      transactions,
    } = this.props;
    const activeToken = tokenMap[settings.token.active];

    return (
      <Box className={`${styles.box} ${className}`}>
        <Box.Header>
          <h2 className={styles.title}>{t('Recent {{value}} transactions', { value: activeToken.label })}</h2>
        </Box.Header>
        {
          isLoggedIn && transactions.length
            ? (
              <TransactionList
                account={account}
                activeToken={activeToken.key}
                bookmarks={bookmarks}
                transactions={transactions}
                t={t}
              />
            )
            : null
        }
        {
          isLoggedIn && !transactions.length
            ? (
              <Box.EmptyState>
                <Icon name="iconEmptyRecentTransactions" />
                <h1>{t('No Transactions Yet')}</h1>
                <p>{t('A great way to start is to top up your account with some LSH tokens.', { value: activeToken.key })}</p>
              </Box.EmptyState>
            )
            : null
        }
        {
          !isLoggedIn
            ? (
              <Box.EmptyState>
                <Icon name="iconEmptyRecentTransactions" />
                <h1>{t('Sign in to view recent transactions')}</h1>
                <p>{t('In order to see your recent transactions you need to sign in.')}</p>
              </Box.EmptyState>
            )
            : null
        }
      </Box>
    );
  }
}

export default RecentTransactions;
