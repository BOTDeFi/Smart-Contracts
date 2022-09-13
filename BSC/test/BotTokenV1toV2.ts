import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { botTokenV2Sol } from "../typechain-types/contracts";

describe("BOT", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function deployBOTFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, account1, account2, account3] = await ethers.getSigners();

    const BOTV1 = await ethers.getContractFactory("BotTokenV1");
    const BOTV2 = await ethers.getContractFactory("BotTokenV2");
    const UpgradeToken = await ethers.getContractFactory("UpgradeToken");
    const botV1 = await BOTV1.deploy();
    const botV2 = await BOTV2.deploy();
    const upgradeToken = await UpgradeToken.deploy(botV1.address, botV2.address);

    return { botV1, botV2, upgradeToken, owner, account1, account2, account3 };
  }

  describe("BOT V1 to V2", function () {

    it("1. Test upgrade. FAIL: UpgradeToken: amount to upgrade is zero", async function () {
      const { upgradeToken, account1 } = await loadFixture(deployBOTFixture);

      await expect(
        upgradeToken.connect(account1).upgrade()
      ).to.be.revertedWith("UpgradeToken: amount to upgrade is zero");
    });

    it("2. Test upgrade. FAIL: UpgradeToken: amount to upgrade is greater allowed amount", async function () {
      const { upgradeToken, botV1, account1 } = await loadFixture(deployBOTFixture);

      const maxWalletAmount: BigNumber = await botV1.maxWalletAmount();
      expect(maxWalletAmount).to.greaterThan(0);

      // Transfer from owner to account 1
      await botV1.transfer(account1.address, maxWalletAmount);

      await expect(
        upgradeToken.connect(account1).upgrade()
      ).to.be.revertedWith("UpgradeToken: amount to upgrade is greater allowed amount");
    });

    it("3. Test upgrade. FAIL: UpgradeToken: low balance of new tokens in the contract", async function () {
      const { upgradeToken, botV1, account1 } = await loadFixture(deployBOTFixture);

      const maxWalletAmount: BigNumber = await botV1.maxWalletAmount();
      expect(maxWalletAmount).to.greaterThan(0);

      // Transfer from owner to account 1
      await botV1.transfer(account1.address, maxWalletAmount);
      // Allow amount to upgrade
      await botV1.connect(account1).approve(upgradeToken.address, maxWalletAmount);

      await expect(
        upgradeToken.connect(account1).upgrade()
      ).to.be.revertedWith("UpgradeToken: low balance of new tokens in the contract");
    });

    it("4. Test upgrade. OK UpgradeToken: amount to upgrade is greater allowed amount", async function () {
      // ARRANGE
      const { upgradeToken, botV1, botV2, account1 } = await loadFixture(deployBOTFixture);

      const maxWalletAmount: BigNumber = await botV1.maxWalletAmount();
      expect(maxWalletAmount).to.greaterThan(0);

      // ACT

      // Transfer from owner to account 1
      await botV1.transfer(account1.address, maxWalletAmount);
      // Allow amount to upgrade
      await botV1.connect(account1).approve(upgradeToken.address, maxWalletAmount);
      // Transfer new tokens to the contract
      await botV2.transfer(upgradeToken.address, maxWalletAmount);
      // Exclude upgradeToken from fee
      await botV2.setIsExcludedFromFee(upgradeToken.address, true);
      // Upgrade tokens V1 to V2
      await upgradeToken.connect(account1).upgrade();

      const balanceAccount1Result = await botV2.balanceOf(account1.address);
      const balanceAccount1Expected = maxWalletAmount;

      // ASSERT
      expect(balanceAccount1Expected).to.equal(balanceAccount1Result);
    });

  });
});