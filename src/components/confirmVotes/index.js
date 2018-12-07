/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { votePlaced } from '../../actions/voting';
import ConfirmVotes from './confirmVotes';

const mapStateToProps = state => ({
  votes: state.voting.votes,
  delegates: state.voting.delegates,
  account: state.account,
});

const mapDispatchToProps = {
  votePlaced,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(ConfirmVotes));
