
export const fromWei = BN => window.web ? window.web.web3.utils.fromWei(BN, 'ether') : '0'
export const toWei = number => window.web ? window.web.web3.utils.toWei(number.toString(), 'ether') : '0'