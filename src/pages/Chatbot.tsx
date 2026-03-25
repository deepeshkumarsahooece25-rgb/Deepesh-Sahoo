import { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Send, User, Sparkles } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: "user" | "model"; text: string }[]>([
    { role: "model", text: "Hi! I'm your SmartBaby assistant. How can I help you with your baby today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are a helpful, empathetic, and knowledgeable baby care assistant. Give concise, practical advice to parents.",
        },
      });

      // Send history
      for (let i = 1; i < messages.length; i++) {
        await chat.sendMessage({ message: messages[i].text });
      }

      const response = await chat.sendMessage({ message: userMessage });
      setMessages((prev) => [...prev, { role: "model", text: response.text || "I'm not sure how to answer that." }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "model", text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 shrink-0">Baby Assistant</h2>
      
      <Card className="flex-1 overflow-hidden flex flex-col shadow-sm border-slate-100 bg-white/50 backdrop-blur-sm">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-end gap-2 max-w-[85%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                msg.role === "user" ? "bg-blue-500 text-white" : "bg-pink-100 text-pink-500"
              )}>
                {msg.role === "user" ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              </div>
              <div className={cn(
                "p-3 rounded-2xl text-sm shadow-sm",
                msg.role === "user" 
                  ? "bg-blue-500 text-white rounded-br-none" 
                  : "bg-white border border-slate-100 text-slate-700 rounded-bl-none"
              )}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-end gap-2 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 rounded-bl-none shadow-sm flex gap-1">
                <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        
        <div className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about feeding, sleep, or care..."
            className="rounded-full bg-slate-50 border-slate-200"
          />
          <Button 
            onClick={sendMessage} 
            disabled={loading || !input.trim()} 
            size="icon" 
            className="rounded-full bg-pink-500 hover:bg-pink-600 text-white shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
