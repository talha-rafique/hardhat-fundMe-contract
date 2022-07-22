const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)

    console.log("fundMe contract......")
    const transectionResponce = await fundMe.withdraw()
    await transectionResponce.wait(1)

    console.log("Funds Withdraw to wallet.....OK")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
