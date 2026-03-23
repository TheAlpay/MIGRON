import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex items-center justify-center px-6">
                    <div className="text-center max-w-md">
                        <p className="text-[#ccff00] font-black text-6xl mb-4">!</p>
                        <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">Bir Hata Oluştu</h1>
                        <p className="text-white/40 text-sm mb-6">Sayfa yüklenirken beklenmedik bir hata meydana geldi.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#ccff00] text-black px-6 py-2 font-black uppercase text-xs hover:brightness-110 transition-all"
                        >
                            Sayfayı Yenile
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
