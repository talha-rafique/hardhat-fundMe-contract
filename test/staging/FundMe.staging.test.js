const { assert } = require("chai")
const { network, ethers, getNamedAccounts } = require("hardhat")
const { developmentChain } = require("../../helper-hardhat-config")

//check if the network is testnet or local Network Chain
developmentChain.includes(network.name)
    ? describe.skip
    : describe(" Staging Envoirment testing....", async () => {
          beforeEach(async () => {
              let fundMe
              let sendValue = ethers.utils.parseEther("0.1")
              let deployer
          })

          describe("testing withdraw and fund function", async () => {
              it("allow people to fund and withdraw", async () => {
                  let fundMe
                  let sendValue = ethers.utils.parseEther("0.1")
                  let deployer

                  deployer = (await getNamedAccounts()).deployer
                  fundMe = await ethers.getContract("FundMe", deployer)

                  await fundMe.fund({ value: sendValue })
                  console.log(`           ammount sent: ${sendValue}`)

                  const currentBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  console.log(`current FundMe  Balance: ${currentBalance}`)

                  await fundMe.withdraw()

                  const endingBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  console.log(
                      endingBalance.toString() +
                          " should equal 0, running assert equal..."
                  )
                  assert.equal(endingBalance.toString(), "0")
              })
          })
      })
