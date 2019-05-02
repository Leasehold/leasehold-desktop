import React from 'react';
import { TertiaryButtonV2 } from '../toolbox/buttons/button';
import illustration from '../../assets/images/illustrations/illustration-ledger-nano-light.svg';

class UnlockDevice extends React.Component {
  componentDidMount() {
    this.goNextIfAppIsOpen();
  }

  componentDidUpdate() {
    this.goNextIfAppIsOpen();
  }

  goNextIfAppIsOpen() {
    const connectedDevice = this.props.devices.find(d => d.deviceId === this.props.deviceId);
    if (connectedDevice && (connectedDevice.openApp || /(trezor(\s?))/ig.test(connectedDevice.model))) {
      this.props.nextStep();
    }
  }

  render() {
    const { t, prevStep, deviceModel = 'Ledger S' } = this.props;
    return (
      <React.Fragment>
        <h1>{t('{{deviceModel}} connected! Open the Lisk app on the device', { deviceModel })}</h1>
        <p>
        {
          t('If you’re not sure how to do this please follow the')
        } <a href="https://support.ledger.com/hc/en-us/categories/115000820045-Ledger-Nano-S"
          target="_blank"
          rel='noopener noreferrer'
          >
            {t('Official guidelines')}
          </a>
        </p>
        <img src={illustration} />
        <TertiaryButtonV2 onClick={prevStep}>
          {t('Go Back')}
        </TertiaryButtonV2>
      </React.Fragment>
    );
  }
}

export default UnlockDevice;