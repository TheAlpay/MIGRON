import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

// In local dev (npm run dev), /api/chat doesn't exist (Vercel serverless only runs in prod
// or with `vercel dev`). As a fallback, we call Gemini directly from the browser using
// VITE_GEMINI_API_KEY. This is NOT exposed in production builds (only /api/chat is used there).
const VITE_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const callGeminiDirect = async (message) => {
    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${VITE_GEMINI_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Role: Professional Legal Assistant for Migron. Context: Australian Migration Law. Style: Direct, slightly academic, no fluff. Query: ${message}` }] }]
            })
        }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || 'Gemini API error');
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Veri hattında hata.';
};

const AiTerminal = () => {
    const { t } = useLanguage();
    const [chatOpen, setChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { role: 'assistant', text: null } // rendered with t('chat_welcome')
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isTyping]);

    const handleSendMessage = async () => {
        // Capture BEFORE clearing — this was the original bug
        const messageText = chatInput.trim();
        if (!messageText) return;

        setChatHistory(prev => [...prev, { role: 'user', text: messageText }]);
        setChatInput('');
        setIsTyping(true);

        try {
            // 1st: try the Vercel serverless proxy (works in production)
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText })
            });

            if (response.ok) {
                const data = await response.json();
                setChatHistory(prev => [...prev, { role: 'assistant', text: data.text }]);
                return;
            }

            // 2nd: if proxy fails (e.g. 404 in local dev), try direct Gemini call
            if (VITE_GEMINI_KEY) {
                const text = await callGeminiDirect(messageText);
                setChatHistory(prev => [...prev, { role: 'assistant', text }]);
                return;
            }

            // Both failed
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || `HTTP ${response.status}`);

        } catch (error) {
            console.error('AI Terminal error:', error.message);
            setChatHistory(prev => [...prev, {
                role: 'assistant',
                text: `⚠ ${error.message || t('chat_error')}`
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {!chatOpen && (
                <button
                    onClick={() => setChatOpen(true)}
                    className="fixed bottom-8 right-8 w-14 h-14 bg-[#ccff00] text-black rounded-none shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all z-40 flex items-center justify-center group"
                    aria-label="AI Terminal'i aç"
                >
                    <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
                </button>
            )}

            {chatOpen && (
                <div className="fixed bottom-8 right-8 w-[360px] h-[520px] bg-black border-2 border-[#ccff00] z-50 flex flex-col shadow-[12px_12px_0px_0px_rgba(204,255,0,0.1)]">
                    <div className="p-3 bg-[#ccff00] text-black flex justify-between items-center font-black italic uppercase tracking-tighter text-sm">
                        <span>{t('chat_title')}</span>
                        <button onClick={() => setChatOpen(false)} aria-label="Kapat"><X size={18} strokeWidth={3} /></button>
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
                        {isTyping && (
                            <div className="text-[#ccff00] animate-pulse font-bold tracking-widest">
                                {'>'} {t('chat_processing')}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 border-t border-white/10 bg-[#0a0a0a] flex gap-2">
                        <input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t('chat_placeholder')}
                            className="flex-1 bg-transparent border-b border-white/20 p-2 text-[#ccff00] outline-none focus:border-[#ccff00] font-mono text-sm"
                            disabled={isTyping}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isTyping || !chatInput.trim()}
                            className="p-2 text-[#ccff00] hover:scale-110 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Gönder"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AiTerminal;
