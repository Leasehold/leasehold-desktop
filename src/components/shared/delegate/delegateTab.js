import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/min/moment-with-locales';
import { withTranslation } from 'react-i18next';
import voting from '../../../constants/voting';
import Box from '../../toolbox/box';
import { formatAmountBasedOnLocale } from '../../../utils/formattedNumber';
import { getUnixTimestampFromValue } from '../../../utils/datetime';
import LiskAmount from '../liskAmount';
import i18n from '../../../i18n';
import styles from './delegateTab.css';

const DelegateTab = ({ delegate, account, t }) => {
  moment.locale(i18n.language);
  delegate = {
    ...account.delegate,
    ...delegate.data,
  };
  const status = delegate && delegate.rank && delegate.rank <= voting.maxCountOfVotes ? t('Active') : t('Standby');
  const timeFromLastBlock = delegate.lastBlock !== '-'
    ? moment(getUnixTimestampFromValue(delegate.lastBlock)).format(t('DD MMM YY, HH:mm'))
    : '-';
  const delegateSince = delegate.txDelegateRegister
    ? getUnixTimestampFromValue(delegate.txDelegateRegister.timestamp)
    : '-';

  return (
    <Box>
      <Box.Header>
        <h1>{t('Delegate stats')}</h1>
      </Box.Header>
      <Box.Content className={styles.wrapper}>
        <ul className={styles.delegateStats}>
          <li className="rank">
            <span className={styles.label}>{t('Rank')}</span>
            {delegate.rank}
          </li>
          <li className="status">
            <span className={styles.label}>{t('Status')}</span>
            {status}
          </li>
          <li className="delegate-since">
            <span className={styles.label}>{t('Delegate since')}</span>
            {moment(delegateSince).format(t('DD MMM YYYY'))}
          </li>
          <li className="vote">
            <span className={styles.label}>{t('Vote weight')}</span>
            <span>
              <LiskAmount val={delegate.vote} />
              {` ${t('LSH')}`}
            </span>
          </li>
          <li className="approval">
            <span className={styles.label}>{t('Approval')}</span>
            {`${formatAmountBasedOnLocale({ value: delegate.approval })}%`}
          </li>
          <li className="productivity">
            <span className={styles.label}>{t('Productivity')}</span>
            {`${formatAmountBasedOnLocale({ value: delegate.productivity })}%` }
          </li>
          <li className="blocks">
            <span className={styles.label}>{t('Blocks forged')}</span>
            {`${delegate.producedBlocks} (${delegate.missedBlocks})`}
          </li>
          <li className="forged">
            <span className={styles.label}>{t('LSH forged')}</span>
            <span>
              <LiskAmount val={delegate.rewards} />
              {` ${t('LSH')}`}
            </span>
          </li>
          <li className="last-forged">
            <span className={styles.label}>{t('Last Forged Block')}</span>
            {timeFromLastBlock}
          </li>
        </ul>
      </Box.Content>
    </Box>
  );
};

DelegateTab.propTypes = {
  delegate: PropTypes.shape({
    data: PropTypes.shape({
      account: PropTypes.shape({
        publicKey: PropTypes.string.isRequired,
      }),
      approval: PropTypes.number,
      missedBlocks: PropTypes.number,
      producedBlocks: PropTypes.number,
      productivity: PropTypes.number,
      rank: PropTypes.number,
      rewards: PropTypes.string,
      username: PropTypes.string,
      vote: PropTypes.string,
      lastBlock: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      txDelegateRegister: PropTypes.shape({
        timestamp: PropTypes.number.isRequired,
      }),
    }).isRequired,
  }).isRequired,
  account: PropTypes.shape({
    publicKey: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }).isRequired,
};

DelegateTab.defaultProps = {
  delegate: {
    data: {
      account: {
        publicKey: '',
      },
      approval: 0,
      missedBlocks: 0,
      producedBlocks: 0,
      productivity: 0,
      rank: 0,
      rewards: '',
      username: '',
      vote: '',
      lastBlock: '-',
      txDelegateRegister: { timestamp: 0 },
    },
  },
};

export default withTranslation()(DelegateTab);
