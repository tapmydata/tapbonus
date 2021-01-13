require('dotenv').config()

const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  networks: {
    develop: { // default with truffle unbox is 7545, but we can use develop to test changes, ex. truffle migrate --network develop
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    rinkeby: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.INFURA_RINKEBY),
      network_id: 4,       // Ropsten's id
      gas: 4612388,        // Ropsten has a lower block limit than mainnet
      from: process.env.FROM,
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
    kovan: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.INFURA_KOVAN),
      network_id: 42,       // Kovan's id
      gas: 5000000,
      gasPrice: 25000000000,
      from: process.env.FROM,
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
    mainnet: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.INFURA_MAINNET),
      gasPrice: 64000000000,
      from: process.env.FROM,
      network_id: 1
    }
  },

  api_keys: {
    etherscan: process.env.ETHERSCAN
  },

  plugins: [
    'truffle-plugin-verify'
  ],
  
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.6.2",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    },
  },
};
