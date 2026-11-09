import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { DashboardMetrics } from '../types';
import { formatCurrency } from '../utils/formatters';

export const DashboardView: React.FC = () => {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const loadMetrics = async () => {
        try {
            setLoading(true);
            const response = await api.get<DashboardMetrics>('/dashboard');
            setMetrics(response.data);
        } catch (error) {
            console.error('Erro ao carregar metricas do dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMetrics();
    }, []);

    if (loading) {
        return <div style={{ padding: '20px' }}>Carregando indicadores...</div>;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Painel de Indicadores Financeiros</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {/* Card: Total Recebido */}
                <div style={{ padding: '20px', border: '1px solid #28a745', borderRadius: '8px', background: '#f6ffed' }}>
                    <span style={{ fontSize: '14px', color: '#555' }}>Total Recebido</span>
                    <h3 style={{ margin: '10px 0 0 0', color: '#28a745', fontSize: '24px' }}>
                        {formatCurrency(metrics?.totalReceivedAmount || 0)}
                    </h3>
                </div>

                {/* Card: Total Pendente */}
                <div style={{ padding: '20px', border: '1px solid #ff9900', borderRadius: '8px', background: '#fffbe6' }}>
                    <span style={{ fontSize: '14px', color: '#555' }}>Total Pendente</span>
                    <h3 style={{ margin: '10px 0 0 0', color: '#d48806', fontSize: '24px' }}>
                        {formatCurrency(metrics?.totalPendingAmount || 0)}
                    </h3>
                </div>

                {/* Card: Total de Clientes */}
                <div style={{ padding: '20px', border: '1px solid #0066cc', borderRadius: '8px', background: '#e6f7ff' }}>
                    <span style={{ fontSize: '14px', color: '#555' }}>Clientes Cadastrados</span>
                    <h3 style={{ margin: '10px 0 0 0', color: '#0066cc', fontSize: '24px' }}>
                        {metrics?.totalClients || 0}
                    </h3>
                </div>

                {/* Card: Total de Cobrancas */}
                <div style={{ padding: '20px', border: '1px solid #888', borderRadius: '8px', background: '#f9f9f9' }}>
                    <span style={{ fontSize: '14px', color: '#555' }}>Cobrancas Emitidas</span>
                    <h3 style={{ margin: '10px 0 0 0', color: '#333', fontSize: '24px' }}>
                        {metrics?.totalCharges || 0}
                    </h3>
                </div>
            </div>
        </div>
    );
};