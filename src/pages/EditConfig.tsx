import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const EditConfig = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [pumpFunLink, setPumpFunLink] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    const { data } = await supabase
      .from('crypto_config')
      .select('*')
      .single();
    
    if (data) {
      setContractAddress(data.contract_address || '');
      setPumpFunLink(data.pump_fun_link || '');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    
    const { data: existingData } = await supabase
      .from('crypto_config')
      .select('id')
      .maybeSingle();

    let error;
    
    if (existingData) {
      // Update existing record
      const result = await supabase
        .from('crypto_config')
        .update({
          contract_address: contractAddress,
          pump_fun_link: pumpFunLink,
        })
        .eq('id', existingData.id);
      error = result.error;
    } else {
      // Insert new record
      const result = await supabase
        .from('crypto_config')
        .insert({
          contract_address: contractAddress,
          pump_fun_link: pumpFunLink,
        });
      error = result.error;
    }

    if (error) {
      console.error('Error saving config:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save configuration",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Configuration saved successfully",
      });
      navigate('/');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-32 px-4 pb-24">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Home
        </Button>
        
        <div className="glass-panel p-8 rounded-xl">
          <h1 className="text-3xl font-bold mb-6">Edit Crypto Configuration</h1>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="contract">Contract Address</Label>
              <Input
                id="contract"
                type="text"
                placeholder="Enter Solana contract address"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="pump">PUMP.FUN Link</Label>
              <Input
                id="pump"
                type="url"
                placeholder="https://pump.fun/..."
                value={pumpFunLink}
                onChange={(e) => setPumpFunLink(e.target.value)}
                className="mt-2"
              />
            </div>
            
            <Button 
              onClick={handleSave}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditConfig;