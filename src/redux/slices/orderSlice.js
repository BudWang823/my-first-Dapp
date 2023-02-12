import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
const orderSlice = createSlice({
  name: "order",
  initialState: {
    CancelOrders: [],
    FillOrder: [],
    AllOrder: [],
  },
  reducers: {
    setCanOrder(state, actions) {
      state.CancelOrders = actions.payload
    },
    setFillOrder(state, actions) {
      state.FillOrder = actions.payload
    },
    setAllOrder(state, actions) {
      state.AllOrder = actions.payload
    }
  }
})
export const {
  setCancelOrders,
  setFillOrder,
  setAllOrder,
} = orderSlice.actions
export default orderSlice.reducer

export const loadAllOrderData = createAsyncThunk(
  "order/fetchAllOrderData",
  async (data, { dispatch }) => {

    const { web3, account, wzTokenContract, exchangeContract } = data
    try {
      console.log(exchangeContract)
      const res = await exchangeContract.getPastEvents('Order',{
        fromBlock: 0,
        toBlock: "latest"
      })
      const AllOrder = res.map(item => {
        const {
          id,
          timestamp,
          user,
          tokenPay,
          amountPay,
          tokenGet,
          amountGet
        } = item.returnValues
        return {
          id,
          timestamp,
          user,
          tokenPay,
          amountPay,
          tokenGet,
          amountGet
        }
      })
      dispatch(setAllOrder(AllOrder))
    } catch (err) {

    }

  }
)