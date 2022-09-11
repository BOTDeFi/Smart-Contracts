import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

describe("BOT", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function deployBOTFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, account1, account2, account3] = await ethers.getSigners();

    const BOT = await ethers.getContractFactory("BotToken");
    const bot = await BOT.deploy();

    return { bot, owner, account1, account2, account3 };
  }

  describe("Deployment", function () {
    it("1. Should set the right name and symbol", async function () {
      const { bot } = await loadFixture(deployBOTFixture);

      expect(await bot.symbol()).to.equal("BOT");
      expect(await bot.name()).to.equal("BOT");
    });

    it("2. Should set the right owner", async function () {
      const { bot, owner } = await loadFixture(deployBOTFixture);

      expect(await bot.owner()).to.equal(owner.address);
    });

    it("3. Test owner total supply after deploy", async function () {
      const { bot, owner } = await loadFixture(deployBOTFixture);
      const totalSupply = await bot.totalSupply();
      const balanceOwner = await bot.balanceOf(owner.address);

      expect(totalSupply).to.equal(balanceOwner);
    });
  });

  describe("Public methods", function () {
    it("1. Test setBurnFee = 5%", async function () {
      const fee : number = 5;
      const { bot } = await loadFixture(deployBOTFixture);

      await bot.setBurnFee(fee);

      expect(await bot.burnFee()).to.equal(fee);
    });

    it("2. Test setMaxTxPercent = 5%", async function () {
      const percent : number = 5;
      const { bot } = await loadFixture(deployBOTFixture);

      const totalSupply : BigNumber = await bot.totalSupply();
      const maxTxAmountExpected : BigNumber = totalSupply.div(100).mul(percent);

      await bot.setMaxTxPercent(percent);

      let maxTxAmountResult : BigNumber = await bot.maxTxAmount();
      expect(maxTxAmountExpected).to.equal(maxTxAmountResult);
    });

    it("3. Test setMaxWalletPercent = 5%", async function () {
      const percent : number = 5;
      const { bot } = await loadFixture(deployBOTFixture);

      const totalSupply : BigNumber = await bot.totalSupply();
      const maxWalletAmountExpected : BigNumber = totalSupply.div(100).mul(percent);

      await bot.setMaxWalletPercent(percent);

      let maxWalletAmountResult : BigNumber = await bot.maxWalletAmount();
      expect(maxWalletAmountExpected).to.equal(maxWalletAmountResult);
    });

    it("4. Test setExcludedHolder & isExcludedHolder for account #1", async function () {
      const { bot, account1 } = await loadFixture(deployBOTFixture);

      let isExcludedHolderExpected : boolean = false;
      let isExcludedHolderResult : boolean = await bot.isExcludedHolder(account1.address);
      expect(isExcludedHolderExpected).to.equal(isExcludedHolderResult);

      // Exclude holder from holder list
      await bot.setExcludedHolder(account1.address, true);

      isExcludedHolderExpected = true;
      isExcludedHolderResult = await bot.isExcludedHolder(account1.address);
      expect(isExcludedHolderExpected).to.equal(isExcludedHolderResult);
      
      // Remove holder from excluded holder list
      await bot.setExcludedHolder(account1.address, false);

      isExcludedHolderExpected = false;
      isExcludedHolderResult = await bot.isExcludedHolder(account1.address);
      expect(isExcludedHolderExpected).to.equal(isExcludedHolderResult);
    });

    it("5. Test setIsExcludedFromFee & walletConfig for account #1", async function () {
      const { bot, account1 } = await loadFixture(deployBOTFixture);

      let isExcludedFromFeeExpected : boolean = false;
      let isExcludedFromFeeResult : boolean = (await bot.walletConfig(account1.address)).isExcludedFromFee;
      expect(isExcludedFromFeeExpected).to.equal(isExcludedFromFeeResult);

      // Add to excluded from fee
      await bot.setIsExcludedFromFee(account1.address, true);

      isExcludedFromFeeExpected = true;
      isExcludedFromFeeResult = (await bot.walletConfig(account1.address)).isExcludedFromFee;
      expect(isExcludedFromFeeExpected).to.equal(isExcludedFromFeeResult);
      
      // Remove from excluded from fee
      await bot.setIsExcludedFromFee(account1.address, false);

      isExcludedFromFeeExpected = false;
      isExcludedFromFeeResult = (await bot.walletConfig(account1.address)).isExcludedFromFee;
      expect(isExcludedFromFeeExpected).to.equal(isExcludedFromFeeResult);
    });

    it("6. Test setIsExcludedFromMaxWalletAmount & walletConfig for account #1", async function () {
      const { bot, account1 } = await loadFixture(deployBOTFixture);

      let isExcludedFromMaxWalletAmountExpected : boolean = false;
      let isExcludedFromMaxWalletAmountResult : boolean = (await bot.walletConfig(account1.address)).isExcludedFromMaxWalletAmount;
      expect(isExcludedFromMaxWalletAmountExpected).to.equal(isExcludedFromMaxWalletAmountResult);

      // Add to excluded from max wallet amount
      await bot.setIsExcludedFromMaxWalletAmount(account1.address, true);

      isExcludedFromMaxWalletAmountExpected = true;
      isExcludedFromMaxWalletAmountResult = (await bot.walletConfig(account1.address)).isExcludedFromMaxWalletAmount;
      expect(isExcludedFromMaxWalletAmountExpected).to.equal(isExcludedFromMaxWalletAmountResult);
      
      // Remove from excluded from max wallet amount
      await bot.setIsExcludedFromMaxWalletAmount(account1.address, false);

      isExcludedFromMaxWalletAmountExpected = false;
      isExcludedFromMaxWalletAmountResult = (await bot.walletConfig(account1.address)).isExcludedFromMaxWalletAmount;
      expect(isExcludedFromMaxWalletAmountExpected).to.equal(isExcludedFromMaxWalletAmountResult);
    });

    it("7. Test setIsExcludedFromMaxTxAmount & walletConfig for account #1", async function () {
      const { bot, account1 } = await loadFixture(deployBOTFixture);

      let isExcludedFromMaxTxAmountExpected : boolean = false;
      let isExcludedFromMaxTxAmountResult : boolean = (await bot.walletConfig(account1.address)).isExcludedFromMaxTxAmount;
      expect(isExcludedFromMaxTxAmountExpected).to.equal(isExcludedFromMaxTxAmountResult);

      // Add to excluded from max tx amount
      await bot.setIsExcludedFromMaxTxAmount(account1.address, true);

      isExcludedFromMaxTxAmountExpected = true;
      isExcludedFromMaxTxAmountResult = (await bot.walletConfig(account1.address)).isExcludedFromMaxTxAmount;
      expect(isExcludedFromMaxTxAmountExpected).to.equal(isExcludedFromMaxTxAmountResult);
      
      // Remove from excluded from max tx amount
      await bot.setIsExcludedFromMaxTxAmount(account1.address, false);

      isExcludedFromMaxTxAmountExpected = false;
      isExcludedFromMaxTxAmountResult = (await bot.walletConfig(account1.address)).isExcludedFromMaxTxAmount;
      expect(isExcludedFromMaxTxAmountExpected).to.equal(isExcludedFromMaxTxAmountResult);
    });

    it("8. Test setIsExcludedFromCirculationSupply for account #1", async function () {
      const { bot, account1 } = await loadFixture(deployBOTFixture);

      let isExcludedFromCirculationSupplyExpected : boolean = false;
      let isExcludedFromCirculationSupplyResult : boolean = (await bot.isExcludedFromCirculationSupply(account1.address));
      expect(isExcludedFromCirculationSupplyExpected).to.equal(isExcludedFromCirculationSupplyResult);

      // Add to excluded from max tx amount
      await bot.setIsExcludedFromCirculationSupply(account1.address, true);

      isExcludedFromCirculationSupplyExpected = true;
      isExcludedFromCirculationSupplyResult = await bot.isExcludedFromCirculationSupply(account1.address);
      expect(isExcludedFromCirculationSupplyExpected).to.equal(isExcludedFromCirculationSupplyResult);
      
      // Remove from excluded from max tx amount
      await bot.setIsExcludedFromCirculationSupply(account1.address, false);

      isExcludedFromCirculationSupplyExpected = false;
      isExcludedFromCirculationSupplyResult = await bot.isExcludedFromCirculationSupply(account1.address);
      expect(isExcludedFromCirculationSupplyExpected).to.equal(isExcludedFromCirculationSupplyResult);
    });

    it("9. Test burn 10% of balance of owner (+decrease totalSupply)", async function() {
      const { bot, owner } = await loadFixture(deployBOTFixture);

      const ownerBalance : BigNumber = await bot.balanceOf(owner.address);
      const amountToBurn : BigNumber = ownerBalance.div(100).mul(10);
      const totalSupplyBefore : BigNumber = await bot.totalSupply();
      expect(amountToBurn).to.greaterThan(0);

      await bot.burn(amountToBurn);

      // Check total supply
      const totalSupplyExpected : BigNumber = totalSupplyBefore.sub(amountToBurn);
      const totalSupplyResult : BigNumber = await bot.totalSupply();
      expect(totalSupplyExpected).to.equal(totalSupplyResult);

      // Check owner balance
      const balanceExpected : BigNumber = ownerBalance.sub(amountToBurn);
      const balanceResult : BigNumber = await bot.balanceOf(owner.address);
      expect(balanceExpected).to.equal(balanceResult);
    });

    it("10. Test holder & numberOfHolders after transfer 10% to account #1 from owner", async function() {
      const { bot, owner, account1 } = await loadFixture(deployBOTFixture);

      let numHoldersExpected : BigNumber = BigNumber.from(1);
      let numHoldersResult : BigNumber = await bot.numberOfHolders();
      expect(numHoldersExpected).to.equal(numHoldersResult);

      const ownerBalance : BigNumber = await bot.balanceOf(owner.address);
      const amountToTransfer : BigNumber = ownerBalance.div(100).mul(10);
      await bot.transfer(account1.address, amountToTransfer);

      // Check balance of account #1
      const account1BalanceExpected : BigNumber = amountToTransfer;
      const account1BalanceResult : BigNumber = await bot.balanceOf(account1.address);
      expect(account1BalanceExpected).to.equal(account1BalanceResult);

      // Check if now is holder
      const holder1Expected : string = account1.address;
      const holder1Result : string = await bot.holder(1);
      expect(holder1Expected).to.equal(holder1Result);

      // Check if now is incremented number of holders
      numHoldersExpected = BigNumber.from(2);
      numHoldersResult = await bot.numberOfHolders();
      expect(numHoldersExpected).to.equal(numHoldersResult);
    });

    it("11. Test numberTokensBurned", async function() {
      const { bot, owner } = await loadFixture(deployBOTFixture);

      const ownerBalance : BigNumber = await bot.balanceOf(owner.address);
      const amountToBurn : BigNumber = ownerBalance.div(100).mul(10);
      await bot.burn(amountToBurn);

      // Check number of tokens burned
      const numberTokensBurnedExpected : BigNumber = amountToBurn;
      const numberTokensBurnedResult : BigNumber = await bot.numberTokensBurned();
      expect(numberTokensBurnedExpected).to.equal(numberTokensBurnedResult);
    });

    it("12. Test maxSupply", async function() {
      const { bot } = await loadFixture(deployBOTFixture);

      const maxSupplyResult : BigNumber = await bot.maxSupply();
      const maxSupplyExpected : BigNumber = BigNumber.from("1000000000000000000000000000");
      expect(maxSupplyExpected).to.equal(maxSupplyResult);
    });

    it("12. Test circulationSupply", async function() {
      const { bot, owner, account1, account2, account3 } = await loadFixture(deployBOTFixture);

      const ownerBalance : BigNumber = await bot.balanceOf(owner.address);
      const amountToTransfer : BigNumber = ownerBalance.div(100).mul(10);
      expect(amountToTransfer).to.greaterThan(0);
      await bot.transfer(account1.address, amountToTransfer);
      await bot.transfer(account2.address, amountToTransfer);
      await bot.transfer(account3.address, amountToTransfer);

      // Check circulation supply without changes
      const totalSupply : BigNumber = await bot.totalSupply();
      let circulationSupplyExpected : BigNumber = totalSupply;
      let circulationSupplyResult : BigNumber = await bot.circulationSupply();
      expect(circulationSupplyExpected).to.equal(circulationSupplyResult);

      // Add 2 holder to excluded list from circulation supply
      await bot.setIsExcludedFromCirculationSupply(account1.address, true);
      await bot.setIsExcludedFromCirculationSupply(account2.address, true);

      // Check circulation supply after changes
      circulationSupplyExpected = totalSupply.sub(amountToTransfer.mul(2));
      circulationSupplyResult = await bot.circulationSupply();
      expect(circulationSupplyExpected).to.equal(circulationSupplyResult);
    });

  });

});
