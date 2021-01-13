const ERC20Token = artifacts.require("ERC20Token");
const Bonus = artifacts.require("Bonus");

var Web3 = require('web3');

module.exports = async function(deployer, network, accounts) {
  
  const one_hundred_million = Web3.utils.toWei('100000000', 'ether');
  const five_hundred = Web3.utils.toWei('500', 'ether');

  /*await deployer.deploy(ERC20Token, 'TapToken', 'TAP', one_hundred_million);
  tapInstance = await ERC20Token.deployed();
  await tapInstance.mint(accounts[0], one_hundred_million);

 await deployer.deploy(ERC20Token, 'Ocean', 'OCN', one_hundred_million);
  oceanInstance = await ERC20Token.deployed();
  await oceanInstance.mint(accounts[0], one_hundred_million);

  await deployer.deploy(ERC20Token, 'Streamr', 'STR', one_hundred_million);
  streamrInstance = await ERC20Token.deployed();
  await streamrInstance.mint(accounts[0], one_hundred_million);*/

  await deployer.deploy(Bonus, '0x7f1f2d3dfa99678675ece1c243d3f7bc3746db5d', '0x967da4048cD07aB37855c090aAF366e4ce1b9F48', '0x0cf0ee63788a0849fe5297f3407f701e122cc023', five_hundred);
};
