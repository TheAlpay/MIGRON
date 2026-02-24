import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { Scale, LogIn, AlertCircle } from 'lucide-react';

const AdminLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            onLogin(userCredential.user);
        } catch (err) {
            setError('Geçersiz email veya şifre.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                <div className="flex items-center gap-3 mb-12 justify-center">
                    <div className="bg-[#ccff00] p-2">
                        <Scale className="text-black" size={28} strokeWidth={3} />
                    </div>
                    <span className="font-black text-3xl tracking-tighter uppercase italic text-white">
                        MIGRON
                    </span>
                </div>

                <div className="bg-[#111] border border-white/10 p-8">
                    <h2 className="text-xl font-black uppercase tracking-tight text-[#ccff00] mb-8">
                        Admin Girişi
                    </h2>

                    {error && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 p-3 mb-6 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black border border-white/20 p-3 text-white outline-none focus:border-[#ccff00] transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Şifre</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black border border-white/20 p-3 text-white outline-none focus:border-[#ccff00] transition-colors"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#ccff00] text-black font-black uppercase tracking-wider py-4 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <LogIn size={18} />
                            {loading ? 'GİRİŞ YAPILIYOR...' : 'GİRİŞ YAP'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
