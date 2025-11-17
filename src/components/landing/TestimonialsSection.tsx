import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AnimatedTransition } from "@/components/AnimatedTransition";
import { Code2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
                <pre className="bg-muted/30 rounded-lg p-4 overflow-x-auto border border-border/50 h-full">
                  <code className="text-xs text-foreground font-mono leading-relaxed">
                    {example.code}
                  </code>
                </pre>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AnimatedTransition>
  );
};