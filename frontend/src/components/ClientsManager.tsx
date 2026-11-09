import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import type { Client, CreateClientDto } from '../types';

export const ClientsManager: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [formData, setFormData] = useState<CreateClientDto>({
        name: '',
        document: '',
        email: '',
        phone: '',
    });

    const loadClients = async () => {
        try {
            setLoading(true);
            const response = await api.get<Client[]>('/clients');
            setClients(response.data);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClients();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await api.post('/clients', formData);
            setFormData({ name: '', document: '', email: '', phone: '' });
            await loadClients();
        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const filteredClients = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return clients;
        return clients.filter(
            (c) => c.name.toLowerCase().includes(term) || c.document.toLowerCase().includes(term)
        );
    }, [clients, searchTerm]);

    const getInitials = (name: string) => {
        const parts = name.trim().split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-xl font-bold text-slate-900">Gestão de Clientes</h1>
                <p className="text-xs text-slate-500">Cadastre e gerencie sua base de tomadores de serviço.</p>
            </div>

            {/* Form Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Cadastrar Novo Cliente</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo</label>
                            <input
                                type="text"
                                placeholder="Ex: Maria Silva"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">CPF ou CNPJ</label>
                            <input
                                type="text"
                                placeholder="000.000.000-00"
                                value={formData.document}
                                onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                                required
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail</label>
                            <input
                                type="email"
                                placeholder="cliente@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone</label>
                            <input
                                type="text"
                                placeholder="(11) 99999-9999"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs shadow-sm transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Cadastrando...' : 'Salvar Cliente'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Tabela de Clientes */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden space-y-3">
                <div className="p-4 pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-900">Base Registrada</h2>
                        <p className="text-xs text-slate-500">Total: {clients.length} cliente(s)</p>
                    </div>

                    <input
                        type="text"
                        placeholder="Buscar por nome ou documento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                </div>

                {loading ? (
                    <div className="p-8 text-center text-xs text-slate-500">Carregando clientes...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-700">
                            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-y border-slate-200">
                                <tr>
                                    <th className="px-4 py-3">Cliente</th>
                                    <th className="px-4 py-3">Documento</th>
                                    <th className="px-4 py-3">E-mail</th>
                                    <th className="px-4 py-3">Telefone</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredClients.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                                            Nenhum cliente encontrado.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredClients.map((client) => (
                                        <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-4 py-3 flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-semibold text-xs flex items-center justify-center border border-slate-200 shrink-0">
                                                    {getInitials(client.name)}
                                                </div>
                                                <span className="font-medium text-slate-900">{client.name}</span>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-slate-500">{client.document}</td>
                                            <td className="px-4 py-3 text-slate-600">{client.email}</td>
                                            <td className="px-4 py-3 text-slate-500">{client.phone}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};