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
    // await preData()

    await showAsset()

    // await createOrder()











    async function createOrder() {
        console.log(`accounts[1]${accounts[1]} created order...`)
        const order = await exchange.makeOrder(wztoken.address, toWei(100), ETHER_ADDRESS, toWei(0.1), {
            from: accounts[1]
        })
        const orderId = order.logs[0].args.id
        console.log(`orderId: ${orderId.toString()},  订单创建完成`)
        await exchange.fillOrder(orderId, { from: accounts[2] })
        console.log(`${orderId}被accounts[2]${accounts[2]}填充`)


        // console.log(`accounts[2]${accounts[2]} created order...`)
        // const order = await exchange.makeOrder(wztoken.address, toWei(1000), ETHER_ADDRESS, toWei(0.01), {
        //     from: accounts[2]
        // })
        // const orderId = order.logs[0].args.id
        // console.log(`orderId: ${orderId.toString()},  订单创建完成`)
        // await await exchange.cancelOrder(orderId, { from: accounts[2] })
        // console.log(`${orderId}被accounts[2]${accounts[2]}取消`)

        await showAsset()

    }






























































































































































































































    async function preData() {
        await approve(1000000)
        await saveETH(900)
        // 交易所中 acc0 转到 acc1 500,000 WZT
        await exchange.transfer(wztoken.address, accounts[1], toWei(400000), {
            from: accounts[0]
        })
        await exchange.transfer(wztoken.address, accounts[2], toWei(300000), {
            from: accounts[0]
        })
        // 交易所中 acc0 转到 acc2 500 ETH
        console.log(`交易所中 acc0 转到 acc1 500,000 WZT成功`)
        console.log(fromWei(await exchange.balanceOf(ETHER_ADDRESS, accounts[0])))
        await exchange.transfer(ETHER_ADDRESS, accounts[2], toWei(300), {
            from: accounts[0]
        })
        await exchange.transfer(ETHER_ADDRESS, accounts[1], toWei(300), {
            from: accounts[0]
        })

        // 授权函数
        async function approve(approvePrice) {
            // WZT授权交易所 1,000,000 WZT
            try {
                console.log('拥有额度:', fromWei(await wztoken.balanceOf(accounts[0])))
                await wztoken.approve(exchange.address, toWei(approvePrice), {
                    from: accounts[0]
                })
                console.log(`用户:${accounts[0]},授权:${approvePrice} WZT-成功!`)

                console.log('授权额度:', fromWei(await wztoken.allowance(accounts[0], exchange.address)))
            } catch (err) {
                console.log(`「 错误 」${err.reason}`)
            }
            try {
                await exchange.depositToken(wztoken.address, toWei(approvePrice), {
                    from: accounts[0]
                })
                console.log(`用户:${accounts[0]},授权-并转账成功:${approvePrice} WZT-成功!`)

                console.log('授权-并转账成功后-拥有额度:', fromWei(await wztoken.balanceOf(accounts[0])))

            } catch (err) {
                // console.log(err)
            }
        }
        async function saveETH(savePrice) {
            async function getETHBalance() {
                return fromWei(await web3.eth.getBalance(accounts[0]))
            }
            console.log('当前ETH余额:', await getETHBalance())
            if (await getETHBalance() < savePrice) {
                console.log(`当前ETH余额:${await getETHBalance()}, 转账额度${savePrice}`)
                console.log('「转账失败」')
            } else {
                // 从acc0 存入交易所900ETH
                await exchange.depositEther({
                    from: accounts[0],
                    value: toWei(savePrice)
                })
                console.log(`存到交易所${savePrice}后 当前ETH余额:`, await getETHBalance())
            }


        }
    }
    async function showAsset() {

        console.log(`=====================================交易所数据start=====================================`)
        console.log("=·交易所中acc0 ETH", fromWei(await exchange.balanceOf(ETHER_ADDRESS, accounts[0])))
        console.log('=·交易所中acc0 WZT', fromWei(await exchange.balanceOf(wztoken.address, accounts[0])))
        console.log("=·交易所中acc1 ETH", fromWei(await exchange.balanceOf(ETHER_ADDRESS, accounts[1])))
        console.log('=·交易所中acc1 WZT', fromWei(await exchange.balanceOf(wztoken.address, accounts[1])))
        console.log("=·交易所中acc2 ETH", fromWei(await exchange.balanceOf(ETHER_ADDRESS, accounts[2])))
        console.log('=·交易所中acc2 WZT', fromWei(await exchange.balanceOf(wztoken.address, accounts[2])))
        console.log("=·")
        console.log("=·")
        console.log("=·")
        console.log("=·")
        console.log('=·收费账户中acc9 ETH', fromWei(await exchange.balanceOf(ETHER_ADDRESS, accounts[9])))
        console.log('=·收费账户中acc9 WZT', fromWei(await exchange.balanceOf(wztoken.address, accounts[9])))
        console.log(`=====================================交易所数据end=====================================`)
    }
    callback()
} 