import React from "react"
import Web3Modal from "web3modal";
import Fortmatic from "fortmatic";
import WalletConnectProvider from "@walletconnect/web3-provider";
import MewConnect from "@myetherwallet/mewconnect-web-client";

const providerOptions = {
    mewconnect: {
        package: MewConnect, // required
        options: {
        infuraId: process.env.REACT_APP_INFURA // required
        }
    },
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
        infuraId: process.env.REACT_APP_INFURA // required
        }
    },
    fortmatic: {
        package: Fortmatic, // required
        options: {
        key: process.env.REACT_APP_FORTMATIC // required
        }
    }
};
const web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions // required,
});

export class ConnectWallet extends React.Component {

    connectWeb3 = async () => {
        const wallet = await web3Modal.connect();   
        this.props.connected(wallet);  
    }

    render() {
        if (this.props.web3provider) {
            return (
                <button disabled={true} type="button" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Connected {this.props.account}
                </button>
            );
        } else {
            return (
                <button onClick={this.connectWeb3} type="button" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-tap_blue hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Connect your Wallet
                </button>    
            );
        }
    }
}

export default ConnectWallet;