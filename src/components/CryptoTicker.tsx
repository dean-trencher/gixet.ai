import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CryptoConfig {
  contract_address: string;
  pump_fun_link: string;
}

export const CryptoTicker = () => {
  const [config, setConfig] = useState<CryptoConfig | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchConfig();
    
    // Subscribe to changes
    const channel = supabase
      .channel('crypto-config-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'crypto_config'
        },
        () => {
          fetchConfig();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchConfig = async () => {
    const { data } = await supabase
      .from('crypto_config')
      .select('*')
      .single();
    
    if (data) {
      setConfig(data);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Contract address copied to clipboard",
    });
  };

  if (!config || !config.contract_address) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white py-2 overflow-hidden">
      <div className="animate-ticker whitespace-nowrap flex items-center gap-8 px-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">$CORTEXT</span>
        </div>
        
        {config.contract_address && (
          <div className="flex items-center gap-2">
            <span className="text-sm">CA:</span>
            <span className="font-mono text-sm">{config.contract_address}</span>
            <button 
              onClick={() => copyToClipboard(config.contract_address)}
              className="hover:scale-110 transition-transform"
            >
              <Copy size={16} />
            </button>
          </div>
        )}
        
        {config.pump_fun_link && (
          <a 
            href={config.pump_fun_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline"
          >
            <span className="text-sm">PUMP.FUN</span>
            <ExternalLink size={14} />
          </a>
        )}
        
        {/* Repeat for continuous scroll */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">$CORTEXT</span>
        </div>
        
        {config.contract_address && (
          <div className="flex items-center gap-2">
            <span className="text-sm">CA:</span>
            <span className="font-mono text-sm">{config.contract_address}</span>
            <button 
              onClick={() => copyToClipboard(config.contract_address)}
              className="hover:scale-110 transition-transform"
            >
              <Copy size={16} />
            </button>
          </div>
        )}
        
        {config.pump_fun_link && (
          <a 
            href={config.pump_fun_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline"
          >
            <span className="text-sm">PUMP.FUN</span>
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
};