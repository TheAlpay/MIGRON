import React, { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

const AiTerminal = () => {
    const { t } = useLanguage();
    const [chatOpen, setChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [chatHistory, setChatHistory] = useState([
        { role: 'assistant', text: null } // will use t() in render
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;
        const userMessage = { role: 'user', text: chatInput };
        setChatHistory(prev => [...prev, userMessage]);
        setChatInput("");
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: chatInput })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Server error');
            }

            setChatHistory(prev => [...prev, { role: 'assistant', text: data.text }]);
        } catch (error) {
            setChatHistory(prev => [...prev, { role: 'assistant', text: t('chat_error') }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {!chatOpen && (
                <button
                    onClick={() => setChatOpen(true)}
                    className="fixed bottom-8 right-8 w-14 h-14 bg-[#ccff00] text-black rounded-none shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all z-40 flex items-center justify-center group"
                >
                    <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
                </button>
            )}

            {chatOpen && (
                <div className="fixed bottom-8 right-8 w-[360px] h-[520px] bg-black border-2 border-[#ccff00] z-50 flex flex-col shadow-[12px_12px_0px_0px_rgba(204,255,0,0.1)]">
                    <div className="p-3 bg-[#ccff00] text-black flex justify-between items-center font-black italic uppercase tracking-tighter text-sm">
                        <span>{t('chat_title')}</span>
                        <button onClick={() => setChatOpen(false)}><X size={18} strokeWidth={3} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[12px] font-mono leading-relaxed">
                        {chatHistory.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-3 max-w-[280px] ${msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00]'}`}>
                                    <span className="opacity-40 block mb-1">[{msg.role.toUpperCase()}]</span>
                                    {msg.text || t('chat_welcome')}
                                </div>
                            </div>
                        ))}
                        {isTyping && <div className="text-[#ccff00] animate-pulse font-bold tracking-widest">{">"} {t('chat_processing')}</div>}
                    </div>

                    <div className="p-3 border-t border-white/10 bg-[#0a0a0a] flex gap-2">
                        <input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={t('chat_placeholder')}
                            className="flex-1 bg-transparent border-b border-white/20 p-2 text-[#ccff00] outline-none focus:border-[#ccff00] font-mono text-sm"
                        />
                        <button onClick={handleSendMessage} className="p-2 text-[#ccff00] hover:scale-110 transition-transform"><Send size={20} /></button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AiTerminal;
