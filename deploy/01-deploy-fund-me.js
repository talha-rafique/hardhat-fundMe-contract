const { getNamedAccounts, deployments, network, address } = require("hardhat")

const { networkConfig, developmentChain } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()

//but with ether-deploy this pattern will follow
//hre.getNamedAccounts()
//hre.deployments

//1:
// async function fungdeploy(){}
// module.exports = fungdeploy

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    //   const { deployer } = await getNamedAccounts()
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress
    if (developmentChain.includes(network.name)) {
        // if (chainId == 31337) {
        let ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmation || 1,
    })
    log("---------------------Fund---ME----------------")

    //verify this on testnet or main net
    if (chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress])
    }
}

module.exports.tags = ["all", "fundMe"]
