import { translate } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { FontIcon } from '../fontIcon';
import Input from '../toolbox/inputs/input';
import PassphrasePartial from './../passphrasePartial';
import { inDictionary } from '../../utils/similarWord';
import { isValidPassphrase } from '../../utils/passphrase';
import styles from './passphraseInput.css';
import keyCodes from './../../constants/keyCodes';

class PassphraseInput extends React.Component {
  constructor() {
    super();
    this.state = {
      inputType: 'password',
      isFocused: false,
      partialPassphraseError: [],
      focus: 0,
    };
  }

  handleFocus(field) {
    this.setState({ focus: field });
  }

  handleBlur() {
    this.setState({ focus: null });
  }

  handleValueChange(value, index) {
    let insertedValue = value;
    const insertedValueAsArray = insertedValue.split(' ');
    let passphrase = this.props.value.split(' ');

    if (insertedValueAsArray.length > 1) {
      for (let i = 0; i < 12; i++) {
        if (insertedValueAsArray[i]) {
          passphrase[i] = insertedValueAsArray[i];
          this.setState({ focus: i });
        }
      }
      insertedValue = insertedValueAsArray[index];
    }

    passphrase[index] = insertedValue;
    passphrase = passphrase.join(' ');

    let error;

    this.setState({ partialPassphraseError: [] });
    if (!passphrase) {
      error = this.props.t('Required');
    } else if (!isValidPassphrase(passphrase)) {
      error = this.getPassphraseValidationError(passphrase);
    }
    this.props.onChange(passphrase, error);
  }

  // eslint-disable-next-line class-methods-use-this
  getPassphraseValidationError(passphrase) {
    const mnemonic = passphrase.trim().split(' ');

    const partialPassphraseError = this.state.partialPassphraseError.slice();
    const invalidWords = mnemonic.filter((word) => {
      const isNotInDictionary = !inDictionary(word.toLowerCase());
      partialPassphraseError[mnemonic.indexOf(word)] = isNotInDictionary;
      return isNotInDictionary;
    });
    this.setState({ partialPassphraseError });

    if (invalidWords.length > 0) {
      return this.props.t('Please check the highlighted words');
    }

    if (mnemonic.length < 12) {
      return this.props.t('Passphrase should have 12 words, entered passphrase has {{length}}', { length: mnemonic.length });
    }

    return this.props.t('Passphrase is not valid');
  }

  toggleInputType() {
    this.setState({ inputType: this.state.inputType === 'password' ? 'text' : 'password' });
  }

  renderFields() {
    const propsColumns = this.props.columns;
    const xs = `col-xs-${propsColumns && propsColumns.xs ? propsColumns.xs : '6'}`;
    const sm = `col-sm-${propsColumns && propsColumns.sm ? propsColumns.sm : '2'}`;
    const md = `col-md-${propsColumns && propsColumns.md ? propsColumns.md : '2'}`;

    const value = this.props.value.split(' ');
    const indents = [];

    for (let i = 0; i < 12; i++) {
      indents.push(
        <div className={`${grid[xs]} ${grid[sm]} ${grid[md]}`} key={i}>
          <PassphrasePartial
            shouldfocus={this.state.focus === i}
            onFocus={this.handleFocus.bind(this, i)}
            onBlur={this.handleBlur.bind(this)}
            type={this.state.inputType}
            theme={this.props.theme}
            value={value}
            partialValue={value[i]}
            onChange={this.handleValueChange.bind(this)}
            index={i}
            className={this.props.className}
            error={this.state.partialPassphraseError[i]}
            keyAction={this.keyAction.bind(this)}
          />
        </div>);
    }

    return indents;
  }


  keyAction({ event, value }) {
    if (event.which === keyCodes.space || event.which === keyCodes.arrowRight) {
      event.preventDefault();
      this.setState({ focus: this.state.focus + 1 });
    }

    if ((event.which === keyCodes.delete && !value) || event.which === keyCodes.arrowLeft) {
      this.setState({ focus: this.state.focus - 1 });
    }
  }

  setFocused() {
    if (this.props.onFocus) this.props.onFocus();
    this.setState({ isFocused: true });
  }

  focusAndPaste(value) {
    this.setFocused();
    this.handleValueChange(value, 0);
  }

  render() {
    return (
      <div className={styles.wrapper} onClick={this.setFocused.bind(this)}>
        {this.state.isFocused
          ?
          <div>
            <div className={grid.row}>
              {this.renderFields()}
            </div>
            <div className={styles.errorMessage}>{this.props.error}</div>
            <div
              className={`show-passphrase-toggle ${styles.inputTypeToggle}`}
              onClick={this.toggleInputType.bind(this)}>
              <FontIcon className={styles.eyeIcon} value={this.state.inputType === 'password' ? 'hide' : 'show'}
              /> <label>{this.state.inputType === 'password' ? this.props.t('Show Passphrase') : this.props.t('Hide Passphrase') }</label>
            </div>
          </div>
          :
          <Input label={this.props.label}
            className={`${this.props.className} ${styles.inputWrapper}`}
            type={this.state.inputType}
            onChange={this.focusAndPaste.bind(this)}
          />
        }
      </div>);
  }
}

export default translate()(PassphraseInput);
