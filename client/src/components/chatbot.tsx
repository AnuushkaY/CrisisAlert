import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, X, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput("");

    // Simple mock responses
    setTimeout(() => {
      let botResponse = "I'm not sure how to help with that, but you can report waste hotspots using the 'New Report' button!";
      
      const lowerMsg = userMsg.toLowerCase();
      if (lowerMsg.includes("report")) {
        botResponse = "To report a hotspot, click the 'New Report' button, upload an image, and provide the location.";
      } else if (lowerMsg.includes("authority")) {
        botResponse = "Authorities can manage reports, change statuses, and view the city-wide hotspot map.";
      } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
        botResponse = "Hi there! Ready to make the city cleaner?";
      }

      setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
    }, 600);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50 hover:scale-105 transition-transform"
        size="icon"
      >
        {isOpen ? <X /> : <MessageSquare />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 h-96 shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <CardHeader className="bg-primary text-primary-foreground p-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bot className="h-4 w-4" />
              EcoBot Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        m.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-3 border-t flex gap-2">
              <Input
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="h-9"
              />
              <Button size="icon" className="h-9 w-9 shrink-0" onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
