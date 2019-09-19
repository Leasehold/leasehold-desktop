import { cryptography } from '@liskhq/lisk-client';
import PropTypes from 'prop-types';
import React from 'react';
import { Input } from '../../toolbox/inputs';
import { PrimaryButton, TertiaryButton } from '../../toolbox/buttons/button';
import { parseSearchParams } from '../../../utils/searchParams';
import Box from '../../toolbox/box';
import Icon from '../../toolbox/icon';
import Tooltip from '../../toolbox/tooltip/tooltip';
import styles from './verifyMessage.css';

export default class VerifyMessageInput extends React.Component {
  constructor(props) {
    super(props);

    const { t } = props;
    const valuesFromNextStep = props.prevState.inputs || {};

    this.inputs = [
      {
        name: 'message',
        placeholder: t('Write a message'),
        label: t('Message'),
      }, {
        name: 'publicKey',
        placeholder: t('Public key'),
        label: t('Public key'),
      }, {
        name: 'signature',
        placeholder: t('Signature'),
        label: t('Signature'),
      },
    ];

    this.textarea = {
      name: 'signedMessage',
      placeholder: t('Enter the entire signature generated by Lisk Hub'),
      label: t('Signed Message'),
      type: 'textarea',
    };

    this.state = {
      inputs: [...this.inputs, this.textarea].reduce((inputs, { name }) => ({
        ...inputs,
        [name]: {
          value: valuesFromNextStep[name] || parseSearchParams(props.history.location.search)[name] || '',
          feedback: '',
        },
      }), {}),
      isInputsView: true,
    };

    this.goNext = this.goNext.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeViewToInputs = this.changeView.bind(this, true);
    this.changeViewToTextarea = this.changeView.bind(this, false);
  }

  getInputError({ target: { name, value } }) {
    const { t } = this.props;
    const validators = {
      publicKey: () => {
        try {
          cryptography.getAddressFromPublicKey(value);
          return '';
        } catch (e) {
          return t('This is not a valid public key. Please enter the correct public key.');
        }
      },
    };
    const input = [...this.inputs, this.textarea].find(({ name: n }) => name === n);
    const inputLabel = input && input.label.toLowerCase();
    const emptyError = value === '' ? t('The {{inputLabel}} can\'t be empty', { inputLabel }) : '';
    return validators[name] ? validators[name]() : emptyError;
  }

  handleChange({ target }) {
    this.setState({
      inputs: {
        ...this.state.inputs,
        [target.name]: {
          value: target.value,
          feedback: this.getInputError({ target }),
        },
      },
    });
  }

  getInputs() {
    const { inputs, isInputsView } = this.state;
    if (isInputsView) {
      return {
        message: inputs.message.value,
        publicKey: inputs.publicKey.value,
        signature: inputs.signature.value,
      };
    }
    const separators = ['MESSAGE', 'PUBLIC KEY', 'SIGNATURE', 'END LISK SIGNED MESSAGE'].join('|');
    const parsedMessage = inputs.signedMessage.value.split(new RegExp(`\n?-----(${separators})-----\n?`));
    return {
      message: parsedMessage[2],
      publicKey: parsedMessage[4],
      signature: parsedMessage[6],
    };
  }

  goNext() {
    this.props.nextStep({ inputs: this.getInputs() });
  }

  changeView(isInputsView) {
    this.setState({ isInputsView });
  }

  get activeViewInputs() {
    const { isInputsView } = this.state;
    return isInputsView ? this.inputs : [this.textarea];
  }

  get canSubmit() {
    const { inputs } = this.state;
    return this.activeViewInputs.every(({ name }) => (
      inputs[name].value && !inputs[name].feedback
    ));
  }

  render() {
    const { t, history } = this.props;
    const { inputs, isInputsView } = this.state;

    return (
      <Box main>
        <Box.Header>
          <h1>{t('Verify message')}</h1>
        </Box.Header>
        <Box.Content>
          <Box.InfoText>
            {t('Use this tool to verify the validity of a signed message. This allows you to ensure that the person who signed the message was in fact the account owner')}
            <Tooltip className="showOnBottom">
              <p>{t('If you would like to ensure the ownership of another account, you can send a message via Lisk Hub and request the recipient to sign it.')}</p>
            </Tooltip>
          </Box.InfoText>
          <div className={styles.inputViewSwitcher}>
            {t('Input view')}
            <Icon
              className="inputs-view-icon"
              name={`verifyMessageInputsView${!isInputsView ? '' : 'Active'}`}
              onClick={this.changeViewToInputs}
            />
            <Icon
              className="textarea-view-icon"
              name={`verifyMessageTextareaView${isInputsView ? '' : 'Active'}`}
              onClick={this.changeViewToTextarea}
            />
          </div>
          {this.activeViewInputs.map(({
            name, placeholder, label, type,
          }) => (
            <Input
              key={name}
              name={name}
              className={[name, styles[name]].filter(Boolean).join(' ')}
              placeholder={placeholder}
              label={label}
              value={inputs[name].value}
              error={!!inputs[name].feedback}
              feedback={inputs[name].feedback}
              onChange={this.handleChange}
              type={type}
            />
          ))}
        </Box.Content>
        <Box.Footer>
          <PrimaryButton
            onClick={this.goNext}
            disabled={!this.canSubmit}
            className="continue"
          >
            {t('Continue')}
          </PrimaryButton>
          <TertiaryButton onClick={history.goBack} className="go-back">{t('Go back')}</TertiaryButton>
        </Box.Footer>
      </Box>
    );
  }
}

VerifyMessageInput.propTypes = {
  history: PropTypes.object.isRequired,
  nextStep: PropTypes.func,
  t: PropTypes.func.isRequired,
  prevState: PropTypes.object,
};

VerifyMessageInput.defaultProps = {
  prevState: {},
};
