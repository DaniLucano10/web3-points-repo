// server.cjs
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const dotenv = require("dotenv");

// Cargar variables de entorno
dotenv.config();

// Cargar ABI del contrato
const PointsTokenJson = require("../artifacts/contracts/PointsToken.sol/PointsToken.json");

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a Sepolia
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);

// Verificar que la wallet está bien
console.log("Usando wallet:", wallet.address);

// Conectar el contrato usando la dirección de .env
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  PointsTokenJson.abi,
  wallet
);

// RUTA: Mint de puntos (solo owner)
app.post("/mint", async (req, res) => {
  try {
    const { user, amount } = req.body;
    const tx = await contract.mintPoints(user, amount);
    await tx.wait();
    res.json({ ok: true, tx: tx.hash });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// RUTA: Consultar balance de puntos
app.get("/balance/:user", async (req, res) => {
  try {
    const balance = await contract.balanceOf(req.params.user);
    res.json({ balance: balance.toString() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
