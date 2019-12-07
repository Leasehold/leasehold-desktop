import React from 'react';
import { PrimaryButton, TertiaryButton } from '../../toolbox/buttons/button';
import Box from '../../toolbox/box';
import PassphraseBackup from '../../shared/passphraseBackup';
import htmlStringToReact from '../../../utils/htmlStringToReact';
import styles from './secondPassphrase.css';

const FirstStep = ({
  t, goBack, nextStep, account,
}) => (
  <Box>
    <Box.Header>
      <h2>{t('Register 2nd passphrase')}</h2>
    </Box.Header>
    <Box.Content>
      <p className={styles.info}>
        {htmlStringToReact(t('secondPassphraseInfoParagraph', 'After registration, your second passphrase will be <strong>required</strong> when <strong>confirming every transaction</strong> and every vote. You are responsible for safekeeping your second passphrase. No one can restore it, not even Leasehold. Once activated a second passphrase <strong>can’t be turned off.</strong>', { interpolation: { escapeValue: false } }))}
      </p>
      <PassphraseBackup
        account={account}
        t={t}
        passphraseName={t('Second passphrase')}
        paperWalletName="lisk_2nd_passphrase"
      />
    </Box.Content>
    <Box.Footer className="summary-footer">
      <PrimaryButton
        className={`${styles.confirmBtn} large go-to-confirmation`}
        onClick={nextStep}
      >
        {t('Go to confirmation')}
      </PrimaryButton>
      <TertiaryButton
        className={`${styles.editBtn} large go-back`}
        onClick={goBack}
      >
        {t('Go back')}
      </TertiaryButton>
    </Box.Footer>
  </Box>
);

export default FirstStep;
