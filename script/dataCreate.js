const WzTokenContract = artifacts.require("WzToken.sol")
const ExchangeContract = artifacts.require("Exchange.sol")

const fromWei = bn => web3.utils.fromWei(bn, "ether");
const toWei = number => web3.utils.toWei(number.toString(), "ether");
const sleep = (s = 3) => new Promise((resolve, reject) => setTimeout(resolve, s * 1000))
module.exports = async function (callback) {
    const accounts = await web3.eth.getAccounts()
    const wztoken = await WzTokenContract.deployed()
    const exchange = await ExchangeContract.deployed()
    const ETHER_ADDRESS = await exchange.ETHER()


    await createOrder()
    async function createOrder() {


        for (let i = 1; i < 6; i++) {
            console.log(`创建acc0订单   ------ ${i}`)
            await exchange.makeOrder(wztoken.address, toWei(100 * i), ETHER_ADDRESS, toWei(0.001 * i), {from: accounts[0]})
        }
        for (let i = 1; i < 9; i++) {
            console.log(`创建acc1订单   ------ ${i}`)
            await exchange.makeOrder(wztoken.address, toWei(100 * i), ETHER_ADDRESS, toWei(0.001 * i), {from: accounts[1]})
        }

        for (let i = 1; i < 12; i++) {
            console.log(`创建acc2订单   ------ ${i}`)
            await exchange.makeOrder(ETHER_ADDRESS, toWei(0.1 * i), ETHER_ADDRESS, toWei(1000 * i), {from: accounts[2]})
        }

    }


    callback()
} 