import { ethers } from "hardhat";

async function main() {

  // Contract BOT

  const BOT = await ethers.getContractFactory("BOT");
  const bot = await BOT.deploy();

  await bot.deployed();

  console.log("BOT deployed to:", bot.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
