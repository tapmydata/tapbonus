import React, { Component } from "react";
import './index.css';
import TokenBalance from "./TokenBalance/TokenBalance";
import ConnectWallet from "./ConnectWallet/ConnectWallet";
import ClaimBonus from "./ClaimBonus/ClaimBonus";
import "@ethersproject/shims"
import { ethers, utils } from "ethers";
import TokenAbi from './contracts/ERC20Token.json';
import BonusAbi from './contracts/Bonus.json';
import { Share } from 'react-twitter-widgets';

class App extends Component {

  state = {
    provider: null,
    account: null,
    bonusContract: null,
    bonusContractBalance: 999,
    baseTokenBalance: 0,
    token1Balance: 0,
    token2Balance: 0,
    baseTokenContract: null,
    token1Contract: null,
    token2Contract: null,
    claimed: false,
    previouslyClaimed: false,
    transaction: null,
  };

  componentDidMount = async () => {
    // Make sure the bonus contract has some tokens
    let provider = new ethers.providers.InfuraProvider(process.env.REACT_APP_NETWORK, process.env.REACT_APP_INFURA);
    let contract = new ethers.Contract(process.env.REACT_APP_BASE_TOKEN_CONTRACT_ADDRESS, TokenAbi.abi, provider);
    let balance = await contract.balanceOf(process.env.REACT_APP_BONUS_CONTRACT_ADDRESS);
    this.setState({"bonusContractBalance": utils.formatEther(balance).toString()});
  }

  walletConnected = async (wallet) => {
    
    this.setState({wallet: wallet});

    const provider = new ethers.providers.Web3Provider(wallet)
    this.setState({provider: provider});
    const signer = provider.getSigner();

    let accounts = await provider.listAccounts();
    let account = accounts[0];
    this.setState({account: account});

    // Subscribe to accounts change
    wallet.on("accountsChanged", (accounts) => {
      window.location.reload(true);
    });

    // Subscribe to chainId change
    wallet.on("chainChanged", (chainId) => {
      console.log("chainChanged", chainId);
    });

    // Subscribe to provider connection
    wallet.on("connect", (info) => {
      console.log("connect", info);
    });

    // Subscribe to provider disconnection
    wallet.on("disconnect", (error) => {
      console.log("disconnect", error);
    });

    //let abi = new ethers.utils.Interface(BonusAbi.abi);
    let bonusContract = new ethers.Contract(process.env.REACT_APP_BONUS_CONTRACT_ADDRESS, BonusAbi.abi, provider);
    bonusContract = bonusContract.connect(signer);
    this.setState({bonusContract: bonusContract});
    
    let baseTokenContract = new ethers.Contract(process.env.REACT_APP_BASE_TOKEN_CONTRACT_ADDRESS, TokenAbi.abi, provider);
    baseTokenContract = baseTokenContract.connect(signer);
    this.setState({baseTokenContract: baseTokenContract});
    this.getBalance("baseTokenBalance", baseTokenContract);

    if (!process.env.REACT_APP_ALLOW_MULTIPLE_CLAIMS) {
      // Get the filter (the second null could be omitted)
      const filter = baseTokenContract.filters.Transfer(process.env.REACT_APP_BONUS_CONTRACT_ADDRESS, account);

      // Query the filter (the latest could be omitted)
      const logs = await baseTokenContract.queryFilter(filter, 0, "latest");

      if (logs.length > 0) {
        this.setState({previouslyClaimed: true});
      }
    }

    // Print out all the values:
    /*logs.forEach((log) => {
      // The log object contains lots of useful things, but the args are what you prolly want)
      console.log(log.args._to, log.args._value);
    });*/

    baseTokenContract.on("Transfer", (from, to, amount, event) => {
      console.log(from, to, amount, event);
      this.getBalance("baseTokenBalance", baseTokenContract);
      this.setState({claimed: true});
    });

    let token1Contract = new ethers.Contract(process.env.REACT_APP_TOKEN1_CONTRACT_ADDRESS, TokenAbi.abi, provider);
    token1Contract = token1Contract.connect(signer);
    this.setState({token1Contract: token1Contract});
    this.getBalance("token1Balance", token1Contract);

    token1Contract.on("Transfer", (from, to, amount, event) => {
      console.log(from, to, amount, event);
      this.getBalance("token1Balance", token1Contract);
    });

    let token2Contract = new ethers.Contract(process.env.REACT_APP_TOKEN2_CONTRACT_ADDRESS, TokenAbi.abi, provider);
    token2Contract = token2Contract.connect(signer);
    this.setState({token2Contract: token2Contract});
    this.getBalance("token2Balance", token2Contract);

    token2Contract.on("Transfer", (from, to, amount, event) => {
      console.log(from, to, amount, event);
      this.getBalance("token2Balance", token2Contract);
    });


  }

  claim = async () => {
    let contract = this.state.bonusContract;
    let transactionResponse = await contract.claim();
    this.setState({transaction: transactionResponse.hash});
  }

  getBalance = async (stateBalance, contract) => {
    if (this.state.account && contract) {
        let balance = await contract.balanceOf(this.state.account);
        this.setState({[stateBalance]: utils.formatEther(balance.toString())});
    }
  }

  header = (
    <div className="bg-tap_blue pb-32">
      <header className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 content-center">
        <a className="mx-auto" href="https://tapmydata.com" target="_blank" rel="noreferrer"><img className="h-10 mx-auto" src="https://tapmydata.com/wp-content/uploads/2020/10/Tapmydata-Logo-White-2019b@3x-2.png" alt={'"' + process.env.REACT_APP_BASE_TOKEN_NAME + ' Logo"'} /></a>
        </div>
      </header>
    </div>
  )

  render() {

    if (this.state.claimed) {
      return (
        <div className="bg-tap_blue min-h-screen bg-gray-100">
          {this.header}
          <main className="-mt-32">
            <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
                  
              <div className="max-w-7xl mx-auto py-12 px-4 text-center">
                <p className="text-center text-base font-semibold uppercase text-gray-600 tracking-wider">
                  Congratulations Your {process.env.REACT_APP_BASE_TOKEN_SYMBOL} Tokens have arrived!
                </p>
                <div className="mx-auto p-8 content-center text-center">
                  <img className="mx-auto max-h-40" src="images/coins.png" alt="Your freshly minted TAP coin" />
                </div>
                <div>
                  <p>Balance: <strong>{Number(this.state.baseTokenBalance).toFixed(2)}</strong></p>
                </div>
              </div>

              <h1 className="text-center text-xl font-semibold uppercase text-gray-600 tracking-wider">
                Things to do now:
              </h1>

              <div className="flex flex-wrap content-center text-center twitter mt-8">
                <p className="mx-auto clear-right">1. Show your support and help promote {process.env.REACT_APP_BASE_TOKEN_SYMBOL} by sending a Tweet</p>
              </div>

              <div className="flex flex-wrap content-center text-center twitter mt-6">
                
              <Share 
                url="https://giveaway.tapmydata.com"
                options={
                  { 
                    size: "large",
                    text: "I just claimed " + process.env.REACT_APP_BONUS_GIVEAWAY_AMOUNT + " FREE TAP Tokens from @tapmydata as part of the #opendataeconomy. Claim yours now at",
                    hashtags: "tapmydata",
                  }
                } />
                </div>

              <div className="flex flex-wrap content-center text-center twitter mt-8">
                <p className="mx-auto clear-right">2. Stake your {process.env.REACT_APP_BASE_TOKEN_SYMBOL} Tokens on the official Uniswap Pool</p>
              </div>

              <div className="flex flex-wrap content-center text-center twitter mt-6">
                <a className="mx-auto" href="https://info.uniswap.org/pair/0x54049236fc1db3e274128176efedf7c69b4c6335" target="_blank" rel="noreferrer"><img className="max-h-16 mx-auto" src="images/uniswap.png" alt="Download on app store" /></a>
              </div>

              <div className="flex flex-wrap content-center text-center twitter mt-8">
                <p className="mx-auto clear-right">3. Join the {process.env.REACT_APP_BASE_TOKEN_NAME} conversation on Telegram</p>
              </div>

              <div className="flex flex-wrap content-center text-center twitter mt-6">
                <a className="mx-auto" href="http://telegram.tapmydata.com/" target="_blank" rel="noreferrer"><img className="max-h-14 mx-auto" src="images/telegram.png" alt="Join us on Telegram" /></a>
              </div>

              <div className="flex flex-wrap content-center text-center twitter mt-8">
                <p className="mx-auto clear-right">4. Download Tapmydata on the App Stores</p>
              </div>

              <div className="grid gap-0.5 grid-cols-6">
                <div></div>
              <div></div>
              <div className="col-span-1 flex justify-right content-right py-8 px-8 bg-gray-50">
                <a href="https://apps.apple.com/gb/app/tap-my-data/id1436042237?mt=8%20%E2%80%A6" target="_blank" rel="noreferrer"><img className="max-h-14 mx-auto" src="images/app-app-store.png" alt="Download on app store" /></a>
              </div>
              <div className="col-span-1 flex justify-left content-left py-8 px-8 bg-gray-50">
                <a href="https://play.google.com/store/apps/details?id=io.taprewards.app" target="_blank" rel="noreferrer"><img className="max-h-14 mx-auto" src="images/google-play-store.png" alt="Download on Google play store" /></a>
              </div>
              <div></div>
              <div></div>
              </div>

                  
              </div>
            </div>
          </main>
        </div>
      );
    } else if(Number(this.state.bonusContractBalance) < Number(process.env.REACT_APP_BONUS_GIVEAWAY_AMOUNT)) {
      return (
        <div className="bg-tap_blue min-h-screen bg-gray-100">
          {this.header}
          <main className="-mt-32">
            <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
                  
              <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 text-center">
                <p className="text-center text-base font-semibold uppercase text-gray-600 tracking-wider">
                  The {process.env.REACT_APP_BASE_TOKEN_SYMBOL} Token Giveaway has finished 
                </p>
                <div className="mx-auto p-8 content-center text-center">
                  <img className="mx-auto max-h-40" src="images/coins.png" alt="Your freshly minted TAP coin" />
                </div>
              </div>
                  
              </div>
            </div>
          </main>
        </div>
      );
    } else {
      return (
        <div className="bg-tap_blue min-h-screen bg-gray-100">
          {this.header}
          <main className="-mt-32">
            <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-lg shadow px-5 py-12 sm:px-6">
                  
              <h1 className="text-center text-xl font-semibold uppercase text-tap_blue tracking-wider">
                {process.env.REACT_APP_TOKEN1_NAME} or {process.env.REACT_APP_TOKEN2_NAME} Token Holders Claim {process.env.REACT_APP_BONUS_GIVEAWAY_AMOUNT} FREE {process.env.REACT_APP_BASE_TOKEN_SYMBOL} Tokens
              </h1>

              <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-3">
                
                <p className="text-center text-base font-semibold uppercase text-gray-600 tracking-wider">
                  Step 1. Connect your wallet
                </p>
                <div className="mx-auto p-8 content-center text-center">
                  <ConnectWallet account={this.state.account} connected={(wallet) => this.walletConnected(wallet)} web3provider={this.state.provider} />
                </div>
                <p className="text-center text-base font-semibold uppercase text-gray-600 tracking-wider">
                  Step 2. You must hold Ocean or Streamr Tokens already
                </p>
                <div className="mt-3 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-6">
    
                  <TokenBalance token_name="token1"
                    name={process.env.REACT_APP_TOKEN1_NAME}
                    website={process.env.REACT_APP_TOKEN1_WEBSITE}
                    
                    web3provider={this.state.provider}
                    balance={this.state.token1Balance} />
                  <TokenBalance token_name="token2"
                    name={process.env.REACT_APP_TOKEN2_NAME}
                    website={process.env.REACT_APP_TOKEN2_WEBSITE}
                    web3provider={this.state.provider}
                    balance={this.state.token2Balance} />
                  <TokenBalance token_name="base_token"
                    name={process.env.REACT_APP_BASE_TOKEN_NAME}
                    website={process.env.REACT_APP_BASE_TOKEN_WEBSITE}
                    web3provider={this.state.provider}
                    balance={this.state.baseTokenBalance} />
                </div>
              </div>
    
              <p className="text-center text-base font-semibold uppercase text-gray-600 tracking-wider">
                  Step 3. Claim your {process.env.REACT_APP_BONUS_GIVEAWAY_AMOUNT} FREE {process.env.REACT_APP_BASE_TOKEN_SYMBOL} Tokens
                </p>
                <div className="mx-auto p-8 content-center text-center">
                  <ClaimBonus click={this.claim} 
                    transaction={this.state.transaction} 
                    previouslyClaimed={this.state.previouslyClaimed}
                    balance1={this.state.token1Balance}
                    balance2={this.state.token2Balance}
                    web3provider={this.state.provider} />
                </div>
                  
              </div>
            </div>
          </main>
        </div>
      );
    }
    
  }
  
}

export default App;
