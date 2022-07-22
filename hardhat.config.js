require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")
require("./tasks/account")
require("@nomiclabs/hardhat-ethers")

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const COINMARKETCAP_API_KEY =
    process.env.COINMARKETCAP_API_KEY || "KjhFkjgdbKU456HGK#UHGJYGRT8543lkjAN"
const KOVAN_RPC_URL =
    process.env.KOVAN_RPC_URL ||
    "https://eth-mainnet.alchemyapi.io/v2/your-api-key"
const ALCHEMY_RINKEBY_RPC_URL =
    process.env.ALCHEMY_RINKEBY_RPC_URL ||
    "https://eth-mainnet.alchemyapi.io/v2/your-api-key"
const ALCHEMY_PRIVATE_KEY =
    process.env.ALCHEMY_PRIVATE_KEY ||
    "0x11ee3108a03081fe260ecdc106554d09d9d1209bcafd46942b10e02943effc4a"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            // gasPrice: 130000000000,
        },
        kovan: {
            url: KOVAN_RPC_URL,
            accounts: [ALCHEMY_PRIVATE_KEY],
            chainId: 42,
            blockConfirmations: 6,
            gas: 6000000,
        },
        rinkeby: {
            url: ALCHEMY_RINKEBY_RPC_URL,
            accounts: [ALCHEMY_PRIVATE_KEY],
            chainId: 4,
            blockConfirmations: 6,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            //accounts: thanks hardhat!
            chainId: 31337,
        },
    },

    solidity: {
        compilers: [
            {
                version: "0.8.7",
            },
            {
                version: "0.6.6",
            },
        ],
    },

    //this value is used for Verify Contract on EtherScan
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },

    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: COINMARKETCAP_API_KEY,
    },

    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
            4: "0x261dcfD875b4406AA9300a7E1336fA37eDCB4103", // but for rinkeby it will be a specific address
            goerli: "0x84b9514E013710b9dD0811c9Fe46b837a4A0d8E0", //it can also specify a specific netwotk name (specified in hardhat.config.js)
        },
        user: {
            default: 0,
            4: 0,
            31337: 0,
        },
    },
}
