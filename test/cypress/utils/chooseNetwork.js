import networks from '../../constants/networks';

const ss = {
  networkDropdown: '.network',
  networkOptions: '.network .options > *',
};

export default function chooseNetwork(network) {
  switch (network) {
    case 'main':
      cy.get(ss.networkDropdown).click();
      cy.get(ss.networkOptions).eq(0).click();
      break;
    case 'test':
      cy.get(ss.networkDropdown).click();
      cy.get(ss.networkOptions).eq(1).click();
      break;
    case 'dev':
      cy.get(ss.networkDropdown).click();
      cy.get(ss.networkOptions).eq(2).click();
      cy.get('.address input').type(networks.devnet.node);
      break;
    case 'invalid':
      cy.get(ss.networkDropdown).click();
      cy.get(ss.networkOptions).eq(2).click();
      cy.get('.address input').type('http://silk.road');
      break;
    default:
      throw new Error(`Network should be one of : main , test, dev, invalid . Was: ${network}`);
  }
}
