import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      publicKey?: { toString: () => string };
    };
  }
}

export const WalletConnect = () => {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana?.publicKey) {
        setConnected(true);
        setPublicKey(solana.publicKey.toString());
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (!solana) {
      toast({
        title: "Phantom Wallet Not Found",
        description: "Please install Phantom wallet",
        variant: "destructive",
      });
      window.open('https://phantom.app/', '_blank');
      return;
    }

    try {
      const response = await solana.connect();
      setConnected(true);
      setPublicKey(response.publicKey.toString());
      toast({
        title: "Wallet Connected",
        description: `Connected: ${response.publicKey.toString().slice(0, 8)}...`,
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = async () => {
    const { solana } = window;
    if (solana) {
      await solana.disconnect();
      setConnected(false);
      setPublicKey(null);
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
    }
  };

  return (
    <Button
      variant={connected ? "outline" : "default"}
      onClick={connected ? disconnectWallet : connectWallet}
      className="flex items-center gap-2"
    >
      <Wallet size={18} />
      {connected 
        ? `${publicKey?.slice(0, 4)}...${publicKey?.slice(-4)}`
        : 'Connect Wallet'
      }
    </Button>
  );
};