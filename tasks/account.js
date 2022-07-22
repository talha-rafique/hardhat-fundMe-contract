const { task } = require("hardhat/config")

task("accounts", "accounts in hardhat").setAction(async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners()

    for (const account of accounts) {
        console.log(account.address)
    }
})

task("block-number", "show block numbers").setAction(async (taskArgs, hre) => {
    const block = await hre.ethers.provider.getBlockNumber()
    console.log(`Current Block Number: ${block}`)
})
