import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, X, Bot, Sparkles } from "lucide-react";

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Hello! I'm EcoBot. How can I help you with waste reporting today?" }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput("");

    // Realistic bot behavior
    setTimeout(() => {
      let botResponse = "I'm not sure how to help with that, but you can report waste hotspots using the 'New Report' button!";
      
      const lowerMsg = userMsg.toLowerCase();
      if (lowerMsg.includes("report") || lowerMsg.includes("how to")) {
        botResponse = "To report a hotspot: 1. Click 'New Report'. 2. Take a clear photo. 3. Our AI will verify the trash. 4. Pin the location and submit!";
      } else if (lowerMsg.includes("authority") || lowerMsg.includes("admin")) {
        botResponse = "Authorities use the Command Center to track reports and must upload AI-verified cleanup photos to resolve issues.";
      } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
        botResponse = "Hi there! I'm your EnvironmentTech assistant. Ready to make the neighborhood shine?";
      } else if (lowerMsg.includes("trash") || lowerMsg.includes("waste")) {
        botResponse = "We use MobileNet AI to identify waste. Make sure your photos are bright and the trash is clearly visible!";
      }

      setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
    }, 800);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-foreground z-50 hover:scale-110 active:scale-95 transition-all bg-accent text-foreground"
        size="icon"
      >
        {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
      </Button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] neo-card z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          <div className="bg-primary p-6 border-b-4 border-foreground flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 border-2 border-foreground rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-black text-white uppercase italic text-lg leading-none">EcoBot</h3>
                <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest">Active Assistant</span>
              </div>
            </div>
            <Sparkles className="h-5 w-5 text-secondary animate-pulse" />
          </div>
          
          <ScrollArea className="flex-1 p-6 bg-[#f8fafc]">
            <div className="space-y-6">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}
                >
                  <div
                    className={`max-w-[85%] rounded-[1.25rem] px-5 py-3 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-foreground ${
                      m.role === 'user'
                        ? 'bg-secondary text-foreground rounded-tr-none'
                        : 'bg-white text-foreground rounded-tl-none'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-4 bg-white border-t-4 border-foreground flex gap-3 items-center">
            <Input
              placeholder="Ask EcoBot..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="h-12 rounded-xl border-2 border-foreground bg-muted/30 font-bold focus:bg-white transition-colors"
            />
            <Button 
              size="icon" 
              className="h-12 w-12 shrink-0 neo-button p-0 bg-primary" 
              onClick={handleSend}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
