// server.cjs
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const dotenv = require("dotenv");

dotenv.config();

const PointsTokenJson = require("../artifacts/contracts/PointsToken.sol/PointsToken.json");

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a Sepolia
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);

console.log("Usando wallet:", wallet.address);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  PointsTokenJson.abi,
  wallet
);

// Mint de puntos
app.post("/mint", async (req, res) => {
  try {
    const { user, amount } = req.body;
    console.log(`Minting ${amount} puntos para ${user}`);

    const tx = await contract.mintPoints(user, amount);
    await tx.wait();

    const newBalance = await contract.balanceOf(user);
    console.log(`Nuevo balance de ${user}: ${newBalance.toString()}`);

    res.json({ ok: true, tx: tx.hash, newBalance: newBalance.toString() });
  } catch (e) {
    console.error("Error en /mint:", e);
    res.status(500).json({ error: e.message });
  }
});

// Balance
app.get("/balance/:user", async (req, res) => {
  try {
    const balance = await contract.balanceOf(req.params.user);
    res.json({ balance: balance.toString() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
