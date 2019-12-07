import actionTypes from '../../constants/actions';
import { tokenKeys } from '../../constants/tokens';
import { deepMergeObj } from '../../utils/helpers';
import localJSONStorage from '../../utils/localJSONStorage';

export const channels = {
  academy: false,
  twitter: false,
  discord: true,
  blog: false,
  github: false,
  reddit: false,
};

/**
 * Function to validate that the active token is enabled on the settings, otherwise
 * sets the default token to LSK.
 * @param {Object} state
 * @returns {Object} -> state with correct active token.
 */
const validateToken = state => (
  state.token && !state.token.list[state.token.active]
    ? { ...state, token: { active: tokenKeys[0], list: state.token.list } }
    : state
);

// load setting data from localStorage if it exists and merge with initial state
export const initialState = deepMergeObj({
  autoLog: true,
  showNetwork: true,
  channels,
  hardwareAccounts: {},
  isRequestHowItWorksDisable: true,
  statistics: false,
  areTermsOfUseAccepted: true,
  discreetMode: false,
  token: {
    active: tokenKeys[0],
    list: tokenKeys.reduce((acc, key) => { acc[key] = true; return acc; }, {}),
  },
}, localJSONStorage.get('settings', {}));

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const settings = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.settingsUpdated:
      return validateToken(deepMergeObj(state, action.data));
    case actionTypes.settingsReset:
      return {
        ...state,
        autoLog: true,
      };
    default:
      return state;
  }
};

export default settings;
