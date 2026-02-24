import React, { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { CHAT_VERSION } from '../../config/constants';

const AiTerminal = () => {
    const [chatOpen, setChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [chatHistory, setChatHistory] = useState([
        { role: 'assistant', text: 'Sistem aktif. Avustralya hukuku ve göç prosedürleri hakkında teknik veri sağlayabilirim. Ne sormak istersin?' }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;
        const userMessage = { role: 'user', text: chatInput };
        setChatHistory(prev => [...prev, userMessage]);
        setChatInput("");
        setIsTyping(true);

        try {
            // Calls our Vercel Serverless proxy — API key is never exposed to the browser
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: chatInput })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Sunucu hatası');
            }

            setChatHistory(prev => [...prev, { role: 'assistant', text: data.text }]);
        } catch (error) {
            setChatHistory(prev => [...prev, { role: 'assistant', text: "Bağlantı kesildi. Lütfen tekrar deneyin." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {!chatOpen && (
                <button
                    onClick={() => setChatOpen(true)}
                    className="fixed bottom-10 right-10 w-20 h-20 bg-[#ccff00] text-black rounded-none shadow-[10px_10px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all z-40 flex items-center justify-center group"
                >
                    <MessageSquare className="group-hover:scale-125 transition-transform" />
                </button>
            )}

            {chatOpen && (
                <div className="fixed bottom-10 right-10 w-[400px] h-[600px] bg-black border-2 border-[#ccff00] z-50 flex flex-col shadow-[20px_20px_0px_0px_rgba(204,255,0,0.1)]">
                    <div className="p-4 bg-[#ccff00] text-black flex justify-between items-center font-black italic uppercase tracking-tighter">
                        <span>{CHAT_VERSION}</span>
                        <button onClick={() => setChatOpen(false)}><X size={20} strokeWidth={3} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[12px] font-mono leading-relaxed">
                        {chatHistory.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-4 ${msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00]'}`}>
                                    <span className="opacity-40 block mb-1">[{msg.role.toUpperCase()}]</span>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && <div className="text-[#ccff00] animate-pulse font-bold tracking-widest">{">"} SİSTEM İŞLENİYOR...</div>}
                    </div>

                    <div className="p-4 border-t border-white/10 bg-[#0a0a0a] flex gap-2">
                        <input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="KOMUT GİRİN..."
                            className="flex-1 bg-transparent border-b border-white/20 p-2 text-[#ccff00] outline-none focus:border-[#ccff00] font-mono"
                        />
                        <button onClick={handleSendMessage} className="p-2 text-[#ccff00] hover:scale-110 transition-transform"><Send size={24} /></button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AiTerminal;
