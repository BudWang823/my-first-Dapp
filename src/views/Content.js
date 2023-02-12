import React, { useEffect } from 'react'
import Order from "./Order"
import Balance from "./Balance"
import Web3 from 'web3'
import WzTokenJson from './../contracts_build/WzToken.json'
import ExchangeJson from './../contracts_build/Exchange.json'
import { loadBalanceData } from '../redux/slices/balanceSlice'
import { useDispatch } from 'react-redux'
import { loadCancelOrderData } from '../redux/slices/orderSlice'
export default function Content() {
  const dispatch = useDispatch()
  useEffect(() => {
    async function start() {
      /**
       * 获取链接后的合约
       * 获取资产信息
       * 获取订单信息
       */
      const web = await initWeb()
      window.web = web // 将web放到全局
      dispatch(loadBalanceData(web))
      dispatch(loadAllOrderData(web))
    }
    start()
  }, [])
  async function initWeb() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const accounts = await web3.eth.requestAccounts()
    const netWorkId = await web3.eth.net.getId()
    const wzTokenContract = await new web3.eth.Contract(WzTokenJson.abi, WzTokenJson.networks[netWorkId].address)
    const exchangeContract = await new web3.eth.Contract(ExchangeJson.abi, ExchangeJson.networks[netWorkId].address)
    return { web3, account: accounts[0], wzTokenContract, exchangeContract }
  }
  return (
    <div style={{padding: "10px"}}>
      <div style={{marginBottom: "10px"}}>

      <Balance></Balance>
      </div>

      <Order></Order>
    </div>
  )
}
