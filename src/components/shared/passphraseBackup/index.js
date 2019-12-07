// import QRCode from 'qrcode.react';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import moment from 'moment';
import { Input } from '../../toolbox/inputs';
import { SecondaryButton } from '../../toolbox/buttons/button';
import CopyToClipboard from '../../toolbox/copyToClipboard';
// import Icon from '../../toolbox/icon';
import Tooltip from '../../toolbox/tooltip/tooltip';
import renderPaperwallet from '../../../utils/paperwallet';
import styles from './passphraseBackup.css';

class PassphraseBackup extends React.Component {
  constructor(props) {
    super();

    this.walletName = `${props.paperWalletName}_${moment().format('YYYY_MM_DD_HH_mm')}.pdf`;
    this.generatePaperwallet = this.generatePaperwallet.bind(this);
    this.setCanvasRef = this.setCanvasRef.bind(this);
  }

  /* istanbul ignore next */
  generatePaperwallet() {
    const data = {
      ...this.props,
      qrcode: this.canvasRef.firstChild.toDataURL(),
    };
    renderPaperwallet(data, this.walletName);
  }

  setCanvasRef(node) {
    this.canvasRef = node;
  }

  render() {
    const {
      t, account,
    } = this.props;

    return (
      <React.Fragment>
        <div className={`${styles.optionsHolder}`}>
          <div className={`${styles.option}`}>
            <div className={`${styles.optionContent}`}>
              <h2>
                {t('Passphrase')}

                <Tooltip
                  title={t('Save the passphrase')}
                >
                  <p>
                    {
                    t('Be sure to store your passphrase in a safe place. We highly recommend using a password manager or paperwallet.')
                  }
                  </p>
                </Tooltip>

              </h2>
              <div className={`${styles.inputs} ${grid.row} passphrase`}>
                {account.passphrase.split(' ').map((value, i) => (
                  <span key={i} className={`${grid['col-xs-2']}`}>
                    <Input
                      readOnly
                      value={value}
                    />
                  </span>
                ))}
              </div>
              <CopyToClipboard
                value={account.passphrase}
                text={t('Copy to clipboard')}
                copyClassName={styles.copyIcon}
                Container={SecondaryButton}
                containerProps={{ size: 'xs' }}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PassphraseBackup;
