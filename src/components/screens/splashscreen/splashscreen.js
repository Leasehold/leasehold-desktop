import React from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { to } from 'await-to-js';
import routes from '../../../constants/routes';
import { getAutoLogInData, findMatchingLoginNetwork } from '../../../utils/login';
import { parseSearchParams } from '../../../utils/searchParams';
import { PrimaryButton, SecondaryButton } from '../../toolbox/buttons/button';
import { getNetworksList } from '../../../utils/getNetwork';
import networks from '../../../constants/networks';
import styles from './splashscreen.css';
import Tooltip from '../../toolbox/tooltip/tooltip';

class Splashscreen extends React.Component {
  constructor() { // eslint-disable-line max-statements
    super();
    const { liskCoreUrl } = getAutoLogInData();
    let loginNetwork = findMatchingLoginNetwork();
    let address = '';

    if (loginNetwork) {
      loginNetwork = loginNetwork.slice(-1).shift();
    } else if (!loginNetwork) {
      loginNetwork = liskCoreUrl ? networks.customNode : networks.default;
      address = liskCoreUrl || '';
    }

    this.state = {
      isValid: false,
      passphrase: '',
      network: loginNetwork.code,
      address,
    };

    this.secondIteration = false;

    this.networks = getNetworksList();
    this.checkNodeStatus = this.checkNodeStatus.bind(this);
  }

  componentDidMount() {
    if (!this.props.settings.areTermsOfUseAccepted) {
      this.props.history.push(routes.termsOfUse.path);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.account
      && this.props.account.address
      && !this.alreadyLoggedWithThisAddress(prevProps.account.address, prevProps.network)) {
      this.redirectToReferrer();
    }
  }

  getReferrerRoute() {
    const search = parseSearchParams(this.props.history.location.search);
    const dashboardRoute = `${routes.dashboard.path}`;
    const referrerRoute = search.referrer ? search.referrer : dashboardRoute;
    return referrerRoute;
  }

  redirectToReferrer() {
    const referrerRoute = this.getReferrerRoute();
    this.props.history.replace(referrerRoute);
  }

  alreadyLoggedWithThisAddress(address, prevNetwork) {
    const { account, settings: { token }, network } = this.props;
    return account
      && network
      && account.address === address
      && network.name === prevNetwork.name
      && network.networks[token.active].nodeUrl === prevNetwork.networks[token.active].nodeUrl;
  }

  async checkNodeStatus() {
    const { errorToastDisplayed, history, liskAPIClient } = this.props;
    // istanbul ignore else
    if (liskAPIClient) {
      const [error, response] = await to(liskAPIClient.node.getConstants());
      if (response) history.push(routes.dashboard.path);
      if (error) errorToastDisplayed({ label: `Unable to connect to the node, Error: ${error.message}` });
    }
  }

  render() {
    const { t } = this.props;

    return (
      <div className={`${styles.splashscreen}`}>
        <div className={`${styles.wrapper}`}>
          <div className={`${styles.titleHolder}`}>
            <h1>{t('Welcome to the Leasehold Hub!')}</h1>
            <p>
              {
              t('Create an account or sign in to manage your LSH, vote for who secures the network or become a delegate.')
            }
            </p>
          </div>
          <Link className={`${styles.button} login-button`} to={routes.login.path}>
            <SecondaryButton className="light">{t('Sign in')}</SecondaryButton>
          </Link>
          <Link className={`${styles.button} new-account-button`} to={routes.register.path}>
            <PrimaryButton>{t('Create an account')}</PrimaryButton>

          </Link>
          <span className={styles.separator}>
            <span>{t('or')}</span>
          </span>
          <span className={styles.linkWrapper}>
            <span
              className={`${styles.link} explore-as-guest-button`}
              onClick={this.checkNodeStatus}
            >
              {t('Explore as a guest')}
            </span>
            <Tooltip
              className={`${styles.tooltip}`}
              styles={{ infoIcon: styles.infoIcon }}
              title={t('Guest mode')}
            >
              <React.Fragment>
                <p className={`${styles.tooltipText}`}>
                  {t('You can explore Lisk network using Hub without signing in.')}
                </p>
                <p className={`${styles.tooltupText}`}>
                  {t('You won\'t be able to make any transactions and all the content will be in read-only mode.')}
                </p>
              </React.Fragment>
            </Tooltip>
          </span>

          <span className={styles.linkWrapper}>
            <Link className={`${styles.link} signin-hwWallet-button`} to={routes.hwWallet.path}>
              {t('Sign in with a hardware wallet')}
            </Link>
          </span>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Splashscreen);
