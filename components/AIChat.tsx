import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Cpu, Sparkles, AlertCircle } from 'lucide-react';
import { createChatSession, sendMessageToChat } from '../services/geminiService';
import { ChatMessage, SessionConfig } from '../types';
import ReactMarkdown from 'react-markdown';

interface Props {
  config: SessionConfig;
}

const AIChat: React.FC<Props> = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Halo! Saya asisten Administrasi Linux Anda. Saya tahu Anda sedang bekerja di ${config.ipAddress} (${config.domain}). Ada yang bisa saya bantu?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Re-initialize chat if config changes essentially (optional, but good for context)
  useEffect(() => {
    const systemPrompt = `Anda adalah asisten AI ahli Administrator Sistem Linux yang tertanam dalam aplikasi manajemen jarak jauh. 
    Pengguna saat ini sedang mengonfigurasi server dengan konteks berikut:
    OS: ${config.os}
    IP: ${config.ipAddress}
    Hostname: ${config.hostname}
    User: ${config.username}
    Domain: ${config.domain}
    
    Berikan perintah shell yang ringkas, akurat, dan penjelasannya dalam Bahasa Indonesia yang baik dan benar. 
    Jika pengguna meminta perintah, prioritaskan memberikan blok perintah yang tepat.
    Format perintah dalam blok kode markdown.`;
    
    chatSessionRef.current = createChatSession(systemPrompt);
  }, [config]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) throw new Error("Chat not initialized");
      const responseText = await sendMessageToChat(chatSessionRef.current, userMsg.text);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Saya mengalami kesalahan saat menghubungkan ke Gemini. Silakan periksa kunci API Anda." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full shadow-lg hover:shadow-cyan-500/20 transition-all active:scale-95 flex items-center gap-2"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="font-semibold hidden sm:inline">Tanya AI</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-[400px] h-[600px] max-h-[80vh] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-cyan-500/10 p-1.5 rounded-lg">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100">Bot SysAdmin</h3>
                <p className="text-xs text-slate-400">Didukung oleh Gemini 2.5 Flash</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 ${
                  msg.role === 'user' 
                    ? 'bg-cyan-600 text-white rounded-br-none' 
                    : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                }`}>
                  <div className="prose prose-invert prose-sm text-sm">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
               <div className="bg-slate-800 text-slate-200 rounded-2xl rounded-tl-none border border-slate-700 p-3 flex items-center gap-2">
                 <Cpu className="w-4 h-4 animate-spin text-cyan-500" />
                 <span className="text-xs text-slate-400">Sedang berpikir...</span>
               </div>
             </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-slate-800 border-t border-slate-700">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Tanya cara memperbaiki izin..."
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-2 p-1.5 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;