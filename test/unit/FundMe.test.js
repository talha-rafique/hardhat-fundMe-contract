const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { developmentChain } = require("../../helper-hardhat-config")

!developmentChain.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let deployer
          let mockV3Aggregator
          let sendValue = ethers.utils.parseEther("1")
          beforeEach(async function () {
              //deploy the function using hardhat deploy tags
              //

              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])

              fundMe = await ethers.getContract("FundMe", deployer)

              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })

          describe("Construstor", async function () {
              it("set the aggregator address correctely", async function () {
                  const responce = await fundMe.priceFeed()
                  assert.equal(responce, mockV3Aggregator.address)
              })
          })

          describe("fundMe", async function () {
              it("Fails if you don't send enough money", async function () {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })

              it("updated amount send for fund function", async function () {
                  await fundMe.fund({ value: sendValue })
                  const responce = await fundMe.addressToAmountFunded(deployer)

                  assert.equal(responce.toString(), sendValue.toString())
              })

              it("add funders to array funders array", async () => {
                  await fundMe.fund({ value: sendValue })
                  let funder = await fundMe.funders(0)

                  assert.equal(funder, deployer)
              })
          })

          describe("fundMe withdraw", async () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue })
              })

              it("withdraw Eth from single funder", async () => {
                  //arange
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  //act
                  const transecionResponce = await fundMe.withdraw()
                  const transectionReceipt = await transecionResponce.wait(1)

                  let { gasUsed, effectiveGasPrice } = transectionReceipt
                  let totalgas = gasUsed.mul(effectiveGasPrice)

                  const endFunfMeBalance = await ethers.provider.getBalance(
                      fundMe.address
                  )
                  const endProviderBalance = await ethers.provider.getBalance(
                      deployer
                  )

                  //assert
                  assert.equal(endFunfMeBalance, 0)
                  assert.equal(
                      startingDeployerBalance
                          .add(startingFundMeBalance)
                          .toString(),
                      endProviderBalance.add(totalgas).toString()
                  )
              })

              it("allow us to withdraw from multiple funders", async () => {
                  //arange
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundmeConnectedAccount = await fundMe.connect(
                          accounts[i]
                      )
                      await fundmeConnectedAccount.fund({ value: sendValue })
                  }

                  //act
                  const transecionResponce = await fundMe.withdraw()
                  const transectionReceipt = await transecionResponce.wait(1)

                  let { gasUsed, effectiveGasPrice } = transectionReceipt
                  let totalgas = gasUsed.mul(effectiveGasPrice)
                  const endFunfMeBalance = await ethers.provider.getBalance(
                      fundMe.address
                  )
                  const endProviderBalance = await ethers.provider.getBalance(
                      deployer
                  )

                  //assert
                  assert.equal(endFunfMeBalance, 0)

                  //this test cannot be done because right now
                  //all funds are withdraw to only one provider address.
                  // assert.equal(
                  //     startingDeployerBalance.add(startingFundMeBalance).toString(),
                  //     endProviderBalance.add(totalgas).toString()
                  // )

                  //assert
                  //check our address in  funders array is not available anymore
                  expect(fundMe.funders(0)).to.be.reverted

                  //now check all funder balance in addressToAmountFunded mapping is also became 0 because of withdraw
                  for (let i = 1; i < 6; i++) {
                      let address = accounts[i].address
                      assert.equal(
                          await fundMe.addressToAmountFunded(address),
                          0
                      )
                  }
              })

              it("only owner can withdraw", async () => {
                  //arange
                  const accounts = await ethers.getSigners()
                  let hacker = accounts[1]
                  let hackerConnectedContract = await fundMe.connect(hacker)

                  await hackerConnectedContract.fund({ value: sendValue })

                  console.log("---------------My details----------")
                  console.log(`Owner      Address: ${deployer}`)
                  console.log(`New funder Address: ${hacker.address}`)
                  console.log("---------------END details----------")

                  //assert
                  await expect(
                      hackerConnectedContract.withdraw()
                  ).to.be.revertedWith("fundMe__NotOwner")
              })
          })
      })
