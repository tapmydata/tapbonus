import React from "react"

const tokenBalance = (props) => {

    let disabled = props.balance > 0 ? "" : "_disabled";

    return (
        <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">

            <div className="bg-white overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6 content-center text-center">
                <img className="max-h-12 mx-auto" src={"images/" +props.token_name + disabled + ".png"} alt={'"' + props.name + '"'} />
            </div>
            <div className="px-4 py-4 sm:px-6 text-center">
                <p><a href={props.website} className="underline text-tap_blue hover:text-blue-800 visited:text-tap_light_blue" target="_blank" rel="noreferrer">{props.name}</a></p>
            </div>
            {props.web3provider &&
            <div className="px-4 py-4 sm:px-6 text-center">
                <p>Balance: <strong>{Number(props.balance).toFixed(2)}</strong></p>
            </div>
            }
            </div>
            
        </div>
    );
};

export default tokenBalance;