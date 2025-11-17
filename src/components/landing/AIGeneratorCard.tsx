import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const AIGeneratorCard = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
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

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (data?.content) {
        setResult(data.content);
        setIsExpanded(false);
        toast({
          title: "Success",
          description: "Content generated successfully",
        });
      } else {
        throw new Error('No content received');
      }
    } catch (error: any) {
      console.error('AI Generation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
  };

  const isCodeContent = (text: string) => {
    const codePatterns = [
      /^(function|const|let|var|class|import|export)/m,
      /[{}\[\];()]/,
      /^(def|class|import|from)/m,
      /<[a-z][\s\S]*>/i,
      /^\s*(public|private|protected)/m
    ];
    return codePatterns.some(pattern => pattern.test(text));
  };

  const highlightCode = (code: string) => {
    return code
      .replace(/\b(function|const|let|var|class|import|export|from|return|if|else|for|while|switch|case|break|continue|try|catch|throw|async|await|new|this|super|extends|implements|interface|type|enum|public|private|protected|static|readonly|get|set)\b/g, '<span class="text-blue-400">$1</span>')
      .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-orange-400">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-green-400">$1</span>')
      .replace(/(["'`])(.*?)\1/g, '<span class="text-yellow-400">$1$2$1</span>')
      .replace(/\/\/(.*?)$/gm, '<span class="text-gray-500">//$1</span>')
      .replace(/\/\*([\s\S]*?)\*\//g, '<span class="text-gray-500">/*$1*/</span>');
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
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Generated Content:</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="relative">
              {isCodeContent(result) ? (
                <div className="bg-black/80 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm font-mono">
                    <code 
                      className={`whitespace-pre-wrap ${!isExpanded && result.length > 500 ? 'line-clamp-6' : ''}`}
                      dangerouslySetInnerHTML={{ __html: highlightCode(result) }}
                    />
                  </pre>
                </div>
              ) : (
                <p className={`whitespace-pre-wrap ${!isExpanded && result.length > 300 ? 'line-clamp-4' : ''}`}>
                  {result}
                </p>
              )}
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