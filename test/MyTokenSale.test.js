const Token = artifacts.require("MyToken");
const TokenSale = artifacts.require("MyTokenSale");
const KycContract = artifacts.require("KycContract");

const chai = require("./chaisetup.js");
const BN = web3.utils.BN;

require("dotenv").config({path: "../.env"});

const expect = chai.expect;

contract("TokenSale", async accounts => {
  const [ deployerAccount, recipient, anotherAccount ] = accounts;
  
  it("there shouldn't be any coins in my account", async() => {
    let instance = await Token.deployed();
    return expect(instance.balanceOf.call(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
  });

  it("all tokens should be in the tokensale smart contract by default", async () => { 
    let instance = await Token.deployed();
    let balanceOfTokenSaleSmartContract = await instance.balanceOf(TokenSale.address);
    let totalSupply = await instance.totalSupply();
    return expect(balanceOfTokenSaleSmartContract).to.be.a.bignumber.equal(totalSupply); 
  });

  it("should be possible to buy one token by simply sending ether to the smart contract", async () => {
    let tokenInstance = await Token.deployed();
    let tokenSaleInstance = await TokenSale.deployed();
    let kycInstance = await KycContract.deployed();
    let balanceBefore = await tokenInstance.balanceOf(deployerAccount);

    await kycInstance.setKycCompleted(deployerAccount, {from: deployerAccount});
    expect(tokenSaleInstance.sendTransaction({from: deployerAccount, value: web3.utils.toWei("1", "wei")})).to.be.fulfilled;
    balanceBefore = balanceBefore.add(new BN(1));
    return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.bignumber.equal(balanceBefore);
  });
})