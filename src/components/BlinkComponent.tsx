"use client";

import { Blink, useAction } from "@dialectlabs/blinks";
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";

export default function BlinkComponent() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { adapter } = useActionSolanaWalletAdapter(connection);

  const { action, isLoading } = useAction({
    url: "http://localhost:3000/get-action",
    adapter,
  });

  if (!publicKey) {
    return <div>Please connect your wallet</div>;
  }

  return (
    <div>
      <h2 className="mb-2 text-xl font-bold">Blink Component</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        action && <Blink action={action} websiteText={action?.url ?? ""} />
      )}
    </div>
  );
}
