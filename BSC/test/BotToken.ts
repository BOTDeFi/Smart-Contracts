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
      const fee: number = 5;
      const { bot } = await loadFixture(deployBOTFixture);

      await bot.setBurnFee(fee);

      expect(await bot.burnFee()).to.equal(fee);
    });

    it("2. Test setMaxTxPercent = 5%", async function () {
      const percent: number = 5;
      const { bot } = await loadFixture(deployBOTFixture);

      const totalSupply: BigNumber = await bot.totalSupply();
      const maxTxAmountExpected: BigNumber = totalSupply.div(100).mul(percent);

      await bot.setMaxTxPercent(percent);

      let maxTxAmountResult: BigNumber = await bot.maxTxAmount();
      expect(maxTxAmountExpected).to.equal(maxTxAmountResult);
    });

    it("3. Test setMaxWalletPercent = 5%", async function () {
      const percent: number = 5;
      const { bot } = await loadFixture(deployBOTFixture);

      const totalSupply: BigNumber = await bot.totalSupply();
      const maxWalletAmountExpected: BigNumber = totalSupply.div(100).mul(percent);

      await bot.setMaxWalletPercent(percent);

      let maxWalletAmountResult: BigNumber = await bot.maxWalletAmount();
      expect(maxWalletAmountExpected).to.equal(maxWalletAmountResult);
    });

    it("4. Test setExcludedHolder & isExcludedHolder for account #1", async function () {
      const { bot, account1 } = await loadFixture(deployBOTFixture);

      let isExcludedHolderExpected: boolean = false;
      let isExcludedHolderResult: boolean = await bot.isExcludedHolder(account1.address);
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

      let isExcludedFromFeeExpected: boolean = false;
      let isExcludedFromFeeResult: boolean = (await bot.walletConfig(account1.address)).isExcludedFromFee;
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

      let isExcludedFromMaxWalletAmountExpected: boolean = false;
      let isExcludedFromMaxWalletAmountResult: boolean = (await bot.walletConfig(account1.address)).isExcludedFromMaxWalletAmount;
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

      let isExcludedFromMaxTxAmountExpected: boolean = false;
      let isExcludedFromMaxTxAmountResult: boolean = (await bot.walletConfig(account1.address)).isExcludedFromMaxTxAmount;
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

      let isExcludedFromCirculationSupplyExpected: boolean = false;
      let isExcludedFromCirculationSupplyResult: boolean = (await bot.isExcludedFromCirculationSupply(account1.address));
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

    it("9. Test burn 10% of balance of owner (+decrease totalSupply)", async function () {
      const { bot, owner } = await loadFixture(deployBOTFixture);

      const ownerBalance: BigNumber = await bot.balanceOf(owner.address);
      const amountToBurn: BigNumber = ownerBalance.div(100).mul(10);
      const totalSupplyBefore: BigNumber = await bot.totalSupply();
      expect(amountToBurn).to.greaterThan(0);

      await bot.burn(amountToBurn);

      // Check total supply
      const totalSupplyExpected: BigNumber = totalSupplyBefore.sub(amountToBurn);
      const totalSupplyResult: BigNumber = await bot.totalSupply();
      expect(totalSupplyExpected).to.equal(totalSupplyResult);

      // Check owner balance
      const balanceExpected: BigNumber = ownerBalance.sub(amountToBurn);
      const balanceResult: BigNumber = await bot.balanceOf(owner.address);
      expect(balanceExpected).to.equal(balanceResult);
    });

    it("10. Test holder & numberOfHolders after transfer 10% to account #1 from owner", async function () {
      const { bot, owner, account1 } = await loadFixture(deployBOTFixture);

      let numHoldersExpected: BigNumber = BigNumber.from(1);
      let numHoldersResult: BigNumber = await bot.numberOfHolders();
      expect(numHoldersExpected).to.equal(numHoldersResult);

      const ownerBalance: BigNumber = await bot.balanceOf(owner.address);
      const amountToTransfer: BigNumber = ownerBalance.div(100).mul(10);

      // Unlimited max wallet amount to receive transfer
      await bot.setIsExcludedFromMaxWalletAmount(account1.address, true);

      // Transfer to account 1 unlimietd
      await bot.transfer(account1.address, amountToTransfer);

      // Check balance of account #1
      const account1BalanceExpected: BigNumber = amountToTransfer;
      const account1BalanceResult: BigNumber = await bot.balanceOf(account1.address);
      expect(account1BalanceExpected).to.equal(account1BalanceResult);

      // Check if now is holder
      const holder1Expected: string = account1.address;
      const holder1Result: string = await bot.holder(1);
      expect(holder1Expected).to.equal(holder1Result);

      // Check if now is incremented number of holders
      numHoldersExpected = BigNumber.from(2);
      numHoldersResult = await bot.numberOfHolders();
      expect(numHoldersExpected).to.equal(numHoldersResult);
    });

    it("11. Test numberTokensBurned", async function () {
      const { bot, owner } = await loadFixture(deployBOTFixture);

      const ownerBalance: BigNumber = await bot.balanceOf(owner.address);
      const amountToBurn: BigNumber = ownerBalance.div(100).mul(10);
      await bot.burn(amountToBurn);

      // Check number of tokens burned
      const numberTokensBurnedExpected: BigNumber = amountToBurn;
      const numberTokensBurnedResult: BigNumber = await bot.numberTokensBurned();
      expect(numberTokensBurnedExpected).to.equal(numberTokensBurnedResult);
    });

    it("12. Test maxSupply", async function () {
      const { bot } = await loadFixture(deployBOTFixture);

      const maxSupplyResult: BigNumber = await bot.maxSupply();
      const maxSupplyExpected: BigNumber = BigNumber.from("1000000000000000000000000000");
      expect(maxSupplyExpected).to.equal(maxSupplyResult);
    });

    it("13. Test circulationSupply", async function () {
      const { bot, owner, account1, account2, account3 } = await loadFixture(deployBOTFixture);

      const ownerBalance: BigNumber = await bot.balanceOf(owner.address);
      const amountToTransfer: BigNumber = ownerBalance.div(100).mul(10);
      expect(amountToTransfer).to.greaterThan(0);

      // Unlimited max wallet amount to receive transfer
      await bot.setIsExcludedFromMaxWalletAmount(account1.address, true);
      await bot.setIsExcludedFromMaxWalletAmount(account2.address, true);
      await bot.setIsExcludedFromMaxWalletAmount(account3.address, true);

      // Transfers to account 1, 2, 3
      await bot.transfer(account1.address, amountToTransfer);
      await bot.transfer(account2.address, amountToTransfer);
      await bot.transfer(account3.address, amountToTransfer);

      // Check circulation supply without changes
      const totalSupply: BigNumber = await bot.totalSupply();
      let circulationSupplyExpected: BigNumber = totalSupply;
      let circulationSupplyResult: BigNumber = await bot.circulationSupply();
      expect(circulationSupplyExpected).to.equal(circulationSupplyResult);

      // Add 2 holder to excluded list from circulation supply
      await bot.setIsExcludedFromCirculationSupply(account1.address, true);
      await bot.setIsExcludedFromCirculationSupply(account2.address, true);

      // Check circulation supply after changes
      circulationSupplyExpected = totalSupply.sub(amountToTransfer.mul(2));
      circulationSupplyResult = await bot.circulationSupply();
      expect(circulationSupplyExpected).to.equal(circulationSupplyResult);
    });

    it("14. Test transfer without fee from owner", async function () {
      const { bot, owner, account1, account2, account3 } = await loadFixture(deployBOTFixture);

      const ownerBalance: BigNumber = await bot.balanceOf(owner.address);
      const amountToTransfer: BigNumber = ownerBalance.div(100).mul(10);
      expect(amountToTransfer).to.greaterThan(0);

      // Unlimited max wallet amount to receive transfer
      await bot.setIsExcludedFromMaxWalletAmount(account1.address, true);
      await bot.setIsExcludedFromMaxWalletAmount(account2.address, true);
      await bot.setIsExcludedFromMaxWalletAmount(account3.address, true);

      // Transfers to account 1, 2, 3
      await bot.transfer(account1.address, amountToTransfer);
      await bot.transfer(account2.address, amountToTransfer);
      await bot.transfer(account3.address, amountToTransfer);

      const account1BalanceExpected = amountToTransfer;
      const account2BalanceExpected = amountToTransfer;
      const account3BalanceExpected = amountToTransfer;

      const account1BalanceResult = await bot.balanceOf(account1.address);
      const account2BalanceResult = await bot.balanceOf(account2.address);
      const account3BalanceResult = await bot.balanceOf(account3.address);

      expect(account1BalanceExpected).to.equal(account1BalanceResult);
      expect(account2BalanceExpected).to.equal(account2BalanceResult);
      expect(account3BalanceExpected).to.equal(account3BalanceResult);
    });

    it("15. Test transfer with fee between users", async function () {
      const { bot, owner, account1, account3 } = await loadFixture(deployBOTFixture);

      const ownerBalance: BigNumber = await bot.balanceOf(owner.address);
      const amountToTransfer: BigNumber = ownerBalance.div(100).mul(1);
      expect(amountToTransfer).to.greaterThan(0);
      // Owner to accounts without fee
      await bot.transfer(account1.address, amountToTransfer);

      const account1BalanceExpected: BigNumber = amountToTransfer;
      const account1BalanceResult: BigNumber = await bot.balanceOf(account1.address);

      expect(account1BalanceExpected).to.equal(account1BalanceResult);

      // Users transfer to other users with fee
      await bot.connect(account1).transfer(account3.address, amountToTransfer);

      const feeExpected: BigNumber = amountToTransfer.div(100).mul(2); // 2% burn fee
      const account3BalanceExpected: BigNumber = (amountToTransfer.sub(feeExpected));
      const account3BalanceResult: BigNumber = await bot.balanceOf(account3.address);

      expect(account3BalanceExpected).to.equal(account3BalanceResult);
    });
  });

  describe("Properties", function () {
    it("1. Test maxTxAmount OK", async function () {
      const { bot, owner, account1, account2 } = await loadFixture(deployBOTFixture);

      // Set max tx amount 10%
      await bot.setMaxTxPercent(10);

      const maxTxAmount: BigNumber = await bot.maxTxAmount();
      const ownerBalance: BigNumber = await bot.balanceOf(owner.address);
      expect(ownerBalance).to.greaterThanOrEqual(maxTxAmount);
      expect(maxTxAmount).to.greaterThan(0);

      // Change max wallet amount to account 1 & 2
      await bot.setIsExcludedFromMaxWalletAmount(account1.address, true);
      await bot.setIsExcludedFromMaxWalletAmount(account2.address, true);

      // Transfer from owner to account 1 (without limits)
      await bot.transfer(account1.address, ownerBalance);

      // Transfer from account 1 to account 2 amount equal max tx amount
      await bot.connect(account1).transfer(account2.address, maxTxAmount);

      const account2BalanceExpected: BigNumber = maxTxAmount.div(100).mul(98); // transfer burn 2% fee
      const account2BalanceResult: BigNumber = await bot.balanceOf(account2.address);

      expect(account2BalanceExpected).to.equal(account2BalanceResult);
    });

    it("2. Test maxTxAmount FAIL", async function () {
      const { bot, owner, account1, account2 } = await loadFixture(deployBOTFixture);

      // Set max tx amount 10%
      await bot.setMaxTxPercent(10);

      const maxTxAmount: BigNumber = await bot.maxTxAmount();
      const transferAmount: BigNumber = maxTxAmount.mul(2);
      const ownerBalance: BigNumber = await bot.balanceOf(owner.address);
      expect(ownerBalance).to.greaterThan(0);

      // Change max wallet amount to account 1 & 2
      await bot.setIsExcludedFromMaxWalletAmount(account1.address, true);
      await bot.setIsExcludedFromMaxWalletAmount(account2.address, true);

      // Transfer from owner to account 1 (without limits)
      await bot.transfer(account1.address, ownerBalance);

      // Transfer from account 1 to account 2 amount greater max tx amount and catch exception 'BotToken: Transfer amount exceeds the max tx amount.'
      await expect(
        bot.connect(account1).transfer(account2.address, transferAmount)
      ).to.be.revertedWith("BotToken: Transfer amount exceeds the max tx amount.");
    });

    it("3. Test maxWalletAmount OK", async function () {
      const { bot, owner, account1 } = await loadFixture(deployBOTFixture);

      // Set max wallet balance 1%
      await bot.setMaxWalletPercent(1);

      const maxWalletAmount: BigNumber = await bot.maxWalletAmount();
      const ownerBalance: BigNumber = await bot.balanceOf(owner.address);
      expect(ownerBalance).to.greaterThanOrEqual(maxWalletAmount);
      expect(maxWalletAmount).to.greaterThan(0);

      // Transfer from owner to account 1 (limit in wallet of balance in account 1)
      await bot.transfer(account1.address, maxWalletAmount);

      const account1BalanceExpected: BigNumber = maxWalletAmount; // without fee, because transfer is from owner
      const account1BalanceResult: BigNumber = await bot.balanceOf(account1.address);

      expect(account1BalanceExpected).to.equal(account1BalanceResult);
    });

    it("4. Test maxWalletAmount FAIL", async function () {
      const { bot, owner, account1 } = await loadFixture(deployBOTFixture);

      // Set max wallet balance 1%
      await bot.setMaxWalletPercent(1);

      let maxWalletAmount: BigNumber = await bot.maxWalletAmount();
      maxWalletAmount = maxWalletAmount.mul(2); // Change amount to get exception
      const ownerBalance: BigNumber = await bot.balanceOf(owner.address);
      expect(ownerBalance).to.greaterThanOrEqual(maxWalletAmount);
      expect(maxWalletAmount).to.greaterThan(0);

      // Transfer from owner to account 1 and catch exception 'BotToken: Exceeds maximum wallet amount'
      await expect(
        bot.transfer(account1.address, maxWalletAmount)
      ).to.be.revertedWith("BotToken: Exceeds maximum wallet amount");
    });
  });
});