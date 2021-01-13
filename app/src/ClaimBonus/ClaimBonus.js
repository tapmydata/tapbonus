import React from "react"

export class ClaimBonus extends React.Component {

    render() {
        if (!this.props.web3provider) {
            return (
                <button disabled={true} type="button" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Claim Your {process.env.REACT_APP_BASE_TOKEN_NAME} Tokens
                </button>    
            );
        } else if (Number(this.props.balance1) + Number(this.props.balance2) <= 0) {
            return (
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-tap_ligh_blue uppercase last:mr-0 mr-1">
                You must hold some {process.env.REACT_APP_TOKEN1_NAME} ({process.env.REACT_APP_TOKEN1_SYMBOL}) or {process.env.REACT_APP_TOKEN2_NAME} ({process.env.REACT_APP_TOKEN2_SYMBOL}) to claim your {process.env.REACT_APP_BASE_TOKEN_SYMBOL}
                </span>
            )
        } else if (this.props.previouslyClaimed) {
            return (
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-tap_ligh_blue uppercase last:mr-0 mr-1">
                    You have previously claimed with this address. Only 1 claim per address. Sorry.
                </span>
            )
        } else if (this.props.transaction) {
            return (
                <div className="mx-auto text-center">
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-tap_ligh_blue uppercase last:mr-0 mr-1">
                        Mining Transaction. Please wait, page will reload when complete. <a href={process.env.REACT_APP_ETHERSCAN + 'tx/' + this.props.transaction} className="underline text-tap_blue hover:text-blue-800 visited:text-tap_light_blue" target="_blank" rel="noreferrer">View on Etherscan.</a> 
                        
                    </span>
                </div>
            );
        } else {
            return (
                <button onClick={this.props.click} type="button" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-tap_blue hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Claim Your {process.env.REACT_APP_BASE_TOKEN_SYMBOL} Tokens
                </button>    
            );
        }
    }
}

export default ClaimBonus;