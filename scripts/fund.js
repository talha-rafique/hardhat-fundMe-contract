const { ethers, getNamedAccounts } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log(`fundMe contract.....`)

    const transection = await fundMe.fund({
        value: ethers.utils.parseEther("0.1"),
    })

    await transection.wait(1)
    console.log("Funds added to contract.....OK")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
