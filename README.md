## TAP Token Bonus

This project was created to distribute TAP tokens to users holding either Ocean or Streamr tokens as part of the #opendataeconomy. https://twitter.com/tapmydata/status/1349723522529050628

![TAP Giveaway](https://tapmydata-github-assets.s3.amazonaws.com/tap-bonus.gif)

### About

The purpose of this project is to give someone a specified amount of a base token (in our case TAP) if they they hold one of two other tokens (in our case Ocean or Streamr). It could easily be adapted to support more or less tokens but it is essentially fixed at a base token and two tokens the user must hold one of.

To work, the Bonus.sol contract is deployed to mainnet and initialised with the token addresses. At this point, once it's live you will need to transfer in your base token to the contract address.

When a user claims their tokens, they call the claim method on Bonus.sol. It checks they own some of Token 1 or Token 2 and if they do it release it to them. The React front-end project has checks in to hopefully ensure the user never hits a revert situation caused by the contract itself, although race conditions could mean this is possible and it hasn't been built to deal with ever scenario and could in some untested circumstances give someone a less than ideal error.

You can use this project as a starting point for a token giveaway or simply just hopefully learn something for your own Web3 project.

### Main Components

Originally the project was setup with https://www.trufflesuite.com/drizzle. Ths was a good starting point for structure but we didn't actually use the Drizzle coponents in the end.

Stack:
- [Truffle](https://www.trufflesuite.com/)
- [React](https://reactjs.org/)
- [Web3Modal](https://github.com/Web3Modal/web3modal)
- [Ethers.js](https://docs.ethers.io/v5/)
- [Tailwind](https://tailwindcss.com/)

### Folder Structure

`app/` - This is the React front-end.
`contracts/` - These are the solidity contracts. The main contract is Bonus.sol - there is a basic ERC20Token.sol which is just used for deploying a test ERC20 token (either locally or to testnet).
`migrations/` - This is where you will find the deployment script. You will need to adjust 2_deploy_contracts.js to your requirements

### How to run

Run `npm install` in both root folder and `app/` folder.

You will need a .env in the root of the project for the Ethereum contract deployment that looks like:

```
MNEMONIC=<YOUR SECRET KEY MNEMONIC>
INFURA_RINKEBY=<INFURA URL IF DEPLOYING TO RINKEBY>
INFURA_KOVAN=<INFURA URL IF DEPLOYING TO KOVAN>
INFURA_MAINNET=<INFURA URL IF DEPLOYING TO MAINNET>
ETHERSCAN=<AN ETHERESCAN API KEY - ONLY NEEDED IF YOU WANT TO VERIFY YOUR CONTRACT>
FROM=<ETH ADDRESS YOU ARE DEPLOYING FROM>
```

You can compile contracts and test with Truffle:

```
npx truffle develop
truffle migrate
tuffle compile
truffle test
```

To deploy contracts use the following:

```
npx truffle migrate --reset --network kovan
```

To verify the contract on ehterscan you can run:

```
npx truffle run verify Bonus --network kovan
```

*Note* This will only deploy the Bonus contract, you will need to adjust 2_deploy_contracts.js in `migrations/` first and either deploy separate ERC20 contracts (commented out) or set appropriate contract addresses that already exist for the Bonus contract in this file.

You will need a .env.development file in app/

```
REACT_APP_INFURA=<AN INFURA PUBLIC API KEY>
REACT_APP_FORTMATIC=<A FORTMATIC PUBLIC API KEY - CAN ALWAYS DISABLE FORTMATIC>
REACT_APP_NETWORK=kovan
REACT_APP_BONUS_CONTRACT_ADDRESS=0xe2b59429b7c41074b8292af801f82363e997f830
REACT_APP_ALLOW_MULTIPLE_CLAIMS=true
REACT_APP_BONUS_GIVEAWAY_AMOUNT=500
REACT_APP_BASE_TOKEN_NAME=Tapmydata
REACT_APP_BASE_TOKEN_SYMBOL=TAP
REACT_APP_BASE_TOKEN_CONTRACT_ADDRESS=0x316889214aebe4fa318a6086d66ef2623357a821
REACT_APP_BASE_TOKEN_WEBSITE=https://tapmydata.com
REACT_APP_TOKEN1_CONTRACT_ADDRESS=0x591aD3c71Bf28B11c065eD8A5e6926ADACBEfb92
REACT_APP_TOKEN1_NAME=Ocean Protocol
REACT_APP_TOKEN1_SYMBOL=Ocean
REACT_APP_TOKEN1_WEBSITE=https://oceanprotocol.com/
REACT_APP_TOKEN2_CONTRACT_ADDRESS=0x53BE69Ea3425b3c088338493bC506cc84D0fFb0D
REACT_APP_TOKEN2_NAME=Streamr
REACT_APP_TOKEN2_SYMBOL=DAT
REACT_APP_TOKEN2_WEBSITE=https://streamr.network/
REACT_APP_ETHERSCAN=https://kovan.etherscan.io/
```

Change in to `app/` and run:

```
npm run start
```

You should then have the app on `http://127.0.0.1:3000`. 