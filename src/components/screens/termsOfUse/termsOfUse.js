import React from 'react';
import Piwik from '../../../utils/piwik';
import { PrimaryButton } from '../../toolbox/buttons/button';
import Icon from '../../toolbox/icon';
import routes from '../../../constants/routes';
import styles from './termsOfUse.css';

class TermsOfUse extends React.Component {
  constructor() {
    super();

    this.onAccept = this.onAccept.bind(this);
  }

  componentDidMount() {
    this.onTermsOfUseAlreadyAccepted();
  }

  componentDidUpdate() {
    this.onTermsOfUseAlreadyAccepted();
  }

  onTermsOfUseAlreadyAccepted() {
    // istanbul ignore else
    if (this.props.settings.areTermsOfUseAccepted) {
      this.props.history.push(routes.splashscreen.path);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  checkTermsOfUse() {
    Piwik.trackingEvent('SplashScreen', 'Link', 'Terms of Use');
  }

  onAccept() {
    Piwik.trackingEvent('SplashScreen', 'Button', 'Accept Terms of Use');
    this.props.settingsUpdated({ areTermsOfUseAccepted: true });
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <Icon name="liskLogo" />
        </header>
        <div className={styles.content}>
          <h1>{this.props.t('Leasehold Terms of Use')}</h1>
          <p>
            {this.props.t('Before you continue using Leasehold Hub, please read and accept the')}
            <a
              onClick={this.checkTermsOfUse}
              href="https://lisk.io/terms-conditions"
              target="_blank"
              rel="noopener noreferrer"
            >
              {this.props.t('Terms of Use')}
            </a>
          </p>
          <PrimaryButton onClick={this.onAccept} className="accept-terms">
            {this.props.t('I have read and agree to the Terms of Use')}
          </PrimaryButton>
        </div>
      </div>
    );
  }
}

export default TermsOfUse;
