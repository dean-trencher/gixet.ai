import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const AIGeneratorCard = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-content', {
        body: { prompt }
      });

      if (error) throw error;

      setResult(data.content);
      setIsExpanded(false);
      toast({
        title: "Success",
        description: "Content generated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-2xl mb-20">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-primary" size={24} />
        <h3 className="text-2xl font-bold">Try AI Generation</h3>
      </div>
      
      <div className="space-y-4">
        <Textarea
          placeholder="Enter your prompt here... (e.g., 'Write a creative story about AI')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px] resize-none"
          disabled={loading}
        />
        
        <Button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={18} />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2" size={18} />
              Generate with AI
            </>
          )}
        </Button>
        
        {result && (
          <div className="mt-6 p-6 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-3">Generated Content:</h4>
            <div className="relative">
              <p className={`whitespace-pre-wrap ${!isExpanded && result.length > 300 ? 'line-clamp-4' : ''}`}>
                {result}
              </p>
              {result.length > 300 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2"
                >
                  {isExpanded ? 'Read Less' : 'Read More'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};