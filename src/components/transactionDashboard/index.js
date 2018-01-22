import React from 'react';
import { connect } from 'react-redux';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Transactions from './../transactions';
import { transactionsFilterSet } from '../../actions/transactions';
import Send from '../send';
import txFilters from './../../constants/transactionFilters';
import styles from './styles.css';

class TransactionsDashboard extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.transactions.filter !== txFilters.all) {
      this.props.transactionsFilterSet({ filter: txFilters.all });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    return <div className={`${grid.row} ${styles.wrapper}`}>
      <div className={`${grid['col-md-4']} ${styles.gridPadding}`}>
        <Send/>
      </div>
      <div className={`${grid['col-sm-12']} ${styles.transactions} ${grid['col-md-8']}`}>
        <Transactions></Transactions>
      </div>
    </div>;
  }
}

const mapStateToProps = state => ({
  transactions: [...state.transactions.pending, ...state.transactions.confirmed],
});


const mapDispatchToProps = dispatch => ({
  transactionsFilterSet: data => dispatch(transactionsFilterSet(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsDashboard);
