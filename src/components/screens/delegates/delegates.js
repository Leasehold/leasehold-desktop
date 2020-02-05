import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './delegates.css';
import DelegatesListView from './delegatesListView';
import VotingHeader from './votingHeader';
// import Onboarding from '../../toolbox/onboarding/onboarding';
import { getTotalActions } from '../../../utils/voting';

class Delegates extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      votingModeEnabled: getTotalActions(props.votes) > 0,
    };

    this.toggleVotingMode = this.toggleVotingMode.bind(this);
    // this.getOnboardingSlides = this.getOnboardingSlides.bind(this);
  }

  toggleVotingMode() {
    if (this.state.votingModeEnabled) {
      this.props.clearVotes();
    }
    this.setState({ votingModeEnabled: !this.state.votingModeEnabled });
  }

  getOnboardingSlides() {
    const { t } = this.props;
    return [{
      title: t('Welcome to Leasehold Delegates!'),
      content: t('Leasehold\'s blockchain is based on the Delegated Proof of Stake (DPoS) consensus algorithm, in which 39 delegates are voted in by token holders to secure the network.'),
      illustration: 'welcomeLiskDelegates',
    }, {
      title: t('Your voice matters'),
      content: t('Voting for delegates gives Leasehold users the opportunity to choose who they trust to secure the network and validate the transactions that are sent on it.'),
      illustration: 'yourVoiceMatters',
    }, {
      title: t('Casting a vote'),
      content: t('We encourage community members to research individual delegate contributions to the Leasehold ecosystem before voting. There are several community created sites which can assist with the process.'),
      illustration: 'getRewarded',
    }, {
      title: t('Expand your knowledge'),
      content: t('Want to know more? We’ve got you covered. Read more about Lleasehold’s consensus algorithm and its benefits in the Leasehold Academy.'),
      illustration: 'expandYourKnowledge',
    }];
  }

  render() {
    const {
      account,
      loadDelegates,
      loadVotes,
      t,
      votes,
    } = this.props;
    const { votingModeEnabled } = this.state;
    return (
      <div className={`${grid.row} ${styles.wrapper}`} ref={(el) => { this.root = el; }}>
        {/*
        { account && account.address
          ? (
            <Onboarding
              slides={this.getOnboardingSlides()}
              finalCallback={this.toggleVotingMode}
              actionButtonLabel={t('Start voting')}
              name="delegateOnboarding"
            />
          )
          : null
        }
        */}
        <VotingHeader
          t={t}
          votingModeEnabled={votingModeEnabled}
          toggleVotingMode={this.toggleVotingMode}
          account={account}
          votes={votes}
        />
        <section className={`${grid['col-sm-12']} ${grid['col-md-12']} ${styles.votingBox} ${styles.votes}`}>
          <DelegatesListView
            account={account}
            loadVotes={loadVotes}
            loadDelegates={loadDelegates}
            votingModeEnabled={votingModeEnabled}
          />
        </section>
      </div>
    );
  }
}

export default Delegates;
