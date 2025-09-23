const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Desplegando con la cuenta:", deployer.address);

  const Points = await ethers.getContractFactory("PointsToken");
  const points = await Points.deploy(deployer.address);

  await points.waitForDeployment();

  console.log("PointsToken desplegado en:", points.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
