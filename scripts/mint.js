const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const contractAddr = process.env.CONTRACT_ADDRESS;
  const Points = await ethers.getContractAt("PointsToken", contractAddr);
  const tx = await Points.mintPoints(deployer.address, 10);
  await tx.wait();
  console.log("Minted 10 points to", deployer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
