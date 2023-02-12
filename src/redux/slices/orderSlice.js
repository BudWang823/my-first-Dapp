import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
const orderSlice = createSlice({
  name: "order",
  initialState: {
    CancelOrder: [],
    FillOrder: [],
    AllOrder: [],
  },
  reducers: {
    setCancelOrder(state, actions) {
      state.CancelOrder = actions.payload
    },
    setFillOrder(state, actions) {
      state.FillOrder = actions.payload
    },
    setAllOrder(state, actions) {
      console.log(actions.payload)
      state.AllOrder = actions.payload
    }
  }
})
export const {
  setCancelOrder,
  setFillOrder,
  setAllOrder,
} = orderSlice.actions
export default orderSlice.reducer

export const loadAllOrderData = createAsyncThunk(
  "order/fetchAllOrderData",
  async (data, { dispatch }) => {

    const { exchangeContract } = data
    try {
      const res = await exchangeContract.getPastEvents('Order', {
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


export const loadCancelOrderData = createAsyncThunk(
  "order/fetchCancelOrderData",
  async (data, { dispatch }) => {

    const { exchangeContract } = data
    try {
      const res = await exchangeContract.getPastEvents('Cancel', {
        fromBlock: 0,
        toBlock: "latest"
      })
      const Cancel = res.map(item => {
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
      dispatch(setCancelOrder(Cancel))
    } catch (err) {

    }
  }
)

export const loadFillOrderData = createAsyncThunk(
  "order/fetchFillOrderData",
  async (data, { dispatch }) => {
    const { exchangeContract } = data
    try {
      const res = await exchangeContract.getPastEvents('Trade', {
        fromBlock: 0,
        toBlock: "latest"
      })
      const Fill = res.map(item => {
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
      dispatch(setFillOrder(Fill))
    } catch (err) {

    }
  }
)
