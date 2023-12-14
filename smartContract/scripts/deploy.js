// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {


  // const usdc = await hre.ethers.deployContract("USDCToken", []);
  // await usdc.waitForDeployment();
  // console.log("usdc token : ", usdc.target);

  const lock = await hre.ethers.deployContract("LandRecord", [10, "0xAE5dC947A10f328c14Cf3b30470dCd06852e4981", "0x39D27CE3191ccD09954a1d15127433c1e35a546c"]);
  await lock.waitForDeployment();
  console.log(
    `contract is deployed to", ${lock.target}`
  );


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
