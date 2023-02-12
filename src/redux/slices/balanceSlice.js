import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
const balanceSlice = createSlice({
  name: "balance",
  initialState: {
    TokenWallet: "0",
    TokenExchange: "0",
    EtherWallet: "0",
    EtherExchange: "0"
  },
  reducers: {//action
    setTokenWallet(state, action) {
      state.TokenWallet = action.payload
    },
    setTokenExchange(state, action) {
      state.TokenExchange = action.payload
    },
    setEtherWallet(state, action) {
      state.EtherWallet = action.payload
    },
    setEtherExchange(state, action) {
      state.EtherExchange = action.payload
    },
  },

})
export const {
  setTokenWallet,
  setTokenExchange,
  setEtherWallet,
  setEtherExchange,
} = balanceSlice.actions
export default balanceSlice.reducer
export const loadBalanceData = createAsyncThunk(
  "balance/fetchBalanceData",
  async (data, { dispatch }) => {
    // await window.web.
    const { web3, account, wzTokenContract, exchangeContract } = data
    // 获取钱包 WZT
    const TokenWallet = await wzTokenContract.methods.balanceOf(account).call()
    dispatch(setTokenWallet(TokenWallet))
    // 获取交易所WZT
    const TokenExchange = await exchangeContract.methods.balanceOf(wzTokenContract.options.address, account).call()
    dispatch(setTokenExchange(TokenExchange))
    // 获取钱包 ETH
    const EtherWallet = await web3.eth.getBalance(account)
    dispatch(setEtherWallet(EtherWallet))
    // 获取交易所ETH
    const EtherExchange = await exchangeContract.methods.balanceOf(await exchangeContract.methods.ETHER().call(), account).call()
    dispatch(setEtherExchange(EtherExchange))
  }
)