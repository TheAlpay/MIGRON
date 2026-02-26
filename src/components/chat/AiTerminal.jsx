import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

// Local dev fallback — calls Groq directly from browser when /api/chat isn't available
const VITE_GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;

const callGroqDirect = async (message) => {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${VITE_GROQ_KEY}`
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: 'Sen MIGRON platformunun yapay zeka asistanısın. Avustralya göçmenlik hukuku, vize süreçleri ve yasal prosedürler konusunda uzmanlaşmış, profesyonel ve kısa yanıtlar veren bir hukuki asistansın. Türkçe veya İngilizce soruları anlayıp Türkçe yanıt ver.'
                },
                { role: 'user', content: message }
            ],
            max_tokens: 800,
            temperature: 0.7
        })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || 'Groq API error');
    return data.choices?.[0]?.message?.content || 'Yanıt alınamadı.';
};

const AiTerminal = () => {
    const { t } = useLanguage();
    const [chatOpen, setChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { role: 'assistant', text: null }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isTyping]);

    const handleSendMessage = async () => {
        const messageText = chatInput.trim();
        if (!messageText) return;

        setChatHistory(prev => [...prev, { role: 'user', text: messageText }]);
        setChatInput('');
        setIsTyping(true);

        try {
            // 1st: try the Vercel serverless proxy (production)
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

            // 2nd: fallback — direct Groq call (local dev)
            if (VITE_GROQ_KEY) {
                const text = await callGroqDirect(messageText);
                setChatHistory(prev => [...prev, { role: 'assistant', text }]);
                return;
            }

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
