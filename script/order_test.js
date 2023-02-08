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
    /**
     * account0  初始账户  1000ETH  1,000,000WZT
     * 给 account1 发 500,000 WZT
     * 给account2 发 500ETH
    */
    await preData()
    async function preData() {

        // WZT授权交易所 1,000,000 WZT
        await wztoken.approve(exchange.address, toWei(1000000), {
            from: accounts[0]
        })
        await exchange.depositToken(wztoken.address, toWei(1000000), {
            from: accounts[0]
        })

        // 从acc0 存入交易所900ETH
        await exchange.depositEther({
            from: accounts[0],
            value: toWei(900)
        })

        // 交易所中 acc0 转到 acc1 500,000 WZT
        await exchange.transfer(wztoken.address, accounts[1], toWei(500000), {
            from: accounts[0]
        })
        // 交易所中 acc0 转到 acc2 500 ETH
        console.log(ETHER_ADDRESS, accounts[2], toWei(500000))
        await exchange.transfer(ETHER_ADDRESS, accounts[2], toWei(500000), {
            from: accounts[0]
        })
    }

    await showAsset()
    console.log('=-=-=-=-=-=-=-=-=-=-=-=-交易后=-=-=-=-=-=-=-=-=-=-=-=-=-=')
    /**
     * acc1 下单  100WZT 购买 1 ETH
    */
    await sleep()
    const order1 = await exchange.makeOrder(wztoken.address, toWei(100), ETHER_ADDRESS, toWei(1), {
        from: accounts[1]
    })
    const orderId = order1.logs[0].args.id
    await exchange.fillOrder(orderId, { from: accounts[2] })


    await showAsset()

    async function showAsset() {
        console.log("交易所中acc0 ETH", fromWei(await exchange.balanceOf(ETHER_ADDRESS, accounts[0])))
        console.log('交易所中acc0 WZT', fromWei(await exchange.balanceOf(wztoken.address, accounts[0])))
        console.log("交易所中acc1 ETH", fromWei(await exchange.balanceOf(ETHER_ADDRESS, accounts[1])))
        console.log('交易所中acc1 WZT', fromWei(await exchange.balanceOf(wztoken.address, accounts[1])))
        console.log("交易所中acc2 ETH", fromWei(await exchange.balanceOf(ETHER_ADDRESS, accounts[2])))
        console.log('交易所中acc2 WZT', fromWei(await exchange.balanceOf(wztoken.address, accounts[2])))
    }




    callback()
} 