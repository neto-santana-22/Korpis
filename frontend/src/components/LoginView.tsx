import React, { useState } from 'react';
import { api } from '../services/api';

interface LoginViewProps {
    onLoginSuccess: (user: { name: string; email: string }) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, name, email: userEmail } = response.data;

            localStorage.setItem('korpis_token', token);
            localStorage.setItem('korpis_user', JSON.stringify({ name, email: userEmail }));

            onLoginSuccess({ name, email: userEmail });
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'E-mail ou senha inválidos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-md border border-slate-200 p-8 space-y-6">
                <div className="text-center space-y-1.5">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">KORPIS</h1>
                    <p className="text-slate-500 text-xs">Gestão Financeira & Cobranças</p>
                </div>

                {errorMsg && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-xs text-center font-medium">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            E-mail de Acesso
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu-email@empresa.com"
                            required
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Senha
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? 'Autenticando...' : 'Entrar no Sistema'}
                    </button>
                </form>
            </div>
        </div>
    );
};