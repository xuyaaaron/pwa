
import React, { useState, useEffect } from 'react';

interface PasswordGateProps {
    children: React.ReactNode;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ children }) => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        setIsChecking(false);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === '888') {
            setIsAuthenticated(true);
            setError(false);
        } else {
            setError(true);
            setPassword('');
            setTimeout(() => setError(false), 500);
        }
    };

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-[100dvh] flex items-center justify-center bg-[#f2f2f7] p-6 font-sans">
            <div className="max-w-md w-full bg-white rounded-[24px] shadow-sm p-10 transform transition-all duration-300">
                <div className="text-center mb-10">
                    <div className="bg-primary w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-indigo-100 shadow-xl">
                        <span className="material-symbols-outlined text-white text-4xl">lock_open</span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">AlphaTrack</h1>
                    <p className="text-gray-400 mt-2 text-sm font-medium">请输入访问密码以继续</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <input
                            type="password"
                            inputMode="numeric"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••"
                            className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-[18px] outline-none transition-all duration-200 text-center text-3xl tracking-[1em] placeholder:tracking-normal placeholder:text-gray-200 ${error ? 'border-red-400 animate-shake' : 'border-transparent focus:border-primary/20 focus:bg-white'
                                }`}
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-[18px] transition-all duration-200 transform active:scale-[0.98] shadow-lg shadow-blue-100 mt-4"
                    >
                        立即进入
                    </button>
                </form>

                <div className="mt-12 text-center">
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest leading-loose">
                        Workload Tracking System<br />
                        © 2026 Internal Access Only
                    </p>
                </div>
            </div>

            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
        </div>
    );
};
