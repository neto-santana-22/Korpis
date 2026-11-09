import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { DashboardMetrics } from '../types';
import { formatCurrency } from '../utils/formatters';

interface DashboardViewProps {
    onClose: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onClose }) => {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const loadMetrics = async () => {
        try {
            setLoading(true);
            const response = await api.get<DashboardMetrics>('/dashboard');
            setMetrics(response.data);
        } catch (error) {
            console.error('Erro ao carregar métricas do dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMetrics();
    }, []);

    const totalAmount = (metrics?.totalReceivedAmount || 0) + (metrics?.totalPendingAmount || 0);
    const receivedPercentage = totalAmount > 0
        ? Math.round(((metrics?.totalReceivedAmount || 0) / totalAmount) * 100)
        : 0;

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Cabeçalho Fixo do Drawer Lateral */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Painel Métricas</h2>
                        <p className="text-xs text-slate-500">Resumo financeiro em tempo real</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={loadMetrics}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                        title="Atualizar Dados"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="Fechar"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Conteúdo com Rolagem Vertical Independente (Subir e Descer dentro do Painel) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {loading ? (
                    <div className="flex items-center justify-center py-12 text-slate-400 text-sm">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Carregando métricas...
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Recebido</span>
                                <p className="text-2xl font-bold text-slate-900">{formatCurrency(metrics?.totalReceivedAmount || 0)}</p>
                                <p className="text-xs text-emerald-600 font-medium">{receivedPercentage}% arrecadado</p>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Pendente</span>
                                <p className="text-2xl font-bold text-slate-900">{formatCurrency(metrics?.totalPendingAmount || 0)}</p>
                                <p className="text-xs text-amber-600 font-medium">Aguardando pagamento</p>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Clientes Ativos</span>
                                <p className="text-2xl font-bold text-slate-900">{metrics?.totalClients || 0}</p>
                                <p className="text-xs text-slate-500">Base cadastrada</p>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Cobranças Emitidas</span>
                                <p className="text-2xl font-bold text-slate-900">{metrics?.totalCharges || 0}</p>
                                <p className="text-xs text-slate-500">Total de transações</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                                <span>Taxa de Conversão</span>
                                <span className="text-emerald-600 font-bold">{receivedPercentage}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${receivedPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};