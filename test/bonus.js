// Load dependencies
const { expect } = require('chai');

// Import utilities from Test Helpers
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

// Load compiled artifacts
const ERC20Token = artifacts.require("ERC20Token");
const Bonus = artifacts.require("Bonus");

const Web3 = require('web3');

contract("Bonus", function ([ owner, other, other2, other3 ]) {

    const TOKEN_REWARD = 55;
    const TOKEN_FLOAT = 120;

    beforeEach(async function () {

        const one_hundred_million = Web3.utils.toWei('100000000', 'ether');

        this.tapInstance = await ERC20Token.new('TapToken', 'TAP', one_hundred_million);
        await this.tapInstance.mint(owner, one_hundred_million);

        this.token1 = await ERC20Token.new('Ocean', 'OCN', one_hundred_million);
        await this.token1.mint(owner, one_hundred_million);

        this.token2 = await ERC20Token.new('Streamr', 'STR', one_hundred_million);
        await this.token2.mint(owner, one_hundred_million);

        this.bonus = await Bonus.new(this.tapInstance.address, this.token1.address, this.token2.address, TOKEN_REWARD);

        await this.tapInstance.transfer(this.bonus.address, TOKEN_FLOAT);
    });
  
    it('Bonus contract has a tap balance', async function () {
        expect((await this.tapInstance.balanceOf(this.bonus.address)).toString()).to.equal(TOKEN_FLOAT.toString());
    });

    it('Returns the token reward', async function () {
        expect((await this.bonus.getBonusAmount()).toString()).to.equal(TOKEN_REWARD.toString());
    });

    it('Can set new token reward', async function () {
        const NEW_TOKEN_REWARD = 1250;
        await this.bonus.setBonusAmount(NEW_TOKEN_REWARD);
        expect((await this.bonus.getBonusAmount()).toString()).to.equal(NEW_TOKEN_REWARD.toString());
    });

    it('Must be owner to set token reward', async function () {
        const NEW_TOKEN_REWARD = 1250;
        
        await expectRevert(
            this.bonus.setBonusAmount(NEW_TOKEN_REWARD, {from: other}),
            "Ownable: caller is not the owner"
        );
    });

    it('Bonus reverts if no token1 or token2 held', async function () {
        await expectRevert(
            this.bonus.claim({from: other}),
            "Must hold some Token1 or Token2"
        );
        expect((await this.tapInstance.balanceOf(other)).toString()).to.equal("0");
    });

    it('Bonus is paid if token1 is held', async function () {
        await this.token1.transfer(other, 10);
        await this.token1.transfer(other, 10);
        await this.bonus.claim({from: other});
        expect((await this.tapInstance.balanceOf(other)).toString()).to.equal(TOKEN_REWARD.toString());
    });

    it('Bonus is paid if token2 is held', async function () {
        await this.token2.transfer(other, 10);
        await this.bonus.claim({from: other});
        expect((await this.tapInstance.balanceOf(other)).toString()).to.equal(TOKEN_REWARD.toString());
    });

    it('Bonus is paid if token1 and 2 is held', async function () {
        await this.token1.transfer(other, 10);
        await this.token2.transfer(other, 10);
        await this.bonus.claim({from: other});
        expect((await this.tapInstance.balanceOf(other)).toString()).to.equal(TOKEN_REWARD.toString());
    });

    it('Bonus can not be claimed twice', async function () {
        await this.token1.transfer(other, 10);
        await this.bonus.claim({from: other});
        await expectRevert(
            this.bonus.claim({from: other}),
            "Address already claimed bonus"
        );
    });

    it('Bonus can be claimed twice if allowMultipleClaims is set', async function () {
        await this.token1.transfer(other, 10);
        await this.bonus.setAllowMultipleClaims(true);
        await this.bonus.claim({from: other});
        await this.bonus.claim({from: other});
        expect((await this.tapInstance.balanceOf(other)).toString()).to.equal((TOKEN_REWARD*2).toString());
    });

    it('Bonus pool will not pay out if empty', async function () {
        await this.token1.transfer(other, 10);
        await this.token1.transfer(other2, 10);
        await this.token1.transfer(other3, 10);
        await this.bonus.claim({from: other});
        await this.bonus.claim({from: other2});
        await expectRevert(
            this.bonus.claim({from: other3}),
            "ERC20: transfer amount exceeds balance"
        );

    });

});
