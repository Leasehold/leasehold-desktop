import React from 'react';
import { translate } from 'react-i18next';
import { Line as LineChart } from 'react-chartjs-2';
import BoxV2 from '../boxV2';
import styles from './balanceChart.css';
import * as ChartUtils from '../../utils/balanceChart';

class BalanceGraph extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  shouldComponentUpdate(nextProps) {
    if (this.props.transactions.length !== nextProps.transactions.length) {
      return true;
    }
    return false;
  }

  render() {
    const {
      t, transactions, balance, address,
    } = this.props;

    const format = ChartUtils.getChartDateFormat(transactions);

    const data = ChartUtils.getBalanceData.bind(null, {
      transactions,
      balance,
      address,
      format,
    });

    return (
      <BoxV2 className={`${styles.wrapper}`}>
        <header>
          <h1>{t('Balance details')}</h1>
        </header>
        <main className={`${styles.content}`}>
          <div className={`${styles.graphHolder}`}>
            <LineChart
              options={ChartUtils.graphOptions(format)}
              data={data} />
          </div>
        </main>
      </BoxV2>
    );
  }
}

export default translate()(BalanceGraph);
