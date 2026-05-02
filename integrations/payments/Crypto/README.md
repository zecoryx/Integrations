# Crypto Wallet Integration

WalletConnect protokoli orqali MetaMask va boshqa kripto hamyonlarni ulash.

> **Eslatma:** Joriy `useWallet.ts` — bu placeholder (namuna) implementatsiya. Real loyiha uchun `wagmi` yoki `web3-react` kutubxonasini qo'shing.

## Setup

1. [WalletConnect Cloud](https://cloud.walletconnect.com) da loyiha yarating.
2. **Project ID** oling.
3. `.env` fayliga qo'shing:

```env
WALLET_CONNECT_PROJECT_ID=your_project_id
```

## Real implementatsiya uchun

```bash
npm install wagmi viem @tanstack/react-query
```

```tsx
import { createConfig, http, WagmiProvider } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";

const config = createConfig({
  chains: [mainnet, polygon],
  connectors: [
    walletConnect({ projectId: process.env.WALLET_CONNECT_PROJECT_ID }),
  ],
  transports: { [mainnet.id]: http(), [polygon.id]: http() },
});

// App.tsx:
<WagmiProvider config={config}>
  <App />
</WagmiProvider>
```

## Joriy placeholder fayllar

| Fayl | Maqsad |
|------|--------|
| `useWallet.ts` | Mock hamyon ulanish hook (real emas) |
| `ConnectButton.tsx` | "Hamyonni ulash" tugmasi |

## Joriy hookni ishlatish (mock)

```tsx
import { useWallet } from "./useWallet";

const WalletPage = () => {
  const { isConnected, account, connectWallet, disconnectWallet } = useWallet();

  return (
    <div>
      {isConnected ? (
        <>
          <p>Ulangan: {account}</p>
          <button onClick={disconnectWallet}>Uzish</button>
        </>
      ) : (
        <button onClick={connectWallet}>Hamyonni ulash</button>
      )}
    </div>
  );
};
```

## Qo'llab-quvvatlanadigan hamyonlar (real wagmi bilan)

- MetaMask
- Coinbase Wallet
- WalletConnect (QR code)
- Rainbow Wallet
- va 300+ boshqalar
