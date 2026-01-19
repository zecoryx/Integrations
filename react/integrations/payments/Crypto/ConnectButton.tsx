// @ts-nocheck
import React from "react";
import { useWallet } from "./useWallet";

// A button component that allows users to connect and disconnect their cryptocurrency wallet.
// It displays the connection status and the connected account address.
const ConnectButton: React.FC = () => {
  const { isConnected, account, connectWallet, disconnectWallet } = useWallet();

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Connected: {account}</p>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default ConnectButton;