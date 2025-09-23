# Web3 Points Repo

## Pasos para ejecutar

### 1. Clonar y entrar
```bash
git clone <este repo>
cd web3-points-repo
```

### 2. Instalar dependencias
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 3. Variables de entorno
Crear `.env` en raíz y backend:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/TU_API_KEY
DEPLOYER_PRIVATE_KEY=0x_tu_private_key
CONTRACT_ADDRESS=0x_tu_contrato
```

### 4. Deploy contrato
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### 5. Levantar backend
```bash
cd backend
node server.js
```

### 6. Levantar frontend
```bash
cd frontend
npm run dev
```
