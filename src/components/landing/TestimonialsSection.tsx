import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AnimatedTransition } from "@/components/AnimatedTransition";
import { Code2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SyntaxHighlight = ({ code, language }: { code: string; language: string }) => {
  const highlightCode = (text: string) => {
    // Keywords
    const keywords = ['const', 'let', 'var', 'function', 'async', 'await', 'return', 'if', 'else', 'for', 'while', 'import', 'from', 'class', 'def', 'true', 'false', 'null', 'undefined'];
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    
    // Strings
    const stringRegex = /(['"`])((?:\\.|[^\\])*?)\1/g;
    
    // Comments
    const commentRegex = /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm;
    
    // Numbers
    const numberRegex = /\b(\d+)\b/g;
    
    // Functions
    const functionRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
    
    let result = text;
    const replacements: { index: number; length: number; replacement: string }[] = [];
    
    // Find all matches and store them
    let match;
    
    // Comments (highest priority)
    while ((match = commentRegex.exec(text)) !== null) {
      replacements.push({
        index: match.index,
        length: match[0].length,
        replacement: `<span class="text-green-400">${match[0]}</span>`
      });
    }
    
    // Strings
    commentRegex.lastIndex = 0;
    while ((match = stringRegex.exec(text)) !== null) {
      const isInComment = replacements.some(r => 
        match!.index >= r.index && match!.index < r.index + r.length
      );
      if (!isInComment) {
        replacements.push({
          index: match.index,
          length: match[0].length,
          replacement: `<span class="text-amber-400">${match[0]}</span>`
        });
      }
    }
    
    // Keywords
    stringRegex.lastIndex = 0;
    while ((match = keywordRegex.exec(text)) !== null) {
      const isInStringOrComment = replacements.some(r => 
        match!.index >= r.index && match!.index < r.index + r.length
      );
      if (!isInStringOrComment) {
        replacements.push({
          index: match.index,
          length: match[0].length,
          replacement: `<span class="text-purple-400">${match[0]}</span>`
        });
      }
    }
    
    // Functions
    keywordRegex.lastIndex = 0;
    while ((match = functionRegex.exec(text)) !== null) {
      const isInStringOrComment = replacements.some(r => 
        match!.index >= r.index && match!.index < r.index + r.length
      );
      if (!isInStringOrComment) {
        const funcName = match[1];
        replacements.push({
          index: match.index,
          length: funcName.length,
          replacement: `<span class="text-blue-400">${funcName}</span>`
        });
      }
    }
    
    // Numbers
    functionRegex.lastIndex = 0;
    while ((match = numberRegex.exec(text)) !== null) {
      const isInStringOrComment = replacements.some(r => 
        match!.index >= r.index && match!.index < r.index + r.length
      );
      if (!isInStringOrComment) {
        replacements.push({
          index: match.index,
          length: match[0].length,
          replacement: `<span class="text-cyan-400">${match[0]}</span>`
        });
      }
    }
    
    // Sort by index in reverse order
    replacements.sort((a, b) => b.index - a.index);
    
    // Apply replacements
    for (const r of replacements) {
      result = result.slice(0, r.index) + r.replacement + result.slice(r.index + r.length);
    }
    
    return result;
  };

  return (
    <pre className="bg-muted/30 rounded-lg p-4 overflow-x-auto border border-border/50 h-full">
      <code 
        className="text-xs font-mono leading-relaxed block"
        dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
      />
    </pre>
  );
};

const apiExamples = [
  {
    title: "Chat Completion",
    language: "TypeScript",
    code: `const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${LOVABLE_API_KEY}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'google/gemini-2.5-flash',
    messages: [
      { role: 'system', content: 'You are a helpful AI assistant' },
      { role: 'user', content: 'Explain quantum computing' }
    ]
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);`,
  },
  {
    title: "Streaming Response",
    language: "JavaScript",
    code: `const stream = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${LOVABLE_API_KEY}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'google/gemini-2.5-flash',
    messages: [{ role: 'user', content: 'Tell me a story' }],
    stream: true
  })
});

const reader = stream.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const text = decoder.decode(value);
  console.log(text);
}`,
  },
  {
    title: "Image Generation",
    language: "Python",
    code: `import requests

response = requests.post(
    'https://ai.gateway.lovable.dev/v1/chat/completions',
    headers={
        'Authorization': f'Bearer {LOVABLE_API_KEY}',
        'Content-Type': 'application/json'
    },
    json={
        'model': 'google/gemini-2.5-flash-image',
        'messages': [
            {
                'role': 'user',
                'content': 'Generate a sunset over mountains'
            }
        ],
        'modalities': ['image', 'text']
    }
)

data = response.json()
image_url = data['choices'][0]['message']['images'][0]['image_url']['url']
print(f"Generated image: {image_url}")`,
  },
  {
    title: "Function Calling",
    language: "TypeScript",
    code: `const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${LOVABLE_API_KEY}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'google/gemini-2.5-flash',
    messages: [
      { role: 'user', content: 'What is the weather in Tokyo?' }
    ],
    tools: [{
      type: 'function',
      function: {
        name: 'get_weather',
        description: 'Get weather for a location',
        parameters: {
          type: 'object',
          properties: {
            location: { type: 'string' },
            unit: { type: 'string', enum: ['celsius', 'fahrenheit'] }
          },
          required: ['location']
        }
      }
    }]
  })
});`,
  },
  {
    title: "Multi-Modal Input",
    language: "JavaScript",
    code: `const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${LOVABLE_API_KEY}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'google/gemini-2.5-flash',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: 'What is in this image?' },
        { 
          type: 'image_url', 
          image_url: { url: 'data:image/png;base64,...' }
        }
      ]
    }]
  })
});`,
  },
  {
    title: "Structured Output",
    language: "TypeScript",
    code: `const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${LOVABLE_API_KEY}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'google/gemini-2.5-flash',
    messages: [
      { role: 'user', content: 'Extract contact info from this email' }
    ],
    tools: [{
      type: 'function',
      function: {
        name: 'extract_contact',
        parameters: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' }
          }
        }
      }
    }],
    tool_choice: { type: 'function', function: { name: 'extract_contact' } }
  })
});`,
  },
];

interface TestimonialsSectionProps {
  showTestimonials: boolean;
}

export const TestimonialsSection = ({ showTestimonials }: TestimonialsSectionProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <AnimatedTransition show={showTestimonials} animation="slide-up" duration={600}>
      <div className="py-16 md:py-24">
        <div className="flex flex-col items-center gap-4 mb-12 text-center">
          <div className="inline-flex items-center gap-2">
            <Code2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl font-bold text-primary md:text-7xl">
            Powerful API Examples
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Get started with our AI API in minutes with these ready-to-use code examples
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {apiExamples.map((example, index) => (
            <Card
              key={index}
              className="bg-card/50 backdrop-blur border-primary/20 p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {example.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {example.language}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(example.code, index)}
                  className="hover:bg-primary/10"
                >
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <div className="flex-1">
                <SyntaxHighlight code={example.code} language={example.language} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AnimatedTransition>
  );
};