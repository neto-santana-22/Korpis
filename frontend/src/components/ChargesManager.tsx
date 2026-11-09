import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Charge, Client } from '../types';
import { formatCurrency, maskCurrencyInput, parseCurrencyToNumber } from '../utils/formatters';

export const ChargesManager: React.FC = () => {
    const [charges, setCharges] = useState<Charge[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedPix, setSelectedPix] = useState<string | null>(null);

    // Estado local para a digitacao do formulario (com valor inicial de moeda formatado)
    const [clientId, setClientId] = useState<string>('');
    const [rawAmountInput, setRawAmountInput] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // Carrega clientes e cobrancas do backend
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
            console.error('Erro ao carregar dados de cobrancas:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Trata a digitacao do campo de valor formatando em tempo real
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const masked = maskCurrencyInput(e.target.value);
        setRawAmountInput(masked);
    };

    // Submete a geracao de nova cobranca
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseCurrencyToNumber(rawAmountInput);

        if (numericAmount <= 0) {
            alert('Informe um valor valido maior que zero.');
            return;
        }

        try {
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
            console.error('Erro ao gerar cobranca:', error);
        }
    };

    // Simula a baixa de pagamento (Webhook)
    const handleSimulatePayment = async (chargeId: string) => {
        try {
            await api.post(`/charges/${chargeId}/pay`);
            await loadData();
        } catch (error) {
            console.error('Erro ao simular pagamento:', error);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Geracao de Cobrancas (Pix / Boleto)</h2>

            {/* Formulario de Emissao */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
                <label>
                    Cliente:
                    <select
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        required
                    >
                        <option value="">Selecione um cliente</option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                                {client.name} ({client.document})
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Valor (R$):
                    <input
                        type="text"
                        placeholder="R$ 0,00"
                        value={rawAmountInput}
                        onChange={handleAmountChange}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        required
                    />
                </label>

                <label>
                    Descricao:
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        required
                    />
                </label>

                <label>
                    Data de Vencimento:
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        required
                    />
                </label>

                <button type="submit" style={{ padding: '10px', background: '#0066cc', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    Gerar Cobranca Pix
                </button>
            </form>

            {/* Modal/Caixa exibindo o Pix gerado */}
            {selectedPix && (
                <div style={{ background: '#e6fffa', border: '1px solid #38b2ac', padding: '15px', marginBottom: '20px', borderRadius: '4px' }}>
                    <h3>Pix Gerado com Sucesso!</h3>
                    <p><strong>Codigo Pix Copia e Cola:</strong></p>
                    <textarea readOnly value={selectedPix} style={{ width: '100%', height: '60px' }} />
                    <button onClick={() => setSelectedPix(null)} style={{ marginTop: '10px' }}>Fechar</button>
                </div>
            )}

            {/* Tabela de Historico */}
            <h3>Historico de Cobrancas</h3>
            {loading ? (
                <p>Carregando cobrancas...</p>
            ) : (
                <table border={1} cellPadding={8} cellSpacing={0} style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f2f2f2' }}>
                            <th>ID Externo</th>
                            <th>Valor</th>
                            <th>Descricao</th>
                            <th>Vencimento</th>
                            <th>Status</th>
                            <th>Acoes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {charges.map((charge) => (
                            <tr key={charge.id}>
                                <td><small>{charge.externalId}</small></td>
                                <td>{formatCurrency(charge.amount)}</td>
                                <td>{charge.description}</td>
                                <td>{new Date(charge.dueDate).toLocaleDateString('pt-BR')}</td>
                                <td>
                                    <strong style={{ color: charge.status === 2 ? 'green' : 'orange' }}>
                                        {charge.status === 2 ? 'Pago' : 'Pendente'}
                                    </strong>
                                </td>
                                <td>
                                    <button onClick={() => setSelectedPix(charge.pixQrCode)} style={{ marginRight: '8px' }}>
                                        Ver Pix
                                    </button>
                                    {charge.status !== 2 && (
                                        <button
                                            onClick={() => handleSimulatePayment(charge.id)}
                                            style={{ background: '#28a745', color: '#fff', border: 'none', padding: '4px 8px', cursor: 'pointer' }}
                                        >
                                            Simular Pagamento
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};