const Token = artifacts.require("MyToken");
const TokenSale = artifacts.require("MyTokenSale");

const chai = require("./chaisetup.js");
const BN = web3.utils.BN;

require("dotenv").config({path: "../.env"});

const expect = chai.expect;

contract("TokenSale", async accounts => {
  const [ initialHolder, recipient, anotherAccount ] = accounts;
  it("there shouldn't be any coins in my account", async() => {
    let instance = await Token.deployed();
    return expect(instance.balanceOf.call(initialHolder)).to.eventually.be.a.bignumber.equal(new BN(0));
  });
})