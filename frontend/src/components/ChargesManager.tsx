import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import type { Charge, Client } from '../types';
import { formatCurrency, maskCurrencyInput, parseCurrencyToNumber } from '../utils/formatters';

export const ChargesManager: React.FC = () => {
    const [charges, setCharges] = useState<Charge[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [selectedPix, setSelectedPix] = useState<string | null>(null);
    const [copied, setCopied] = useState<boolean>(false);

    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [clientId, setClientId] = useState<string>('');
    const [rawAmountInput, setRawAmountInput] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [chargesRes, clientsRes] = await Promise.all([
                api.get<Charge[]>('/charges'),
                api.get<Client[]>('/clients'),
            ]);
            setCharges(chargesRes.data);
            setClients(clientsRes.data);
            if (clientsRes.data.length > 0 && !clientId) {
                setClientId(clientsRes.data[0].id);
            }
        } catch (error) {
            console.error('Erro ao carregar cobranças:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRawAmountInput(maskCurrencyInput(e.target.value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseCurrencyToNumber(rawAmountInput);

        if (numericAmount <= 0) {
            alert('Informe um valor válido maior que zero.');
            return;
        }

        try {
            setSubmitting(true);
            const response = await api.post<Charge>('/charges/generate', {
                clientId,
                amount: numericAmount,
                description,
                dueDate: new Date(dueDate).toISOString(),
            });

            setSelectedPix(response.data.pixQrCode);
            setRawAmountInput('');
            setDescription('');
            setDueDate(new Date().toISOString().split('T')[0]);
            await loadData();
        } catch (error) {
            console.error('Erro ao gerar cobrança:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSimulatePayment = async (chargeId: string) => {
        try {
            await api.post(`/charges/${chargeId}/pay`);
            await loadData();
        } catch (error) {
            console.error('Erro ao simular pagamento:', error);
        }
    };

    const handleCancelCharge = async (chargeId: string) => {
        if (!confirm('Deseja realmente cancelar esta cobrança?')) return;
        try {
            await api.post(`/charges/${chargeId}/cancel`);
            await loadData();
        } catch (error) {
            console.error('Erro ao cancelar cobrança:', error);
        }
    };

    const handleCopyPix = () => {
        if (selectedPix) {
            navigator.clipboard.writeText(selectedPix);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const filteredCharges = useMemo(() => {
        return charges.filter((charge) => {
            if (statusFilter === 'pending') return charge.status === 1;
            if (statusFilter === 'paid') return charge.status === 2;
            if (statusFilter === 'canceled') return charge.status === 3;
            return true;
        });
    }, [charges, statusFilter]);

    const renderStatusBadge = (status: number) => {
        switch (status) {
            case 2:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Pago
                    </span>
                );
            case 3:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Cancelado
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Pendente
                    </span>
                );
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-xl font-bold text-slate-900">Cobranças & Pagamentos</h1>
                <p className="text-xs text-slate-500">Emita novas cobranças via Pix e consulte o histórico financeiro.</p>
            </div>

            {/* Form Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-sm font-semibold text-slate-900">Gerar Nova Cobrança (Pix)</h2>
                    <p className="text-xs text-slate-500">Preencha os valores para gerar a chave copia e cola.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Cliente</label>
                            <select
                                value={clientId}
                                onChange={(e) => setClientId(e.target.value)}
                                required
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            >
                                <option value="">Selecione um cliente</option>
                                {clients.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name} ({c.document})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Valor (R$)</label>
                            <input
                                type="text"
                                placeholder="R$ 0,00"
                                value={rawAmountInput}
                                onChange={handleAmountChange}
                                required
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Descrição</label>
                            <input
                                type="text"
                                placeholder="Ex: Mensalidade do Serviço"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Vencimento</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={submitting || clients.length === 0}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs shadow-sm transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Gerando...' : 'Gerar Cobrança Pix'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal / Alert Pix Gerado */}
            {selectedPix && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-emerald-900">Código Pix Copia e Cola Gerado</h3>
                        <button
                            onClick={() => setSelectedPix(null)}
                            className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 bg-white border border-slate-200 rounded"
                        >
                            Fechar
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            readOnly
                            value={selectedPix}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-700"
                        />
                        <button
                            onClick={handleCopyPix}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shrink-0 transition-colors"
                        >
                            {copied ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>
                </div>
            )}

            {/* Tabela Histórico */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden space-y-3">
                <div className="p-4 pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-900">Histórico de Lançamentos</h2>
                        <p className="text-xs text-slate-500">Lista completa de cobranças geradas.</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500">Filtrar:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none"
                        >
                            <option value="all">Todas ({charges.length})</option>
                            <option value="pending">Pendentes ({charges.filter(c => c.status === 1).length})</option>
                            <option value="paid">Pagas ({charges.filter(c => c.status === 2).length})</option>
                            <option value="canceled">Canceladas ({charges.filter(c => c.status === 3).length})</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-xs text-slate-500">Carregando cobranças...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-700">
                            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-y border-slate-200">
                                <tr>
                                    <th className="px-4 py-3">Ref ID</th>
                                    <th className="px-4 py-3">Valor</th>
                                    <th className="px-4 py-3">Descrição</th>
                                    <th className="px-4 py-3">Vencimento</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredCharges.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                                            Nenhuma cobrança registrada neste filtro.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCharges.map((charge) => (
                                        <tr key={charge.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-4 py-3 font-mono text-slate-500">{charge.externalId.slice(0, 8)}...</td>
                                            <td className="px-4 py-3 font-bold text-slate-900">{formatCurrency(charge.amount)}</td>
                                            <td className="px-4 py-3 text-slate-600">{charge.description}</td>
                                            <td className="px-4 py-3 text-slate-500">{new Date(charge.dueDate).toLocaleDateString('pt-BR')}</td>
                                            <td className="px-4 py-3">{renderStatusBadge(charge.status)}</td>
                                            <td className="px-4 py-3 text-right space-x-1.5">
                                                <button
                                                    onClick={() => setSelectedPix(charge.pixQrCode)}
                                                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium border border-slate-200 transition-colors"
                                                >
                                                    Ver Pix
                                                </button>
                                                {charge.status === 1 && (
                                                    <>
                                                        <button
                                                            onClick={() => handleSimulatePayment(charge.id)}
                                                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-xs font-medium border border-emerald-200 transition-colors"
                                                        >
                                                            Simular Baixa
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancelCharge(charge.id)}
                                                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-xs font-medium border border-rose-200 transition-colors"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </>
                                                )}
                                            </td>
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