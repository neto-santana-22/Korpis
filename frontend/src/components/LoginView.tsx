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
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold text-white tracking-wider">KORPIS</h1>
                    <p className="text-slate-400 text-sm">Sistema de Gestão Financeira & Cobranças</p>
                </div>

                {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                            E-mail de Acesso
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@korpis.com"
                            required
                            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                            Senha
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg transition duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Autenticando...' : 'Entrar no Sistema'}
                    </button>
                </form>

                <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-700/50">
                    Credenciais padrão de teste: <br />
                    <span className="text-slate-400">admin@korpis.com</span> / <span className="text-slate-400">admin123</span>
                </div>
            </div>
        </div>
    );
};