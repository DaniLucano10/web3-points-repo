import React, { useState } from "react";
import { ethers } from "ethers";
import abi from "../../artifacts/contracts/PointsToken.sol/PointsToken.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(false);

  // Conectar wallet
  async function connect() {
    try {
      if (!window.ethereum) return alert("Instala MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const { chainId } = await provider.getNetwork();

      // Verificar red (Sepolia)
      if (chainId.toString() !== "11155111") {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }], // Sepolia
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            return alert("Por favor, agrega la red de Sepolia a MetaMask.");
          }
          return alert("Error al cambiar de red.");
        }
      }

      // Obtener cuenta
      const [addr] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(addr);

      // Obtener balance inicial
      await getBalance(addr);
    } catch (err) {
      console.error(err);
      alert("Error al conectar wallet");
    }
  }

  // 🔹 Consultar balance
  async function getBalance(addr) {
    try {
      const res = await fetch(`http://localhost:3001/balance/${addr}`);
      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance); // siempre actualizado desde backend
      } else {
        console.error("Error en backend:", data);
        setBalance("0");
      }
    } catch (err) {
      console.error("Error al obtener balance:", err);
      setBalance("0");
    }
  }

  // Pedir 10 puntos
  async function requestPoints() {
    if (!account) return alert("Conecta tu wallet primero");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: account, amount: 10 }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(data);
        return alert("Error al pedir puntos: " + data.error);
      }
      alert(`Tx confirmada: ${data.tx}\nNuevo balance: ${data.newBalance}`);
      setBalance(data.newBalance); // usar balance que devuelve backend
    } catch (err) {
      console.error(err);
      alert("Error al pedir puntos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      {!account ? (
        <button onClick={connect}>Conectar Wallet</button>
      ) : (
        <div>
          <p>Cuenta: {account}</p>
          <p>Puntos: {balance}</p>
          <button onClick={requestPoints} disabled={loading}>
            {loading ? "Procesando..." : "Pedir 10 puntos"}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
