const { network } = require("hardhat")

const {
    networkConfig,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    //   const { deployer } = await getNamedAccounts()
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // if (networkConfig.includes(network.name)) {
    if (chainId == "31337") {
        log("local Network Detected. Deploying Mocks...!!")

        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("Mocks Deployed...!!!")
        log("-----------------------------------------------------")
    }
}

//for only deploy these MOKS via the hardhat deploy
//>yarn hardhat deploy --tags mocks

module.exports.tags = ["all", "mocks"]
