import React from 'react';
import { Link } from 'react-router-dom';
import Dropdown from '../../../../toolbox/dropdown/dropdown';
import styles from './userAccount.css';
import Icon from '../../../../toolbox/icon';
import { tokenKeys } from '../../../../../constants/tokens';
import routes from '../../../../../constants/routes';
import externalLinks from '../../../../../constants/externalLinks';
import DropdownButton from '../../../../toolbox/dropdownButton';
import { SecondaryButton } from '../../../../toolbox/buttons/button';
import AccountInfo from './accountInfo';

class UserAccount extends React.Component {
  constructor(props) {
    super(props);

    this.setChildRef = this.setChildRef.bind(this);
    this.handleTokenSelect = this.handleTokenSelect.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  handleTokenSelect(token) {
    this.props.settingsUpdated({ token: { active: token } });
    this.toggleDropdown();
  }

  handleLogout() {
    this.props.onLogout();
    this.toggleDropdown();
  }

  setChildRef(node) {
    this.childRef = node;
  }

  toggleDropdown() {
    this.childRef.toggleDropdown();
  }

  render() {
    const {
      token, t, account, isUserLogout, signInHolderClassName,
    } = this.props;

    /* istanbul ignore next */
    const enabledTokens = tokenKeys.filter(key => token.list[key]);
    const isUserDataFetched = account.info && account.info[token.active] && (
      !!account.info[token.active].balance
      || account.info[token.active].balance === 0
    );

    const renderAccountInfoOrIcon = !isUserLogout && isUserDataFetched
      ? (
        <AccountInfo
          className="active-info"
          account={account.info[token.active]}
          token={token.active}
          t={t}
        />
      )
      : (
        <span className={`${styles.signInHolder} ${signInHolderClassName}`}>
          <Icon name="user" />
        </span>
      );

    return (
      <DropdownButton
        buttonClassName={`${styles.wrapper} user-account`}
        className={styles.dropdown}
        buttonLabel={renderAccountInfoOrIcon}
        ButtonComponent={SecondaryButton}
        align="right"
        ref={this.setChildRef}
      >
        {
          isUserDataFetched && enabledTokens.map(tokenKey => (account.info[tokenKey]
            ? ([
              <span
                className={`${styles.accountHolder} ${tokenKey} token`}
                key={tokenKey}
                onClick={() => this.handleTokenSelect(tokenKey)}
              >
                <AccountInfo
                  account={account.info[tokenKey]}
                  token={tokenKey}
                  t={t}
                />
                {
                  tokenKey === token.active
                    ? <span className={styles.activeLabel}>{t('Active')}</span>
                    : null
                }
              </span>,
              <Dropdown.Separator key={`separator-${tokenKey}`} className={styles.separator} />,
            ])
            : null
          ))
        }

        <a
          className={styles.dropdownOption}
          href={externalLinks.discord}
          rel="noopener noreferrer"
          target="_blank"
          onClick={this.toggleDropdown}
        >
          <Icon name="discordIcon" className={styles.defaultIcon} />
          <Icon name="discordIconActive" className={styles.activeIcon} />
          <span>{t('Discord')}</span>
        </a>

        <Link
          id="settings"
          to={routes.settings.path}
          className={styles.dropdownOption}
          onClick={this.toggleDropdown}
        >
          <Icon name="settings" className={styles.defaultIcon} />
          <Icon name="settingsActive" className={styles.activeIcon} />
          <span>{t('Settings')}</span>
        </Link>

        <Dropdown.Separator className={styles.separator} />

        {
          isUserLogout
            ? (
              <Link
                className={`${styles.dropdownOption} signIn`}
                to={routes.login.path}
                onClick={this.toggleDropdown}
              >
                <Icon name="signin" className={styles.defaultIcon} />
                <Icon name="signinActive" className={styles.activeIcon} />
                <span>{t('Sign in')}</span>
              </Link>
            )
            : (
              <span
                className={`${styles.dropdownOption} logout`}
                onClick={this.handleLogout}
              >
                <Icon name="logout" className={styles.defaultIcon} />
                <Icon name="logoutActive" className={styles.activeIcon} />
                <span>{t('Sign out')}</span>
              </span>
            )
        }
      </DropdownButton>
    );
  }
}

export default UserAccount;
